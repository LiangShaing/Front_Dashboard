<template>
  <div id="reviewStageEdit">
    <v-card-title class="font-weight-black pb-0 ml-2">
      <v-icon>edit</v-icon>
      {{pageTitle}}
    </v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-col cols="12" sm="12" md="11" lg="11" class="pa-0 ma-0">
          <form-option title="標題*" titleClass="ma-2">
            <v-text-field
              outlined
              dense
              type="text"
              v-model="form.title"
              :disabled="disabled"
              :rules="requiredRules"
            ></v-text-field>
          </form-option>

          <form-option title="內文*" rowHeight="auto" titleClass="ma-2">
            <!-- <document-editor
            @getData="handleGetEditorData"
            :contents="JSON.parse(JSON.stringify(form.contents))"
            ></document-editor>-->
            <v-textarea
              outlined
              label
              v-model="form.contents"
              :disabled="disabled"
              :rules="requiredRules"
            ></v-textarea>
          </form-option>

          <form-option title="排序*" contentWidth="20%" titleClass="ma-2">
            <v-text-field
              outlined
              dense
              type="number"
              v-model="form.sort"
              :disabled="disabled"
              min="0"
              :rules="requiredRules"
              :messages="['目前最大排序：'+maxSort]"
            ></v-text-field>
          </form-option>
        </v-col>

        <v-col class="pa-0 ma-3" cols="12">
          <!-- <date-picker
            flex
            @getDate="handleGetDate"
            startLabelText="上架時間"
            endLabelText="下架時間"
            enableTime
            :defaultStartDate="date.startDate"
            :defaultEndDate="date.endDate"
            :defaultStartTimeH="date.startHour"
            :defaultStartTimeM="date.startMin"
            :defaultEndTimeH="date.endHour"
            :defaultEndTimeM="date.endMin"
          ></date-picker>-->

          <doc-review
            :form="form"
            :disabled="disabled || form.status===caseEnum.r || form.status===caseEnum.a"
          ></doc-review>
        </v-col>
        <action-btn
          :caseAction="action"
          :currentPageAuth="currentPageAuth"
          :currentCaseStatus="currentStatus"
          :currentCaseIsDelete="currentIsDelete"
          :valid="valid"
          @back="back"
          @preview="preview"
          @checkSave="save"
          @auditSuccess="auditSuccess"
          @inputRejectMessage="inputRejectMessage"
        ></action-btn>
      </v-card-text>
    </v-form>

    <profile-dialog profileWidth="400px" ref="rejectDialog">
      <template #dialog-content>
        <div class="text-center">退件原因 :</div>
        <v-textarea outlined label v-model="rejectMessages"></v-textarea>
      </template>

      <template #dialog-close>
        <v-btn color="primary">取消</v-btn>
      </template>

      <template #dialog-save>
        <v-btn color="primary" @click="reject">確認</v-btn>
      </template>
    </profile-dialog>
  </div>
</template>

<script>
import dateUtil from "@/util/dateUtil";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
import Util from "@/util";
export default {
  layout: "audit/template",
  components: {},
  props: {
    pageTitle: {
      type: String,
      default: ""
    },
    dataSource: {
      type: Object,
      default: null
    },
    currentPageAuth: {
      type: Array,
      default: []
    }
  },
  data: () => ({
    maxSort: 0,
    requiredRules: [v => !!v || "↑不能為空"],
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    action: "add",
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,
    form: {
      status: caseEnum.d,
      title: "",
      contents: "",
      sort: "",
      // onTime: dateUtil.formatDateFun("yyyy-MM-dd hh:mm:ss", new Date()),
      // offTime: dateUtil.formatDateFun("yyyy-MM-dd hh:mm:ss", new Date()),
      onTime: "",
      offTime: "",
      isDelete: caseEnum.n,
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      originalState: ""
    },
    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      startHour: "00",
      startMin: "00",
      endHour: "23",
      endMin: "59"
    },
    disabled: false,
    rejectMessages: "",
    valid: true
  }),
  methods: {
    async getMaxSort() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_reviewperiod_temp_rest_getMaxSort"
      });
      if (res !== null && res !== undefined) {
        this.maxSort = res;
      }
    },
    preview() {
      window.open(previewUrl.reviewStage + "/?preview=true", "_blank");
    },
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_reviewperiod",
        params: { uid: this.form.uid, message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        this.$emit("complete");
      }
    },
    async auditSuccess() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_reviewperiod",
        params: {
          uid: this.form.uid,
          onTime: this.form.onTime,
          offTime: this.form.offTime
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        this.$emit("complete");
      }
    },
    handleGetDate(data) {
      this.form.onTime =
        data.startDate === null || data.startDate === ""
          ? null
          : data.startDate + " " + data.startTime;
      this.form.offTime =
        data.endDate === null || data.endDate === ""
          ? null
          : data.endDate + " " + data.endTime;
    },
    back() {
      this.$emit("back");
    },
    async save(status) {
      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.dispatch("alert", "請檢查*為必填欄位");
        return;
      }

      this.form.status = status;
      this.form.isDelete = this.caseEnum.n;
      if (this.form.uid === "") {
        delete this.form.uid;
      }

      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_reviewperiod",
        params: this.form
      });

      if (res !== null && res !== undefined) {
        if (this.form.status === caseEnum.d) {
          this.$store.dispatch("alert", "儲存成功");
          this.$emit("complete");
        } else {
          this.$store.dispatch("alert", "送出成功");
          this.$emit("complete");
        }
      }
    },
    editData() {
      if (this.dataSource !== null && this.dataSource !== undefined) {
        this.action = "edit";
        let clone = JSON.parse(JSON.stringify(this.dataSource));
        this.form.title = clone.title;
        this.form.contents = clone.contents;
        this.form.sort = clone.sort;
        this.form.uid = clone.uid;
        this.form.status = clone.status;
        this.form.isDelete = clone.isDelete;
        this.currentIsDelete = clone.isDelete;
        this.form.docReview = Util.isBlank(clone.docReview)
          ? caseEnum.docReview_n
          : clone.docReview;
        this.form.docReviewNo = Util.isEmpty(clone.docReviewNo)
          ? ""
          : clone.docReviewNo;

        this.currentStatus = clone.status;
        if (clone.status === caseEnum.r || clone.status === caseEnum.a) {
          this.disabled = true;
        }

        dateUtil.combinationDate(this.date, clone);
        this.form.originalState = JSON.stringify(this.dataSource);
      }
    }
  },
  watch: {
    "form.docReview": function(val, oldVal) {
      if (val === caseEnum.docReview_n) {
        this.form.docReviewNo = null;
      }
    }
  },
  mounted() {
    this.getMaxSort();
    this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};
</script>

<style lang="css" scoped>
</style>


<template>
  <div id="friendly">
    <v-card-title class="font-weight-black">金融友善專區</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-col cols="12" sm="12" md="11" lg="11" class="pa-0 ma-0">
          <v-col cols="12" sm="12" md="12" lg="12" class="pa-0 ma-0">
            <form-option title="說明" rowHeight="auto">
              <document-editor
                v-if="!disabled"
                @getData="(data)=>handleGetEditorData('title',data)"
                :contents="JSON.parse(JSON.stringify(form.title))"
                valid
              ></document-editor>
              <v-textarea v-else outlined label :value="form.title" :disabled="disabled"></v-textarea>
            </form-option>
            <form-option title="內文" rowHeight="auto">
              <document-editor
                v-if="!disabled"
                @getData="(data)=>handleGetEditorData('contents',data)"
                :contents="JSON.parse(JSON.stringify(form.contents))"
                valid
              ></document-editor>
              <v-textarea v-else outlined label :value="form.contents" :disabled="disabled"></v-textarea>
            </form-option>

            <panel-single
              label="應備文件檔案"
              :dataSourceList="pdfFileList"
              inputType="fileInput"
              enAction
              :stockItems="stockItems"
              :disabled="disabled"
              addButtonText="新增文件檔案"
            ></panel-single>
          </v-col>

          <v-col class="pa-0 mt-2" cols="12">
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
              :disabled="disabled || currentStatus===caseEnum.r || currentStatus===caseEnum.a"
            ></doc-review>
          </v-col>
        </v-col>

        <action-btn
          :currentPageAuth="currentPageAuth"
          :currentCaseStatus="currentStatus"
          :currentCaseIsDelete="currentIsDelete"
          :valid="valid"
          @preview="preview"
          @checkSave="checkSave"
          @auditSuccess="auditSuccess"
          @inputRejectMessage="inputRejectMessage"
          :btn="[ 'preview', 'save', 'audit', 'reject']"
        ></action-btn>
      </v-card-text>
    </v-form>

    <profile-dialog profileWidth="400px" ref="confirmDialog">
      <template #dialog-content>
        <div class="text-center">檔名已重複 : {{confirmMessages}}</div>
        <div class="text-center">確認覆蓋?</div>
      </template>

      <template #dialog-close>
        <v-btn color="primary">取消</v-btn>
      </template>

      <template #dialog-save>
        <v-btn color="primary" @click="save">確認</v-btn>
      </template>
    </profile-dialog>

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
import Util from "@/util";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {},
  props: {},
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  data: () => ({
    dataSource: null,
    requiredRules: [v => !!v || "↑不能為空"],
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,
    confirmMessages: "",
    disabled: false,
    rejectMessages: "",
    valid: true,
    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      startHour: "00",
      startMin: "00",
      endHour: "23",
      endMin: "59"
    },

    stockItems: [],
    pdfFileList: [],

    form: {
      title: "",
      contents: "",
      aboutFriendlyPdfDTOSet: [],
      status: caseEnum.d,
      onTime: "",
      offTime: "",
      // onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      // offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date()),
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      isDelete: caseEnum.n,
      originalState: ""
    }
  }),
  methods: {
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_about_friendly",
        params: { uid: this.form.uid, message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        await this.getData();
        await this.editData();
      }
    },
    async auditSuccess() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_about_friendly",
        params: {
          uid: this.form.uid,
          onTime: this.form.onTime,
          offTime: this.form.offTime
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        await this.getData();
        await this.editData();
      }
    },
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItems = data;
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
    handleGetEditorData(param, data) {
      this.form[param] = data;
    },
    async checkSave(status) {
      this.confirmMessages = "";

      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.dispatch("alert", "請檢查*為必填欄位");
        return;
      }

      let checkFile = [];

      let bln = false;
      this.form.aboutFriendlyPdfDTOSet = [];
      for (const ele of this.pdfFileList) {
        const pdf = await Util.pdfProcess(
          checkFile,
          { fileInput: ele },
          "fileType",
          "fileUpload",
          "fileStock"
        );
        if (!pdf) {
          this.$store.dispatch("alert", "上傳檔案需為PDF並且不能為空");
          bln = true;
          return false;
        } else {
          let obj = {
            title: pdf.fileName,
            sort: "",
            isDelete: caseEnum.n,
            resourcesReq: pdf
          };
          this.form.aboutFriendlyPdfDTOSet.push(obj);
        }
      }
      if (bln) {
        return;
      }

      if (this.form.uid === "") {
        delete this.form.uid;
      }

      this.form.status = status;
      this.form.isDelete = this.caseEnum.n;

      if (checkFile.length === 0) {
        this.save();
      } else {
        const res = await this.$store.dispatch("getCheckFileName", {
          fileNameList: checkFile
        });

        if (res !== null && res !== undefined) {
          if (res._embedded.resourcesTemps.length !== 0) {
            res._embedded.resourcesTemps.forEach((ele, index) => {
              if (
                this.confirmMessages !== "" &&
                res._embedded.resourcesTemps.length > index
              ) {
                this.confirmMessages = this.confirmMessages + ",";
              }
              this.confirmMessages = this.confirmMessages + ele.fileName;
            });
            this.$refs.confirmDialog.toggle(true);
          } else {
            this.save();
          }
        }
      }
    },
    async save() {
      window.setTimeout(async () => {
        const res = await this.$store.dispatch("actionApi", {
          method: "post",
          url: "api_about_friendly",
          params: this.form
        });
        if (res !== null && res !== undefined) {
          if (this.form.status === caseEnum.d) {
            this.$store.dispatch("alert", "儲存成功");
            await this.getData();
            await this.editData();
          } else {
            this.$store.dispatch("alert", "送出成功");
            await this.getData();
            await this.editData();
          }
        }
      }, 500);
    },
    editData() {
      if (this.dataSource) {
        let clone = JSON.parse(JSON.stringify(this.dataSource));
        this.form.uid = clone.uid;
        this.form.status = clone.status;
        this.form.docReview = Util.isBlank(clone.docReview)
          ? caseEnum.docReview_n
          : clone.docReview;
        this.form.docReviewNo = Util.isEmpty(clone.docReviewNo)
          ? ""
          : clone.docReviewNo;
        this.currentStatus = clone.status;
        if (clone.status === caseEnum.r || clone.status === caseEnum.a) {
          this.disabled = true;
        } else if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
        this.form.onTime = clone.onTime;
        this.form.offTime = clone.offTime;
        this.form.isDelete = Util.isEmpty(clone.isDelete)
          ? caseEnum.n
          : clone.isDelete;
        this.currentIsDelete = Util.isEmpty(clone.isDelete)
          ? caseEnum.n
          : clone.isDelete;
        this.form.title = Util.isEmpty(clone.title) ? "" : clone.title;
        this.form.contents = Util.isEmpty(clone.contents) ? "" : clone.contents;
        this.pdfFileList = clone.aboutFriendlyPdfDTOSet.map(ele => ({
          fileType: "stock",
          fileStock: ele.resourcesReq.fileName,
          fileUpload: []
        }));
        dateUtil.combinationDate(this.date, clone);
        this.form.originalState = JSON.stringify(this.dataSource);
      }
    },
    preview() {
      window.open(previewUrl.friendly + "/?preview=true", "_blank");
    },
    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_about_friendly"
      });
      this.dataSource = null;
      if (res !== null && res !== undefined) {
        this.dataSource = res;
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
  created() {
    this.getResource();
  },
  async mounted() {
    await this.getData();
    await this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};
</script>

<style lang="css" scoped>
</style>


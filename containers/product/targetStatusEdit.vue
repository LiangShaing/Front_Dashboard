<template>
  <div id="targetStatusEdit">
     <v-card-title class="font-weight-black pb-0 ml-2">
      <v-icon>edit</v-icon>
      {{pageTitle}}
    </v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-col class="pa-0 ma-0" cols="12" sm="12" md="10" lg="10">
          <form-option title="標題*">
            <v-text-field
              outlined
              dense
              type="text"
              v-model="form.title"
              :disabled="disabled"
              :rules="requiredRules"
            ></v-text-field>
          </form-option>

          <date-picker
            flex
            @getDate="handleGetDate"
            startLabelText="起始時間"
            endLabelText="結束時間"
            :defaultStartDate="date.startDate"
            :defaultEndDate="date.endDate"
            :disabled="disabled"
          ></date-picker>

          <form-generate
            :labels="fileLables"
            :dataSourceList="[pdfFile]"
            :stockItems="stockItems"
            :disabled="disabled"
          ></form-generate>

          <form-option title="內文*" rowHeight="auto">
            <document-editor
              v-if="!disabled"
              @getData="(data)=>handleGetEditorData(data)"
              :contents="form.contents"
              valid
            ></document-editor>
            <v-textarea v-else outlined label :value="form.contents" :disabled="disabled"></v-textarea>
          </form-option>

          <!-- <doc-review
            :form="form"
            :disabled="disabled || currentStatus===caseEnum.r || currentStatus===caseEnum.a"
          ></doc-review>-->
        </v-col>
        <action-btn
          :caseAction="action"
          :currentPageAuth="currentPageAuth"
          :currentCaseStatus="currentStatus"
          :currentCaseIsDelete="currentIsDelete"
          :valid="valid"
          @back="back"
          @preview="preview"
          @checkSave="checkSave"
          @auditSuccess="auditSuccess"
          @inputRejectMessage="inputRejectMessage"
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
    action: "add",
    requiredRules: [v => !!v || "↑不能為空"],
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    fileLables: fileLables,
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,
    stockItems: [],
    disabled: false,
    pdfFile: {
      fileInput: {
        pdfFile: [],
        pdfType: "upload",
        pdfStock: ""
      }
    },
    form: {
      status: caseEnum.d,
      title: "",
      beginDate: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date()),
      contents: "",
      isDelete: caseEnum.n,
      pdfFile: [],
      sort: "",
      type: "A",
      onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date()),
      docReview: caseEnum.docReview_n,
      docReviewNo: null
    },
    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date())
    },
    rejectMessages: "",
    valid: true
  }),
  methods: {
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_invest_market_info",
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
        url: "api_invest_market_info",
        params: {
          uid: this.form.uid,
          onTime: this.form.onTime,
          offTime: this.form.offTime,
          beginDate: this.form.onTime,
          endDate: this.form.offTime
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        this.$emit("complete");
      }
    },
    back() {
      this.$emit("back");
    },
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItems = data;
    },
    handleGetDate(data) {
      this.form.beginDate =
        data.startDate === null || data.startDate === ""
          ? null
          : data.startDate + " " + data.startTime;
      this.form.endDate =
        data.endDate === null || data.endDate === ""
          ? null
          : data.endDate + " " + data.endTime;

      this.form.onTime =
        data.startDate === null || data.startDate === ""
          ? null
          : data.startDate + " " + data.startTime;
      this.form.offTime =
        data.endDate === null || data.endDate === ""
          ? null
          : data.endDate + " " + data.endTime;
    },
    handleGetEditorData(data) {
      this.form.contents = data;
    },
    async checkSave(status) {
      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.dispatch("alert", "請檢查*為必填欄位");
        return;
      }

      if (this.form.contents === "") {
        this.$store.dispatch("alert", "請填寫內文");
        return;
      }

      this.form.status = status;
      this.form.isDelete = this.caseEnum.n;
      this.confirmMessages = "";
      let checkFile = [];
      const fileInput = this.pdfFile.fileInput;
      if (
        fileInput.pdfType === "upload" &&
        typeof fileInput.pdfFile === "object"
      ) {
        if (!process.env.PDF_TYPE.includes(fileInput.pdfFile.type)) {
          this.$store.dispatch("alert", "上傳檔案需為PDF");
          return;
        }

        let pdfFile = await Util.toBase64(fileInput.pdfFile);
        checkFile.push(fileInput.pdfFile.name);
        this.form.pdfFile = {
          contents: pdfFile,
          fileName: fileInput.pdfFile.name
        };
      } else {
        if (fileInput.pdfStock.indexOf(".pdf") === -1) {
          this.$store.dispatch("alert", "上傳檔案需為PDF");
          return;
        }

        this.form.pdfFile = {
          contents: "",
          fileName: fileInput.pdfStock
        };
      }

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
      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_invest_market_info",
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
    preview() {
      window.open(previewUrl.investment + "/?preview=true", "_blank");
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
  mounted() {
    if (this.dataSource) {
      this.action = "edit";
      const clone = JSON.parse(JSON.stringify(this.dataSource));
      this.form.title = clone.title;

      this.date.startDate =
        clone.beginDate === null ? null : clone.beginDate.split(" ")[0];
      this.date.endDate =
        clone.endDate === null ? null : clone.endDate.split(" ")[0];
      this.pdfFile.fileInput.pdfStock = clone.pdfFile;
      this.pdfFile.fileInput.pdfType = Util.fileType(clone.pdfFile);
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
      if (clone.status === "R" || clone.status === "A") {
        this.disabled = true;
      }
      this.currentStatus = clone.status;
    }

    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }

    window.scrollTo(0, 0);
  }
};
export const fileLables = [
  {
    text: "PDF檔案*",
    type: "fileInput",
    value: "pdfFile",
    value_stock: "pdfStock",
    option: "pdfType",
    valid: ["required"]
  }
];
</script>

<style lang="css" scoped>
</style>


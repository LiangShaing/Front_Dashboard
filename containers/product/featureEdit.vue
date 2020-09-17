<template>
  <div id="featureEdit">
     <v-card-title class="font-weight-black pb-0 ml-2">
      <v-icon>edit</v-icon>
      {{pageTitle}}
    </v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-col cols="12" sm="12" md="11" lg="11" class="pa-0 ma-0">
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

          <v-col cols="12" sm="12" md="12" lg="12" class="pa-0 ma-0">
            <form-generate
              :labels="bannerSettingLabels"
              :dataSourceList="[banner]"
              :stockItems="stockItems"
              :disabled="disabled"
            ></form-generate>
          </v-col>

          <v-col cols="12" sm="12" md="12" lg="12" class="pa-0 ma-0">
            <form-option title="內文*" rowHeight="auto">
              <document-editor
                v-if="!disabled"
                @getData="handleGetEditor1Data"
                :contents="JSON.parse(JSON.stringify(form.content))"
                valid
              ></document-editor>
              <v-textarea v-else outlined label :value="form.content" :disabled="disabled"></v-textarea>
            </form-option>
          </v-col>

          <form-option title="相關檔案標題">
            <v-text-field outlined dense type="text" v-model="form.pdfTitle" :disabled="disabled"></v-text-field>
          </form-option>

          <panel-single
            label="相關檔案"
            :dataSourceList="pdfFileList"
            inputType="fileInput"
            enAction
            :stockItems="stockItems"
            :disabled="disabled"
          ></panel-single>

          <form-option title="相關連結" rowHeight="auto">
            <document-editor
              v-if="!disabled"
              @getData="handleGetEditor2Data"
              :contents="JSON.parse(JSON.stringify(form.relatedLink))"
              valid
            ></document-editor>
            <v-textarea v-else outlined label :value="form.relatedLink" :disabled="disabled"></v-textarea>
          </form-option>

          <v-col cols="12" class="pa-0 ma-0" sm="4" md="4" lg="4">
            <form-option title="排序*">
              <v-text-field
                outlined
                dense
                type="number"
                placeholder
                v-model="form.sort"
                required
                :disabled="disabled"
                min="0"
                :rules="requiredRules"
                :messages="['目前最大排序：'+maxSort]"
              ></v-text-field>
            </form-option>
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
              :disabled="disabled || form.status===caseEnum.r || form.status===caseEnum.a"
            ></doc-review>
          </v-col>
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
    maxSort: 0,
    requiredRules: [v => !!v || "↑不能為空"],
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    bannerSettingLabels: bannerSettingLabels,
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,
    action: "add",
    stockItems: [],
    banner: {
      fileInput: {
        imagePathPcFile: [],
        imagePathPcStock: "",
        pcType: "upload",
        imagePathPadFile: [],
        imagePathPadStock: "",
        padType: "upload",
        imagePathMobileFile: [],
        imagePathMobileStock: "",
        mobileType: "upload"
      }
    },
    pdfFileList: [],
    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      startHour: "00",
      startMin: "00",
      endHour: "23",
      endMin: "59"
    },
    form: {
      status: caseEnum.d,
      imagePad: { fileName: "", contents: "" },
      imagePc: { fileName: "", contents: "" },
      imageMobile: { fileName: "", contents: "" },
      isDelete: caseEnum.n,
      title: "",
      content: "",
      pdfTitle: "",
      pdfFiles: [],
      relatedLink: "",
      sort: "",
      // onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      // offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date()),
      onTime: "",
      offTime: "",
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      originalState: ""
    },
    confirmMessages: "",
    disabled: false,
    rejectMessages: "",
    valid: true
  }),
  methods: {
    async getMaxSort() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_feature_temp_rest_getMaxSort"
      });
      if (res !== null && res !== undefined) {
        this.maxSort = res;
      }
    },
    preview() {
      window.open(previewUrl.feature + "/?preview=true", "_blank");
    },
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_feature",
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
        url: "api_feature",
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
    back() {
      this.$emit("back");
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
    handleGetEditor1Data(data) {
      this.form.content = data;
    },
    handleGetEditor2Data(data) {
      this.form.relatedLink = data;
    },
    async checkSave(status) {
      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.dispatch("alert", "請檢查*為必填欄位");
        return;
      }

      if (this.form.content === "") {
        this.$store.dispatch("alert", "請填寫內文");
        return;
      }
      this.form.status = status;
      this.form.isDelete = this.caseEnum.n;
      this.confirmMessages = "";
      let checkFile = [];
      const pc = await Util.imageProcess(
        checkFile,
        this.banner,
        "pcType",
        "imagePathPcFile",
        "imagePathPcStock"
      );
      if (!pc) {
        this.$store.dispatch("alert", "標題底圖-PC 不能為空且上傳檔案需為圖檔");
        return;
      } else {
        this.form.imagePc = pc;
      }

      const pad = await Util.imageProcess(
        checkFile,
        this.banner,
        "padType",
        "imagePathPadFile",
        "imagePathPadStock"
      );
      if (!pad) {
        this.$store.dispatch("alert", "標題底圖-Pad 檔案需為圖檔");
        return;
      } else {
        this.form.imagePad = pad;
      }

      const mobile = await Util.imageProcess(
        checkFile,
        this.banner,
        "mobileType",
        "imagePathMobileFile",
        "imagePathMobileStock"
      );
      if (!mobile) {
        this.$store.dispatch("alert", "標題底圖-手機 檔案需為圖檔");
        return;
      } else {
        this.form.imageMobile = mobile;
      }

      if (this.pdfFileList.length !== 0) {
        this.form.pdfFiles = [];
        let bln = false;

        for (const ele of this.pdfFileList) {
          if (ele.fileType === "upload" && typeof ele.fileUpload === "object") {
            if (!process.env.PDF_TYPE.includes(ele.fileUpload.type)) {
              this.$store.dispatch(
                "alert",
                "相關檔案不能為空且上傳檔案需為PDF"
              );
              return (bln = true);
            }
            checkFile.push(ele.fileUpload.name);
            let pdfFile = await Util.toBase64(ele.fileUpload);
            this.form.pdfFiles.push({
              fileName: ele.fileUpload.name,
              contents: pdfFile
            });
          } else if (ele.fileType === "stock" && ele.fileStock !== "") {
            if (ele.fileStock.indexOf(".pdf") === -1) {
              this.$store.dispatch(
                "alert",
                "相關檔案不能為空且上傳檔案需為PDF"
              );
              return (bln = true);
            }
            this.form.pdfFiles.push({
              fileName: ele.fileStock,
              contents: ""
            });
          }
        }

        if (bln) {
          return;
        }
      }

      if (this.form.uid === "") {
        delete this.form.uid;
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
      window.setTimeout(async () => {
        const res = await this.$store.dispatch("actionApi", {
          method: "post",
          url: "api_feature",
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
      }, 1000);
    },
    editData() {
      if (this.dataSource) {
        this.action = "edit";
        let clone = JSON.parse(JSON.stringify(this.dataSource));
        this.form.title = clone.title;
        this.form.content = clone.content;
        this.form.pdfTitle = clone.pdfTitle;
        this.form.relatedLink = clone.relatedLink;
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

        this.banner.fileInput.imagePathPcStock = clone.imagePathPc;
        this.banner.fileInput.pcType = Util.fileType(clone.imagePathPc);
        this.banner.fileInput.imagePathPadStock = clone.imagePathPad;
        this.banner.fileInput.padType = Util.fileType(clone.imagePathPad);
        this.banner.fileInput.imagePathMobileStock = clone.imagePathMobile;
        this.banner.fileInput.mobileType = Util.fileType(clone.imagePathMobile);

        dateUtil.combinationDate(this.date, clone);

        this.form.originalState = JSON.stringify(this.dataSource);
        this.pdfFileList = [];
        clone.resourcesTempSet.forEach(ele => {
          this.pdfFileList.push({
            fileType: "stock",
            fileStock: ele.fileName,
            fileUpload: []
          });
        });
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
  mounted() {
    this.getMaxSort();
    this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};

// 主圖設定
export const bannerSettingLabels = [
  {
    text: "標題底圖-PC*",
    type: "fileInput",
    value: "imagePathPcFile",
    value_stock: "imagePathPcStock",
    option: "pcType",
    titleWidth: "20%",
    valid: ["required"],
    tips: "圖片大小 : 1145 X 150"
  },
  {
    text: "標題底圖-Pad*",
    type: "fileInput",
    value: "imagePathPadFile",
    value_stock: "imagePathPadStock",
    option: "padType",
    titleWidth: "20%",
    valid: ["required"],
    tips: "圖片大小 : 700 X 130"
  },
  {
    text: "標題底圖-手機*",
    type: "fileInput",
    value: "imagePathMobileFile",
    value_stock: "imagePathMobileStock",
    option: "mobileType",
    titleWidth: "20%",
    valid: ["required"],
    tips: "圖片大小 : 341 X 130"
  }
];
</script>

<style lang="css" scoped>
</style>


<template>
  <div id="bigCoverageEdit">
    <v-card-title class="font-weight-black ml-2">{{dataSource.bigCoverageName}} :</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text class="pa-1">
        <v-col cols="12" sm="12" md="11" lg="11" class="pa-1 ma-0">
          <v-card-title class="pt-0">我為什麼需要{{dataSource.bigCoverageName}}?</v-card-title>
          <form-generate
            :labels="templateSettingLabels"
            :dataSourceList="whyList"
            :stockItems="stockItems"
            :disabled="disabled"
            enAction
            :enExpand="true"
            :hideHeader="false"
            enExpandMainOption="title"
          ></form-generate>

          <v-card-title>元大特色</v-card-title>
          <form-generate
            :labels="templateSettingLabels"
            :dataSourceList="featureList"
            :stockItems="stockItems"
            :disabled="disabled"
            enAction
            :enExpand="true"
            :hideHeader="false"
            enExpandMainOption="title"
          ></form-generate>

          <v-col class="pa-0 mt-2" cols="12">
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
  components: {},
  props: {
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
    requiredRules: [v => !!v || "↑不能為空"],
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    templateSettingLabels: templateSettingLabels,
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,
    action: "add",
    stockItems: [],
    whyList: [
      {
        title: "",
        contents: "",
        isDelete: caseEnum.n,
        sort: 0,
        edition: "why",
        show: true,
        fileInput: {
          imageFile: [],
          imageStock: "",
          imageType: "upload"
        }
      }
    ],
    featureList: [
      {
        title: "",
        contents: "",
        isDelete: caseEnum.n,
        sort: 0,
        edition: "feature",
        show: true,
        fileInput: {
          imageFile: [],
          imageStock: "",
          imageType: "upload"
        }
      }
    ],
    form: {
      status: caseEnum.d,
      imagePad: { fileName: "", contents: "" },
      imagePc: { fileName: "", contents: "" },
      imageMobile: { fileName: "", contents: "" },
      isDelete: caseEnum.n,
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      originalState: "",
      bigCoverageUid: "",
      whyList: [],
      featureList: []
    },
    confirmMessages: "",
    disabled: false,
    rejectMessages: "",
    valid: true,
    data: null
  }),
  methods: {
    preview() {
      window.open(previewUrl.index + "/?preview=true", "_blank");
    },
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_bigcoverage_detail",
        params: { uid: this.form.bigCoverageUid, message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        this.$emit("complete");
      }
    },
    async auditSuccess() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_bigcoverage_detail",
        params: {
          bigCoverageUid: this.form.bigCoverageUid,
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

    async getData() {
      if (this.dataSource.bigCoverageUid) {
        const res = await this.$store.dispatch("actionApi", {
          method: "get",
          url: "api_bigcoverage_detail_coverage",
          restParam: "/" + this.dataSource.bigCoverageUid
        });
        this.data = null;
        if (res !== null && res !== undefined) {
          this.data = res;
        }
      } else {
        this.$store.dispatch("alert", "操作失敗");
        this.$emit("complete");
      }
    },
    async checkSave(status) {
      this.confirmMessages = "";
      try {
        if (!this.valid) {
          this.$refs.form.validate();
          throw "請檢查*為必填欄位";
        }
        let checkFile = [];

        this.form.whyList = [];
        for (const ele of this.whyList) {
          const image = await Util.imageProcess(
            checkFile,
            ele,
            "imageType",
            "imageFile",
            "imageStock"
          );
          if (!image) {
            throw "上傳檔案 : 不能為空且需為圖檔";
          }
          this.form.whyList.push({
            title: ele.title,
            contents: ele.contents,
            isDelete: caseEnum.n,
            sort: ele.sort,
            edition: "why",
            req: image
          });
        }

        this.form.featureList = [];
        for (const ele of this.featureList) {
          const image = await Util.imageProcess(
            checkFile,
            ele,
            "imageType",
            "imageFile",
            "imageStock"
          );
          if (!image) {
            throw "上傳檔案 : 不能為空且需為圖檔";
          }
          this.form.featureList.push({
            title: ele.title,
            contents: ele.contents,
            isDelete: caseEnum.n,
            sort: ele.sort,
            edition: "feature",
            req: image
          });
        }

        this.form.status = status;
        this.form.isDelete = this.caseEnum.n;
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
      } catch (e) {
        this.$store.dispatch("alert", e);
      }
    },
    async save() {
      window.setTimeout(async () => {
        const res = await this.$store.dispatch("actionApi", {
          method: "post",
          url: "api_bigcoverage_detail",
          params: this.form
        });
        if (res !== null && res !== undefined) {
          if (this.form.status === caseEnum.d) {
            this.$store.dispatch("alert", "儲存成功");
          } else {
            this.$store.dispatch("alert", "送出成功");
          }

          this.$emit("complete");
        }
      }, 1000);
    },
    editData() {
      if (this.data) {
        this.action = "edit";
        let clone = JSON.parse(JSON.stringify(this.data));
        this.form.status = clone.status;
        this.form.isDelete = Util.isEmpty(clone.isDelete)
          ? caseEnum.n
          : clone.isDelete;
        this.currentIsDelete = Util.isEmpty(clone.isDelete)
          ? caseEnum.n
          : clone.isDelete;
        this.form.docReview = Util.isBlank(clone.docReview)
          ? caseEnum.docReview_n
          : clone.docReview;
        this.form.docReviewNo = Util.isEmpty(clone.docReviewNo)
          ? ""
          : clone.docReviewNo;
        this.currentStatus = Util.isEmpty(clone.status)
          ? caseEnum.d
          : clone.status;
        if (clone.status === caseEnum.r || clone.status === caseEnum.a) {
          this.disabled = true;
        }

        this.form.bigCoverageUid = clone.bigCoverageUid;
        if (clone.whyList) {
          this.whyList = clone.whyList.map(ele => {
            ele.fileInput = {
              imageFile: [],
              imageStock: ele.imageUrl,
              imageType: Util.fileType(ele.imageUrl)
            };
            ele.show = false;
            return ele;
          });
        }
        if (clone.featureList) {
          this.featureList = clone.featureList.map(ele => {
            ele.fileInput = {
              imageFile: [],
              imageStock: ele.imageUrl,
              imageType: Util.fileType(ele.imageUrl)
            };
            ele.show = false;
            return ele;
          });
        }

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
  created() {
    this.getResource();
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.getData();
    await this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};

const templateSettingLabels = [
  {
    text: "標題",
    type: "text",
    value: "title"
  },
  {
    text: "圖片",
    type: "fileInput",
    value: "imageFile",
    value_stock: "imageStock",
    option: "imageType"
  },
  {
    text: "內文",
    type: "textarea",
    value: "contents",
    rowHeight: "auto"
  },
  {
    text: "排序",
    type: "number",
    value: "sort"
  }
];
</script>

<style lang="css" scoped>
</style>


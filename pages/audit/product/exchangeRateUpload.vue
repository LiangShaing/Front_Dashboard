<template>
  <div id="exchangeRateUpload">
    <v-card-title class="font-weight-black">分期定期保險金預定利率</v-card-title>
    <v-col sm="12" md="12" lg="12">
      <v-card-title>PDF檔案</v-card-title>
      <v-radio-group
        v-model="pdfFileType"
        :mandatory="false"
        row
        :disabled="disabled || currentPageAuth.indexOf(caseEnum.a)!==-1"
      >
        <v-radio value="stock" label="選擇現有檔案"></v-radio>

        <v-radio value="upload" label="上傳新檔案"></v-radio>
      </v-radio-group>
      <div class="pdfFileInput" v-if="pdfFileType==='stock'">
        <v-col sm="6" md="6" lg="6">
          <v-autocomplete
            :items="stockItems"
            item-text="text"
            item-value="value"
            label="選擇現有檔案"
            outlined
            dense
            v-model="stockFile"
            :rules=" [v => !!v || '↑不能為空']"
            :disabled="disabled  || currentPageAuth.indexOf(caseEnum.a)!==-1"
          ></v-autocomplete>
        </v-col>
      </div>
      <div class="pdfFileInput" v-if="pdfFileType==='upload'">
        <v-col sm="6" md="6" lg="6">
          <v-file-input
            label="選擇檔案"
            outlined
            dense
            v-model="uploadFile"
            prepend-icon
            :rules=" [v => !!v || '↑不能為空']"
            :disabled="disabled  || currentPageAuth.indexOf(caseEnum.a)!==-1"
          ></v-file-input>
        </v-col>
      </div>

      <doc-review :form="form" :disabled="form.status===caseEnum.r || form.status===caseEnum.a"></doc-review>

      <div class="font-weight-black">案件狀態 : {{currentCaseStatusText}}</div>
    </v-col>
    <v-col sm="12" md="6" lg="6">
      <v-btn dark color="primary" @click="preview" class="ma-1">
        <v-icon small class="mr-1">pageview</v-icon>預覽
      </v-btn>
      <v-btn
        color="warning"
        @click="checkSave(caseEnum.d)"
        class="ma-1"
        :disabled="disabled"
        v-if="currentPageAuth.indexOf(caseEnum.e)!==-1 || currentPageAuth.indexOf(caseEnum.r)!==-1"
      >暫存</v-btn>
      <v-btn
        color="success"
        @click="checkSave(caseEnum.r)"
        class="ma-1"
        :disabled="disabled"
        v-if="currentPageAuth.indexOf(caseEnum.e)!==-1 || currentPageAuth.indexOf(caseEnum.r)!==-1"
      >送出審核</v-btn>
      <v-btn
        color="primary"
        @click="auditSuccess"
        class="ma-1"
        :disabled="currentCaseStatus===caseEnum.d"
        v-if="currentPageAuth.indexOf(currentCaseStatus)!==-1 "
      >審核通過</v-btn>
      <v-btn
        dark
        color="error"
        @click="inputRejectMessage"
        class="ma-1"
        v-if="currentPageAuth.indexOf(currentCaseStatus)!==-1"
      >退件</v-btn>
    </v-col>

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
  data: () => ({
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    pdfFileType: "upload",
    stockItems: [],
    stockFile: "",
    uploadFile: [],

    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      startHour: "00",
      startMin: "00",
      endHour: "23",
      endMin: "59"
    },
    form: {
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      resourcesReq: {
        fileName: "",
        contents: ""
      },
      status: caseEnum.d,
      // onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      // offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date())
      onTime: "",
      offTime: "",
      originalState: ""
    },
    disabled: false,
    currentCaseStatus: "D",
    confirmMessages: "",
    rejectMessages: ""
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    },
    currentCaseStatusText() {
      switch (this.currentCaseStatus) {
        case "D":
          return "草稿";
        case "R":
          return "待審核";
        case "A":
          return "待覆核";
        case "P":
          return "已上架";
      }
    }
  },
  methods: {
    preview() {
      window.open(previewUrl.rate + "/?tab=periodic&preview=true", "_blank");
    },
    async auditSuccess() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_rateresources_temp",
        params: {
          uid: this.form.uid,
          onTime: this.form.onTime,
          offTime: this.form.offTime
        }
      });
      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        this.getData();
      }
    },
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_rateresources_temp",
        params: { uid: this.form.uid, message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        this.getData();
      }
    },
    async checkSave(status) {
      this.confirmMessages = "";
      let checkFile = [];

      if (this.pdfFileType === "stock") {
        if (this.stockFile.indexOf(".pdf") === -1) {
          this.$store.dispatch("alert", "上傳檔案需為PDF");
          return;
        }
        this.form.resourcesReq.fileName = this.stockFile;
        this.form.resourcesReq.contents = "";
      }

      if (
        this.pdfFileType === "upload" &&
        typeof this.uploadFile === "object"
      ) {
        if (!process.env.PDF_TYPE.includes(this.uploadFile.type)) {
          this.$store.dispatch("alert", "上傳檔案需為PDF");
          return;
        }

        checkFile.push(this.uploadFile.name);
        let pcFile = await Util.toBase64(this.uploadFile);
        this.form.resourcesReq.fileName = this.uploadFile.name;
        this.form.resourcesReq.contents = pcFile;
      }

      if (
        this.form.docReview === caseEnum.docReview_y &&
        Util.isEmpty(this.form.docReviewNo)
      ) {
        this.$store.dispatch("alert", "請輸入文審編號");
        return;
      }

      if (!this.form.uid) {
        delete this.form.uid;
      }

      this.form.status = status;

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
        url: "api_rateresources_temp",
        params: this.form
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "儲存成功");
        this.getData();
      } else {
        this.$store.dispatch("alert", "儲存失敗");
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
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItems = data;
    },
    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_rateresources_temp"
      });

      if (res !== null && res !== undefined && res.resourcesReq !== null) {
        this.stockFile = res.resourcesReq.fileName;
        this.pdfFileType = Util.fileType(res.resourcesReq.fileName);
        this.form.uid = res.uid;

        dateUtil.combinationDate(this.date, res);

        this.form.status = res.status;
        this.form.docReview = Util.isBlank(res.docReview)
          ? caseEnum.docReview_n
          : res.docReview;
        this.form.docReviewNo = Util.isEmpty(res.docReviewNo)
          ? ""
          : res.docReviewNo;

        this.form.onTime = res.onTime;
        this.form.offTime = res.offTime;

        this.form.originalState = JSON.stringify(res);
        this.currentCaseStatus = JSON.parse(JSON.stringify(res.status));
        if (res.status === caseEnum.r || res.status === caseEnum.a) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
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
  async created() {
    await this.getResource();
    await this.getData();
  },
  mounted() {}
};
</script>

<style lang="css" scoped>
</style>


<template>
  <div id="advertise">
    <v-card-title class="font-weight-black">商品廣告</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <form-generate
          :labels="templateSettingLabels"
          :dataSourceList="advertiseList"
          :stockItems="stockItems"
          :disabled="disabled"
          enAction
        ></form-generate>

        <v-col class="pa-0 mt-2" cols="12">
          <doc-review
            :form="form"
            :disabled="disabled || currentStatus===caseEnum.r || currentStatus===caseEnum.a"
          ></doc-review>
        </v-col>

        <action-btn
          :currentPageAuth="currentPageAuth"
          :currentCaseStatus="currentStatus"
          :currentCaseIsDelete="caseEnum.n"
          :valid="valid"
          @checkSave="checkSave"
          @auditSuccess="auditSuccess"
          @inputRejectMessage="inputRejectMessage"
          @preview="preview"
          :btn="['preview','save', 'audit', 'reject']"
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
export default {
  layout: "audit/template",
  components: {},
  data: () => ({
    templateSettingLabels: templateSettingLabels,
    dataSource: null,
    requiredRules: [v => !!v || "↑不能為空"],
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,
    disabled: false,
    rejectMessages: "",
    valid: true,
    confirmMessages: "",
    stockItems: [],

    form: {
      status: caseEnum.d,
      onTime: "",
      offTime: "",
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      isDelete: caseEnum.n,
      originalState: "",
      list: []
    },

    advertiseList: []
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  methods: {
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_contract_asvertise",
        params: { uid: "", message: this.rejectMessages }
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
        url: "api_contract_asvertise",
        params: {
          uid: "",
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
    async checkSave(status) {
      this.confirmMessages = "";
      try {
        if (!this.valid) {
          this.$refs.form.validate();
          throw "請檢查*為必填欄位";
        }

        let checkFile = [];
        this.form.list = [];
        for (const ele of this.advertiseList) {
          const image = await Util.imageProcess(
            checkFile,
            ele,
            "imageType",
            "imageFile",
            "imageStock"
          );
          if (!image) {
            throw "請檢查廣告圖片需為圖檔";
          }
          this.form.list.push({
            sort: ele.sort,
            isDelete: caseEnum.n,
            req: image
          });
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
      } catch (e) {
        this.$store.dispatch("alert", e);
      }
    },
    async save() {
      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_contract_asvertise",
        params: this.form
      });
      if (res !== null && res !== undefined) {
        if (this.form.status === caseEnum.d) {
          this.$store.dispatch("alert", "儲存成功");
        } else {
          this.$store.dispatch("alert", "送出成功");
        }
        await this.getData();
        await this.editData();
      }
    },
    editData() {
      if (this.dataSource) {
        let clone = JSON.parse(JSON.stringify(this.dataSource));
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
        this.form.originalState = JSON.stringify(this.dataSource);

        this.advertiseList = clone.contractAdvertiseTemps.map(ele => {
          ele.fileInput = {
            imageFile: [],
            imageStock: ele.imagePath,
            imageType: Util.fileType(ele.imagePath)
          };
          return ele;
        });
      }
    },
    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract_asvertise_temp_rest"
      });
      this.dataSource = null;
      if (
        res !== null &&
        res !== undefined &&
        res._embedded.contractAdvertiseTemps.length !== 0
      ) {
        this.dataSource = JSON.parse(
          JSON.stringify(res._embedded.contractAdvertiseTemps[0])
        );
        this.dataSource.contractAdvertiseTemps =
          res._embedded.contractAdvertiseTemps;
      }
    },
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItems = data;
    },
    preview() {
      alert("功能尚未完成");
    }
  },
  watch: {
    "form.docReview": function(val, oldVal) {
      if (val === caseEnum.docReview_n) {
        this.form.docReviewNo = null;
      }
    }
  },
  async mounted() {
    await this.getResource();
    await this.getData();
    await this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};

const templateSettingLabels = [
  {
    text: "廣告圖片",
    type: "fileInput",
    value: "imageFile",
    value_stock: "imageStock",
    option: "imageType"
  },
  {
    text: "排序",
    type: "number",
    value: "sort"
  }
];
</script>


<style lang="css">
.elevation-1 th {
  background-color: beige;
}
</style>


<template>
  <div id="recommend">
    <v-card-title class="font-weight-black">建議搭配主附約</v-card-title>
    <v-col class="ma-0 pa-0" cols="12">
      <v-col sm="12" md="6" lg="6" class="d-lg-flex d-md-flex">
        <v-autocomplete
          :items="products"
          item-text="title"
          item-value="uid"
          label="保險商品"
          outlined
          dense
          v-model="selectProduct"
        ></v-autocomplete>
        <v-btn color="primary" class="ma-1" @click="getData">查詢</v-btn>
      </v-col>
    </v-col>

    <v-col cols="12" v-if="currentPageAuth.indexOf(caseEnum.e)!==-1" class="pb-0 pt-0">
      <v-col class="ma-0 pa-0" cols="12">
        <div class="ma-0">{{selectProductMain===caseEnum.main?'新增附約':'新增主約'}} :</div>
        <v-col sm="12" md="6" lg="6" class="pl-0 d-lg-flex d-md-flex">
          <v-autocomplete
            :items="product2"
            item-text="title"
            item-value="uid"
            label="選擇合約"
            outlined
            dense
            v-model="selectProduct2"
          ></v-autocomplete>
          <v-btn color="green" class="ma-1" @click="checkAdd" :disabled="selectProduct2===''">
            <div style="color:white">新增</div>
          </v-btn>
        </v-col>
      </v-col>
      <div
        class="ma-1"
        v-if="productText"
      >{{productText}}-{{selectProductMain===caseEnum.main?'搭配附約':'搭配主約'}} :</div>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="12">
      <data-table
        :headers="headers"
        :dataArray="dataArray"
        :currentPageAuth="currentPageAuth"
        @remove="(data)=>deleteContractRelation(data)"
        @audit="(data)=>handleAudit(data)"
        @reject="(data)=>handleReject(data)"
        @send="(data)=>handleSend(data)"
      ></data-table>
    </v-col>

    <profile-dialog profileWidth="400px" ref="confirmDialog">
      <template #dialog-content>
        <div class="text-center">主附約關聯已存在</div>
        <div class="text-center">確認覆蓋?</div>
      </template>

      <template #dialog-close>
        <v-btn color="primary">取消</v-btn>
      </template>

      <template #dialog-save>
        <v-btn color="primary" @click="addContractRelation">確認</v-btn>
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
import authUtil from "@/util/authUtil";
import dateUtil from "@/util/dateUtil";
import Util from "@/util";
import { caseEnum } from "@/api/enum";

export default {
  layout: "audit/template",
  components: {},
  data: () => ({
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    headers: tableHeader("aboutContractTemp"),
    productText: "",
    selectProduct: "",
    selectProductMain: "",
    selectProduct2: "",
    products: [],
    product2: [],
    dataArray: [],
    form: {
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      mainContractUid: "",
      attachContractUid: "",
      isDelete: caseEnum.n,
      // onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      // offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date())
      onTime: "",
      offTime: "",
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
    uid: "",
    rejectMessages: ""
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  watch: {
    selectProduct() {
      this.products.forEach(element => {
        if (element.uid === this.selectProduct) {
          this.productText = element.title;
          this.selectProductMain = element.isMain;
        }
      });
      this.getRelationProduct();
    },
    "form.docReview": function(val, oldVal) {
      if (val === caseEnum.docReview_n) {
        this.form.docReviewNo = null;
      }
    }
  },
  methods: {
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
    handleSend(data) {
      this.form.mainContractUid = data.mainContractUid;
      this.form.attachContractUid = data.attachContractUid;
      this.form.isDelete = data.isDelete;
      this.form.onTime = data.onTime;
      this.form.offTime = data.offTime;
      this.addContractRelation();
    },
    handleReject(data) {
      this.uid = data.uid;
      this.$refs.rejectDialog.toggle(true);
    },
    async getAllProduct() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract_temp_rest_findByIsMainIn",
        params: { isMains: "1,0" }
      });
      if (res !== null && res !== undefined) {
        this.products = res._embedded.aboutContractTemps;
      }
    },
    async getRelationProduct() {
      let main = this.selectProductMain === "1" ? "0" : "1";
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract_temp_rest_findByIsMain",
        params: { isMain: main }
      });

      if (res !== null && res !== undefined) {
        this.product2 = res._embedded.aboutContractTemps;
      }
    },
    async getData() {
      if (this.selectProduct === "") {
        this.$store.dispatch("alert", "請先選擇保險商品");
      } else {
        let url = "";
        let params = {};
        if (this.selectProductMain === "1") {
          url = "api_contract_relation_temp_rest_findByMainContractUid";
          params = { mainContractUid: this.selectProduct };
          this.headers = tableHeader("aboutContractTemp");
          authUtil.combindAuthBtn_send(this.currentPageAuth, this.headers);
        } else {
          url = "api_contract_relation_temp_rest_findByAttachContractUid";
          params = { attachContractUid: this.selectProduct };
          this.headers = tableHeader("mainContract");
          authUtil.combindAuthBtn_send(this.currentPageAuth, this.headers);
        }

        const res = await this.$store.dispatch("actionApi", {
          method: "get",
          url: url,
          params: params
        });
        this.dataArray = [];
        if (res !== null && res !== undefined) {
          this.dataArray = res._embedded.aboutContractRelationTemps;
        }
      }
    },
    async checkAdd() {
      if (this.selectProductMain === caseEnum.main) {
        this.form.mainContractUid = this.selectProduct;
        this.form.attachContractUid = this.selectProduct2;
      } else {
        this.form.mainContractUid = this.selectProduct2;
        this.form.attachContractUid = this.selectProduct;
      }

      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url:
          "api_contract_relation_temp_rest_findByMainContractUidAndAttachContractUid",
        params: {
          mainContractUid: this.form.mainContractUid,
          attachContractUid: this.form.attachContractUid
        }
      });
      if (
        res !== null &&
        res !== undefined &&
        res._embedded.aboutContractRelationTemps.length !== 0
      ) {
        this.form.originalState = JSON.stringify(res);
        this.$refs.confirmDialog.toggle(true);
      } else {
        this.form.originalState = "";
        this.addContractRelation();
      }
    },
    async addContractRelation() {
      this.form.isDelete = this.caseEnum.n;
      if (
        this.form.docReview === caseEnum.docReview_y &&
        Util.isEmpty(this.form.docReviewNo)
      ) {
        this.$store.dispatch("alert", "請輸入文審編號");
        return;
      }
      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_contract_relation",
        params: this.form
      });
      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "送出成功");
        this.getData();
      }
    },
    async deleteContractRelation(data) {
      this.form.mainContractUid = data.mainContractUid;
      this.form.attachContractUid = data.attachContractUid;
      this.form.isDelete = caseEnum.y;
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_contract_relation",
        restParam: "/" + data.uid
      });
      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "刪除成功");
        this.getData();
      }
    },
    async handleAudit(data) {
      let obj = {
        uid: data.uid,
        mainContractUid: data.mainContractUid,
        attachContractUid: data.attachContractUid,
        isDelete: caseEnum.n,
        onTime: data.onTime,
        offTime: data.offTime
      };
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_contract_relation",
        params: obj
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        this.getData();
      }
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_contract_relation",
        params: { uid: this.uid, message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        this.getData();
      }
    }
  },
  mounted() {
    this.getAllProduct();
  }
};

export const tableHeader = ele => [
  {
    text: "名稱",
    value: `${ele}.title`,
    align: "center",
    width: "30%",
    sortable: false
  },
  {
    text: "狀態",
    value: `status`,
    align: "center",
    width: "20%",
    sortable: false
  }
  // {
  //   text: "上架時間",
  //   value: `onTime`,
  //   align: "center",
  //   width: "15%",
  //   sortable: false
  // },
  // {
  //   text: "下架時間",
  //   value: `offTime`,
  //   align: "center",
  //   width: "15%",
  //   sortable: false
  // }
];
</script>

<style lang="css" >
</style>


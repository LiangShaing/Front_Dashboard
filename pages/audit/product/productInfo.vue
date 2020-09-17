<template>
  <div id="productInfo">
    <breadcrumbs :items="breadcrumbs" :currentIndex="currentIndex"></breadcrumbs>

    <div v-if="currentIndex==='0'">
      <v-col cols="12" class="d-md-flex d-lg-flex">
        <v-col sm="12" md="5" lg="5" class="pa-0">
          <form-option title="險別">
            <v-select
              :items="items"
              item-text="title"
              item-value="uid"
              label="險別"
              outlined
              dense
              v-model="bigCoverage"
            ></v-select>
          </form-option>
        </v-col>
        <v-col sm="12" md="4" lg="4" class="pa-0">
          <v-btn
            v-if="currentPageAuth.indexOf(caseEnum.e)!==-1"
            dark
            color="#4caf50"
            class="ma-1"
            @click="openEdit(null)"
          >
            <v-icon small class="mr-1">playlist_add</v-icon>新增商品
          </v-btn>
          <v-btn dark color="primary" @click="preview" class="ma-1">
            <v-icon small class="mr-1">pageview</v-icon>預覽
          </v-btn>
        </v-col>
      </v-col>

      <v-container grid-list-lg fluid>
        <data-table
          :headers="headers"
          :dataArray="dataArray"
          @edit="(data)=>openEdit(data)"
          @remove="(data)=>handleRemove(data)"
          @audit="(data)=>handleAudit(data)"
          sort="onTime"
          :currentPageAuth="currentPageAuth"
        ></data-table>
      </v-container>
    </div>

    <product-edit
      v-else
      :pageTitle="(action==='add'?'新增':action==='audit'?'審核':'編輯')"
      :contracts="items"
      :dataSource="dataSource"
      @complete="handleComplete"
      @back="handleBack"
      :featureShow="featureShow"
      :currentPageAuth="currentPageAuth"
      :text="text"
    ></product-edit>
  </div>
</template>

<script>
import productEdit from "@/containers/product/productEdit";
import authUtil from "@/util/authUtil";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {
    productEdit
  },
  data: vm => ({
    breadcrumbs: [
      {
        text: "商品總覽",
        disabled: false,
        click: () => {
          vm.handleBack();
        }
      },
      {
        text: "商品明細",
        disabled: false,
        click: () => {}
      }
    ],
    currentIndex: "0",
    member: JSON.parse(window.sessionStorage.getItem("userInfo")),
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    headers: JSON.parse(JSON.stringify(tableHeader)),
    dataArray: [],
    items: [],
    bigCoverage: "",
    dataSource: null,
    action: "add",
    featureShow: [],

    text:""
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  methods: {
    handleBreadcrumb(data) {
      this.breadcrumbs.push(data);
    },
    preview() {
      if (this.bigCoverage !== "") {
        window.open(
          previewUrl.product + "/" + this.bigCoverage + "/?preview=true",
          "_blank"
        );
      } else {
        this.$store.dispatch("alert", "請先選擇險別");
      }
    },
    handleComplete() {
      window.scrollTo(0, 0);
      this.currentIndex = "0";
      this.getFindByBigCoverageUid(this.bigCoverage);
    },
    handleBack() {
      window.scrollTo(0, 0);
      this.getFindByBigCoverageUid(this.bigCoverage);
      this.currentIndex = "0";
    },
    async openEdit(data) {
      await this.geFeature();
      if (data !== null && Object.keys(data).length !== 0) {
        if (data.status === caseEnum.r || data.status === caseEnum.a) {
          this.action = "audit";
        } else {
          this.action = "edit";
        }
        this.getProduct(data.uid);
      } else {
        this.dataSource = null;
        this.action = "add";
        this.currentIndex = "1";
      }
    },
    async getProduct(uid) {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract",
        restParam: "/" + uid
      });
      if (res !== null && res !== undefined) {
        this.dataSource = JSON.parse(JSON.stringify(res));
        this.currentIndex = "1";
      }
    },
    async getBigCoverage() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_bigCoverage_rest"
      });
      if (res !== null && res !== undefined) {
        this.items = [];
        this.items = res._embedded.aboutBigCoverages;
      }
    },
    async getFindByBigCoverageUid(bigCoverageUid) {
      if (bigCoverageUid) {
        const res = await this.$store.dispatch("actionApi", {
          method: "get",
          url: "api_findByBigCoverageUidAndCmDeptId_rest",
          params: {
            bigCoverageUid: bigCoverageUid,
            cmDeptId: this.member.cmDeptDTO.cmDeptId
          }
        });
        this.dataArray = [];
        if (res !== null && res !== undefined) {
          res._embedded.aboutContractTemps.forEach(ele => {
            //找尋險別中文名稱
            this.items.forEach(b => {
              if (b.uid === ele.bigCoverageUid) {
                ele.bigCoverageName = b.title;
              }
            });
          });
          this.dataArray = res._embedded.aboutContractTemps;
        }
      }
    },
    async handleAudit(data) {
      this.action = "audit";
      await this.geFeature();
      await this.getProduct(data.uid);
    },
    async geFeature(deptId, roleId) {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_featureTemp_rest"
      });
      this.featureShow = [];
      if (res !== null && res !== undefined) {
        // 再特色顯示裡加一個屬性，紀錄是否顯示的值
        let arr = [];
        res._embedded.aboutFeatureTemps.forEach(ele => {
          if (ele.isDelete !== caseEnum.y || ele.status !== caseEnum.p) {
            ele.show = "N";
            arr.push(ele);
          }
        });
        this.featureShow = arr;
      }
    },
    async handleRemove(data) {
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_contract",
        restParam: "/" + data.uid
      });
      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "刪除成功");
        this.getFindByBigCoverageUid(this.bigCoverage);
      } else {
        this.$store.dispatch("alert", "刪除失敗");
      }
    }
  },
  watch: {
    bigCoverage() {
      this.getFindByBigCoverageUid(this.bigCoverage);
    }
  },
  created() {
    authUtil.combindAuthBtn(this.currentPageAuth, this.headers);
  },
  mounted() {
    this.getBigCoverage();
  }
};
const tableHeader = [
  {
    text: "險別",
    value: "bigCoverageName",
    align: "center",
    width: "10%",
    sortable: false
  },
  {
    text: "編碼",
    value: "code",
    align: "center",
    width: "5%",
    sortable: false
  },
  {
    text: "名稱",
    value: "title",
    align: "center",
    width: "15%",
    sortable: false
  },
  {
    text: "排序",
    value: "sort",
    align: "center",
    width: "5%"
  },
  {
    text: "狀態",
    value: "status",
    align: "center",
    width: "8%",
    sortable: false
  },
  {
    text: "上架時間",
    value: "onTime",
    align: "center",
    width: "12%"
  },
  {
    text: "下架時間",
    value: "offTime",
    align: "center",
    width: "12%"
  }
];
</script>

<style lang="css" scoped>
</style>


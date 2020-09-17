<template>
  <div id="featureInfo">
    <breadcrumbs :items="breadcrumbs" :currentIndex="currentIndex"></breadcrumbs>
    <div v-if="currentIndex==='0'">
      <v-col class="d-flex">
        <v-btn
          v-if="currentPageAuth.indexOf(caseEnum.e)!==-1"
          dark
          color="#4caf50"
          class="ma-1"
          @click="openEdit('add',null)"
        >
          <v-icon small class="mr-1">playlist_add</v-icon>新增特色專區
        </v-btn>
        <v-btn dark color="primary" @click="preview" class="ma-1">
          <v-icon small class="mr-1">pageview</v-icon>預覽
        </v-btn>
      </v-col>

      <v-col sm="12" md="10" lg="10">
        <data-table
          :headers="headers"
          :dataArray="dataArray"
          :currentPageAuth="currentPageAuth"
          @edit="(data)=>openEdit('editor',data)"
          @remove="(data)=>handleRemove(data)"
          @audit="(data)=>openEdit('audit',data)"
          sort="sort"
          sortAsc
        ></data-table>
      </v-col>
    </div>

    <feature-edit
      v-else
      :pageTitle="(action==='add'?'新增':action==='audit'?'審核':'編輯')"
      :dataSource="dataSource"
      @complete="handleComplete"
      @back="handleBack"
      :currentPageAuth="currentPageAuth"
    ></feature-edit>
  </div>
</template>

<script>
import featureEdit from "@/containers/product/featureEdit";
import authUtil from "@/util/authUtil";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {
    featureEdit
  },
  data: vm => ({
    breadcrumbs: [
      {
        text: "特色專區",
        disabled: false,
        click: () => {
          vm.handleBack();
        }
      },
      {
        text: "特色專區明細",
        disabled: false,
        click: () => {}
      }
    ],
    currentIndex: "0",
    member: JSON.parse(window.sessionStorage.getItem("userInfo")),
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    headers: JSON.parse(JSON.stringify(tableHeader)),
    action: "add",
    dataArray: [],
    dataSource: null
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  methods: {
    preview() {
      window.open(previewUrl.feature + "/?preview=true", "_blank");
    },
    handleBack() {
      window.scrollTo(0, 0);
      this.getData();
      this.currentIndex = "0";
    },
    openEdit(action, data) {
      this.action = action;
      this.dataSource = null;
      if (data !== null) {
        this.dataSource = data;
        if (data.status === caseEnum.r || data.status === caseEnum.a) {
          this.action = "audit";
        } else {
          this.action = "edit";
        }
      }
      this.currentIndex = "1";
    },
    async handleRemove(data) {
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_feature",
        restParam: "/" + data.uid
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "刪除成功");
        this.getData();
      } else {
        this.$store.dispatch("alert", "刪除失敗");
      }
    },
    handleComplete() {
      window.scrollTo(0, 0);
      this.getData();
      this.currentIndex = "0";
    },
    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_feature_temp_rest_findAllByCmDeptId",
        params: { cmDeptId: this.member.cmDeptDTO.cmDeptId }
      });
      this.dataArray = [];
      if (res !== null && res !== undefined) {
        this.dataArray = res._embedded.aboutFeatureTemps;
      }
    }
  },
  mounted() {
    authUtil.combindAuthBtn(this.currentPageAuth, this.headers);
    this.getData();
  }
};

export const tableHeader = [
  {
    text: "標題",
    value: "title",
    align: "center",
    width: "30%",
    sortable: false
  },
  {
    text: "排序",
    value: "sort",
    align: "center",
    width: "10%"
  },
  {
    text: "狀態",
    value: "status",
    align: "center",
    width: "10%",
    sortable: false
  }
  // {
  //   text: "上架時間",
  //   value: "onTime",
  //   align: "center",
  //   width: "15%",
  //   sortable: false
  // },
  // {
  //   text: "下架時間",
  //   value: "offTime",
  //   align: "center",
  //   width: "15%",
  //   sortable: false
  // }
];
</script>

<style lang="css" scoped>
</style>


<template>
  <div id="bigCoverage">
    <breadcrumbs :items="breadcrumbs" :currentIndex="currentIndex"></breadcrumbs>
    <div v-if="currentIndex==='0'">
      <v-col clos="12" class="pb-0">
        <v-btn dark color="primary" @click="preview" class="ma-2">
          <v-icon small class="mr-1">pageview</v-icon>預覽
        </v-btn>
      </v-col>

      <v-col sm="12" md="9" lg="9">
        <data-table
          :headers="headers"
          :dataArray="dataArray"
          @edit="(data)=>openEdit('1','editor',data)"
          @audit="(data)=>openEdit('1','audit',data)"
        ></data-table>
      </v-col>
    </div>

    <big-coverage-edit
      v-if="currentIndex==='1'"
      :dataSource="dataSource"
      @complete="handleComplete"
      @back="handleBack"
      :currentPageAuth="currentPageAuth"
    ></big-coverage-edit>
  </div>
</template>

<script>
import dateUtil from "@/util/dateUtil";
import bigCoverageEdit from "@/containers/product/bigCoverageEdit";
import authUtil from "@/util/authUtil";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {
    bigCoverageEdit
  },
  data: vm => ({
    breadcrumbs: [
      {
        text: "險別頁面",
        disabled: false,
        click: () => {
          vm.handleBack();
        }
      },
      {
        text: "險別頁面明細",
        disabled: false,
        click: () => {}
      }
    ],
    currentIndex: "0",
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
      window.open(previewUrl.index + "/?preview=true", "_blank");
    },
    async handleBack() {
      window.scrollTo(0, 0);
      await this.getData();
      this.currentIndex = "0";
    },
    openEdit(view, action, data) {
      this.action = action;
      this.dataSource = data;
      this.currentIndex = view;
    },
    async handleComplete() {
      window.scrollTo(0, 0);
      await this.getData();
      this.view = "main";
      this.currentIndex = "0";
    },

    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_bigcoverage_detail_all"
      });
      this.dataArray = [];
      if (res !== null && res !== undefined) {
        this.dataArray = res;
      }
    }
  },
  async mounted() {
    authUtil.combindAuthBtn_single(this.currentPageAuth, this.headers);
    await this.getData();
  }
};

const tableHeader = [
  {
    text: "險別名稱",
    value: "bigCoverageName",
    align: "center",
    width: "25%",
    sortable: false,
    class: "truncate"
  },
  {
    text: "狀態",
    value: "status",
    align: "center",
    width: "10%",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
</style>


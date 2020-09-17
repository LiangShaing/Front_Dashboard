<template>
  <div id="reviewStage">
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
          <v-icon small class="mr-1">playlist_add</v-icon>新增Q&A
        </v-btn>
        <v-btn dark color="primary" @click="preview" class="ma-1">
          <v-icon small class="mr-1">pageview</v-icon>預覽
        </v-btn>
      </v-col>

      <v-col sm="12" md="12" lg="12">
        <data-table
          :headers="headers"
          :dataArray="dataArray"
          :currentPageAuth="currentPageAuth"
          @edit="(data)=>openEdit('edit',data)"
          @remove="(data)=>handleRemove(data)"
          @audit="(data)=>openEdit('audit',data)"
          sort="sort"
        ></data-table>
      </v-col>
    </div>

    <review-stage-edit
      v-else
      :pageTitle="(action==='add'?'新增':action==='audit'?'審核':'編輯')"
      :dataSource="dataSource"
      @back="handleBack"
      @complete="handleComplete"
      :currentPageAuth="currentPageAuth"
    ></review-stage-edit>
  </div>
</template>

<script>
import reviewStageEdit from "@/containers/product/reviewStageEdit";
import authUtil from "@/util/authUtil";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {
    reviewStageEdit
  },
  data: vm => ({
    breadcrumbs: [
      {
        text: "審閱期專區",
        disabled: false,
        click: () => {
          vm.handleBack();
        }
      },
      {
        text: "Q&A",
        disabled: false,
        click: () => {}
      }
    ],
    currentIndex: "0",
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    headers: JSON.parse(JSON.stringify(tableHeader)),
    dataArray: [],
    action: "add",
    dataSource: null
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  methods: {
    preview() {
      window.open(previewUrl.reviewStage + "/?preview=true", "_blank");
    },
    handleComplete() {
      window.scrollTo(0, 0);
      this.currentIndex = "0";
      this.getData();
    },
    handleBack() {
      window.scrollTo(0, 0);
      this.getData();
      this.currentIndex = "0";
    },
    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_reviewperiod_temp_rest"
      });
      this.dataArray = [];
      if (res !== null && res !== undefined) {
        this.dataArray = res._embedded.reviewPeriodTemps;
      }
    },
    openEdit(action, data) {
      this.action = action;
      this.dataSource = null;
      if (data !== null) {
        if (data.status === caseEnum.r || data.status === caseEnum.a) {
          this.action = "audit";
        } else {
          this.action = "edit";
        }
        this.dataSource = data;
      }
      this.currentIndex = "1";
    },
    async handleRemove(data) {
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_reviewperiod",
        restParam: "/" + data.uid
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "刪除成功");
        this.getData();
      } else {
        this.$store.dispatch("alert", "刪除失敗");
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
    width: "20%",
    sortable: false
  },
  {
    text: "內文",
    value: "contents",
    align: "center",
    width: "30%",
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
#reviewStage div.cardStyle #dataTable table tbody tr {
  height: 200px !important;
}
</style>


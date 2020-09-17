<template>
  <div id="targetStatusInfo">
    <breadcrumbs :items="breadcrumbs" :currentIndex="currentIndex"></breadcrumbs>
    <div v-if="currentIndex==='0'">
      <v-col cols="12" class="ma-0 d-md-flex d-lg-flex">
        <date-picker
          ref="datePicker"
          flex
          @getDate="handleGetDate"
          startLabelText="查詢起日"
          endLabelText="查詢迄日"
          :enableClear="false"
          :limitStartDateMax="currentDate"
        ></date-picker>
        <v-btn color="primary" class="ma-1" @click="getDataWithDate" :disabled="searchBtn">查詢</v-btn>
        <v-btn color="warning" class="ma-1" @click="cancel">清除查詢</v-btn>
      </v-col>
      <v-col cols="12" class="d-flex ma-0 pb-0">
        <v-btn
          v-if="currentPageAuth.indexOf(caseEnum.e)!==-1"
          dark
          color="#4caf50"
          class="ma-1"
          @click="()=>openEdit('add',null)"
        >
          <v-icon small class="mr-1">playlist_add</v-icon>新增標的
        </v-btn>
        <v-btn dark color="primary" @click="preview" class="ma-1">
          <v-icon small class="mr-1">pageview</v-icon>預覽
        </v-btn>
      </v-col>

      <v-container grid-list-lg fluid>
        <data-table
          :headers="headers"
          :dataArray="dataArray"
          :currentPageAuth="currentPageAuth"
          @edit="(data)=>openEdit('edit',data)"
          @remove="handleRemove"
          @audit="(data)=>openEdit('audit',data)"
          sort="beginDate"
        ></data-table>
      </v-container>
    </div>

    <target-status-edit
      v-else
      :pageTitle="(action==='add'?'新增':action==='audit'?'審核':'編輯')"
      :dataSource="dataSource"
      @complete="handleComplete"
      @back="handleBack"
      :currentPageAuth="currentPageAuth"
    ></target-status-edit>
  </div>
</template>

<script>
import targetStatusEdit from "@/containers/product/targetStatusEdit";
import dateUtil from "@/util/dateUtil";
import authUtil from "@/util/authUtil";
import Util from "@/util";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";

export default {
  layout: "audit/template",
  components: {
    targetStatusEdit
  },
  data: vm => ({
    breadcrumbs: [
      {
        text: "標的動態",
        disabled: false,
        click: () => {
          vm.handleBack();
        }
      },
      {
        text: "標的動態明細",
        disabled: false,
        click: () => {}
      }
    ],
    currentIndex: "0",
    currentDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
    pagination: { sortBy: "beginDate", descending: true },
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    headers: JSON.parse(JSON.stringify(tableHeader)),
    date: {
      startDate: "",
      endDate: ""
    },
    dataArray: [],
    dataSource: null,
    action: "add"
  }),
  computed: {
    searchBtn() {
      if (
        Util.isEmpty(this.date.startDate) &&
        Util.isEmpty(this.date.startDate)
      ) {
        return true;
      } else {
        return false;
      }
    },
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  methods: {
    preview() {
      window.open(previewUrl.investment + "/?preview=true", "_blank");
    },
    handleBack() {
      window.scrollTo(0, 0);
      this.getAllData();
      this.currentIndex = "0";
    },
    handleComplete() {
      window.scrollTo(0, 0);
      this.currentIndex = "0";
      this.getAllData();
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
    cancel() {
      this.$refs.datePicker.clearCondition();
      this.getAllData();
    },
    async handleRemove(data) {
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_invest_market_info",
        restParam: "/" + data.uid
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "刪除成功");
        this.cancel();
      } else {
        this.$store.dispatch("alert", "刪除失敗");
      }
    },
    handleGetDate(data) {
      this.date.startDate =
        data.startDate === null || data.startDate === ""
          ? null
          : data.startDate + " " + data.startTime;
      this.date.endDate =
        data.endDate === null || data.endDate === ""
          ? null
          : data.endDate + " " + data.endTime;
    },
    async getAllData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_invest_market_info_temp_rest"
      });
      this.dataArray = [];
      if (res !== null && res !== undefined) {
        this.dataArray = res._embedded.investMarketInfoTemps;
      }
    },
    async getDataWithDate() {
      let url = "";
      let params = null;
      if (this.date.startDate !== null && this.date.endDate === null) {
        url = "api_invest_market_info_temp_rest_with_startDate";
        params = { beginDate: this.date.startDate };
      } else if (this.date.startDate === null && this.date.endDate !== null) {
        url = "api_invest_market_info_temp_rest_with_endDate";
        params = { endDate: this.date.endDate };
      } else {
        url = "api_invest_market_info_temp_rest_with_date";
        params = { beginDate: this.date.startDate, endDate: this.date.endDate };
      }
      if (url !== "" && params !== null) {
        const res = await this.$store.dispatch("actionApi", {
          method: "get",
          url: url,
          params: params
        });
        this.dataArray = [];
        if (res !== null && res !== undefined) {
          this.dataArray = res._embedded.investMarketInfoTemps;
        }
      }
    }
  },
  mounted() {
    authUtil.combindAuthBtn(this.currentPageAuth, this.headers);
    this.getAllData();
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
  // {
  //   text: "內文",
  //   value: "contents",
  //   align: "center",
  //   width: "20%",
  //   sortable: false
  // },
  {
    text: "起始時間",
    value: "beginDate",
    align: "center",
    width: "15%"
  },

  {
    text: "結束時間",
    value: "endDate",
    align: "center",
    width: "15%",
    sortable: false
  },
  {
    text: "狀態",
    value: "status",
    align: "center",
    width: "5%",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
</style>


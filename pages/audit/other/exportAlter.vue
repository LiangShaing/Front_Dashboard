<template>
  <div id="exportAlter">
    <v-card-title class="font-weight-black">異動記錄查詢</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-col cols="12" sm="12" md="11" lg="11" class="pa-0 ma-0 d-flex">
          <date-picker
            :enableClear="false"
            flex
            @getDate="handleGetDate"
            startLabelText="起始時間"
            endLabelText="結束時間"
            :defaultStartDate="date.startDate"
            :defaultEndDate="date.endDate"
            required
          ></date-picker>
          <v-btn dark color="primary" @click="output" class="ma-1">輸出異動紀錄</v-btn>
        </v-col>
      </v-card-text>
    </v-form>
  </div>
</template>

<script>
import dateUtil from "@/util/dateUtil";
import Util from "@/util";
import axios from "@/util/axios";
import uri from "@/api/uri";
export default {
  layout: "audit/template",
  components: {},
  props: {},
  data: () => ({
    requiredRules: [v => !!v || "↑不能為空"],
    disabled: false,
    valid: true,
    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: "",
      startHour: "00",
      startMin: "00",
      endHour: "23",
      endMin: "59"
    },

    form: {
      onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date())
    }
  }),
  computed: {},
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
    async output() {
      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.dispatch("alert", "請檢查必填欄位");
        return;
      }
      const res = await this.$store.dispatch("getExportExcel", {
        url: "api_cm_alter_log_export",
        params: { startTime: this.form.onTime, endTime: this.form.offTime }
      });
      if (res !== null && res !== undefined) {
        this.download(res);
        this.$store.dispatch("alert", "下載成功");
      }
    },
    download(data) {
      if (!data) {
        return;
      }

      let blob = new Blob([data], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });

      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "異動紀錄.xls";
      link.click();
    },
    editData() {},
    preview() {}
  },
  watch: {},
  created() {},
  mounted() {}
};
</script>

<style lang="css" scoped>
</style>


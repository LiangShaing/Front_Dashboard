<template>
  <div id="info">
    <v-card-title>基本資料</v-card-title>
    <v-card-text>
      <v-col cols="12" class="d-lg-flex d-md-flex pa-1">
        <v-col sm="3" md="3" lg="3" class="pa-1">
          <form-option title="AD帳號">
            <div class="info-text">{{info.account}}</div>
          </form-option>

          <form-option title="中文姓名">
            <div class="info-text">{{info.name}}</div>
          </form-option>

          <form-option title="所屬單位">
            <div class="info-text">{{info.unit}}</div>
          </form-option>

          <form-option title="角色">
            <div class="info-text">{{info.role}}</div>
          </form-option>
        </v-col>

        <v-col sm="4" md="4" lg="4" class="pa-1">
          <form-option title="代理人">
            <v-select
              :items="roles"
              v-model="info.role"
              item-text="text"
              item-value="value"
              label="請選擇"
              outlined
              dense
            ></v-select>
          </form-option>

          <date-picker
            dateType="ERA"
            @getDate="handleGetDate"
            startLabelText="代理起日"
            endLabelText="代理迄日"
          ></date-picker>
        </v-col>
      </v-col>

      <v-col class="d-lg-flex d-md-flex pa-5" cols="12">
        <v-btn dark color="primary" @click="save()" class="ma-1">設定代理資訊</v-btn>
        <v-btn dark color="error" @click="remove()" class="ma-1">結束代理</v-btn>
      </v-col>

      <v-col class="pa-5" sm="12" md="9" lg="9">
        <data-table :headers="headers" :dataArray="dataArray"></data-table>
      </v-col>
    </v-card-text>
  </div>
</template>

<script>
export default {
  layout: "audit/template",
  data: () => ({
    info: {
      account: "ABC123",
      name: "李元大",
      unit: "秘書室",
      role: "經辦"
    },
    headers: tableHeader,
    dataArray: [
      {
        agentName: "王曉明",
        agentDate: "2020/04/06-2020/04/30",
        agentRole: "A"
      },
      {
        agentName: "陳聰明",
        agentDate: "2020/04/06-2020/04/30",
        agentRole: "A"
      }
    ],

    roles: [
      { value: "A", text: "角色A" },
      { value: "B", text: "角色B" }
    ]
  }),
  methods: {
    save() {
      console.log(this.data);
    },
    remove() {},
    handleGetDate(data) {
      console.log("Date : ", data);
    }
  },
  mounted() {}
};

export const tableHeader = [
  {
    text: "被代理人姓名",
    value: "agentName",
    width: "10px",
    align: "center",
    sortable: false
  },
  {
    text: "代理起迄日",
    value: "agentDate",
    width: "10px",
    align: "center",
    sortable: false
  },
  {
    text: "被代理人角色",
    value: "agentRole",
    width: "10px",
    align: "center",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
#info {
  font-size: 1rem;
  font-family: "Microsoft JhengHei", sans-serif !important;
  font-weight: initial;
  line-height: normal;
  -webkit-font-smoothing: antialiased;
}
.info-text {
  line-height: 50px;
}
</style>


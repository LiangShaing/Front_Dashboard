<template>
  <div id="userManage">
    <v-card-title class="font-weight-black" >使用者管理</v-card-title>
    <v-col class="d-flex" cols="12" sm="12" md="12" lg="12">
      <v-col sm="12" md="3" lg="3">
        <v-select
          :items="deptsData"
          item-text="cmDeptName"
          item-value="cmDeptId"
          label="所屬單位"
          outlined
          dense
          v-model="deptVal"
        ></v-select>
      </v-col>

      <v-col sm="12" md="3" lg="3">
        <v-select
          :items="rolesData"
          item-text="cmRoleName"
          item-value="cmRoleId"
          label="角色"
          outlined
          dense
          v-model="roleVal"
        ></v-select>
      </v-col>

      <v-col sm="12" md="3" lg="3">
        <v-btn color="primary" @click="search">查詢</v-btn>
        <v-btn dark color="cyan" @click="openDialog('add',null)">新增</v-btn>
      </v-col>
    </v-col>

    <v-container grid-list-lg fluid>
      <data-table-account
        :headers="headers"
        :dataArray="dataArray"
        @edit="(data)=>openDialog('editor',data)"
        @writeOff="handleWriteOff"
      ></data-table-account>
    </v-container>

    <profile-dialog
      ref="openDialog"
      :title="(action==='add'?'新增':'編輯')+'-帳號'"
      profileWidth="500px"
      enableTitle
    >
      <template #dialog-content>
        <save-or-update-user
          :depts="depts"
          :action="action"
          @complete="handleSaveComplete"
          :dataSource="dataSource"
        ></save-or-update-user>
      </template>
    </profile-dialog>
  </div>
</template>

<script>
import saveOrUpdateUser from "@/containers/account/saveOrUpdateUser";
import dataTableAccount from "@/containers/account/dataTable";

export default {
  layout: "audit/template",
  components: {
    saveOrUpdateUser,
    dataTableAccount
  },
  data: () => ({
    headers: tableHeader,
    dataArray: [],
    roles: [{ cmRoleId: "", cmRoleName: "全部" }],
    depts: [],
    deptVal: "",
    roleVal: "",
    action: "",
    dataSource: null,
  }),
  methods: {
    openDialog(action, data) {
      this.action = action;
      this.dataSource = null;
      if (data !== null) {
        this.dataSource = data;
      }
      this.$refs.openDialog.toggle(true);
    },
    handleSaveComplete() {
      this.$refs.openDialog.toggle(false);
      this.search();
    },
    async handleWriteOff(data) {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_userSuspend",
        params: data
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "註銷成功");
        this.search();
      }else{
        this.$store.dispatch("alert", "註銷失敗");
      }

    },
    async getData(deptId, roleId) {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_user",
        params: { cmDeptId: deptId, cmRoleId: roleId }
      });

      this.dataArray = [];
      res.forEach(ele => {
        let roles = "";
        ele.cmRoleDTOSet.forEach(role => {
          if (roles !== "") {
            roles = roles + ",";
          }
          roles = roles + role.cmRoleName;
        });
        ele.cmRoles = roles;
      });
      this.dataArray = res;
    },
    async getDept() {
      const res = await this.$store.dispatch("getDept");
      res.forEach(ele => {
        this.depts.push(ele);
      });
      this.roleData(this.deptVal);
    },
    roleData(deptVal) {
      this.roles = [];
      if (deptVal === "") {
        this.depts.forEach(ele => {
          ele.cmRoleDTOSet.forEach(ele2 => {
            this.roles.push(ele2);
          });
        });
      } else {
        this.depts.forEach(ele => {
          if (ele.cmDeptId === deptVal) {
            ele.cmRoleDTOSet.forEach(ele2 => {
              this.roles.push(ele2);
            });
          }
        });
      }
    },
    search() {
      this.getData(this.deptVal, this.roleVal);
    }
  },
  computed: {
    deptsData() {
      const depts = JSON.parse(JSON.stringify(this.depts));
      depts.splice(0, 0, {
        cmDeptId: "",
        cmDeptName: "全部",
        cmRoleDTOSet: []
      });
      return depts;
    },
    rolesData() {
      const roles = JSON.parse(JSON.stringify(this.roles));
      if (roles.length !== 0) {
        roles.splice(0, 0, { cmRoleId: "", cmRoleName: "全部" });
      }
      return roles;
    }
  },
  watch: {
    deptVal() {
      this.roleData(this.deptVal);
    }
  },
  created() {
    this.getDept();
  },
  mounted() {
    this.getData("", "");
  }
};

export const tableHeader = [
  {
    text: "AD帳號",
    value: "cmUserId",
    width: "10%",
    align: "center",
    sortable: false
  },
  {
    text: "中文姓名",
    value: "cmUserName",
    width: "15%",
    align: "center",
    sortable: false
  },
  {
    text: "所屬單位",
    value: "cmDeptDTO.cmDeptName",
    width: "10%",
    align: "center",
    sortable: false
  },
  {
    text: "電子郵件",
    value: "cmUserEmail",
    width: "30%",
    align: "center",
    sortable: false
  },
  {
    text: "角色",
    value: "cmRoles",
    width: "25%",
    align: "center",
    sortable: false
  },
  {
    text: "編輯",
    value: "edit",
    width: "5%",
    align: "center",
    sortable: false
  },
  {
    text: "註銷",
    value: "writeOff",
    width: "5%",
    align: "center",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
</style>


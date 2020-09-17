<template>
  <div id="userAuth">
    <v-card-title class="font-weight-black">功能授權管理</v-card-title>

    <v-col class="d-lg-flex d-md-flex ma-0 pa-0" cols="12">
      <v-col sm="12" md="3" lg="3">
        <v-select
          :items="deptsData"
          item-text="cmDeptName"
          item-value="cmDeptId"
          label="角色所屬單位"
          v-model="cmDeptId"
          outlined
          dense
        ></v-select>
      </v-col>

      <v-col sm="12" md="3" lg="3">
        <v-select
          :items="rolesData"
          item-text="cmRoleName"
          label="角色"
          outlined
          dense
          v-model="cmRoleName"
        ></v-select>
      </v-col>
    </v-col>

    <v-col class="d-lg-flex d-md-flex ma-0" cols="12">
      <v-btn color="primary" class="ma-1" @click="getUserData(cmDeptId,cmRoleName)">人員查詢</v-btn>

      <v-btn color="primary" class="ma-1" @click="getRoleData(cmDeptId,cmRoleName)">授權查詢</v-btn>

      <v-btn dark color="cyan" class="ma-1" @click="openDialog">新增角色</v-btn>

      <v-btn
        @click="exportExcel('user')"
        dark
        color="cyan"
        class="ma-1"
        v-if="searchParam==='user'"
      >匯出人員角色報表</v-btn>

      <v-btn
        @click="exportExcel('role')"
        dark
        color="cyan"
        class="ma-1"
        v-if="searchParam==='role'"
      >匯出角色權限報表</v-btn>
    </v-col>

    <v-col cols="12" sm="12" md="9" lg="9" v-if="searchParam==='user'">
      <data-table-account
        :headers="headersUser"
        :dataArray="dataArray"
        @remove="(data)=>handleRemove('user',data)"
      ></data-table-account>
    </v-col>

    <v-col cols="12" sm="12" md="9" lg="9" v-if="searchParam==='role'">
      <data-table-account
        :headers="headersRole"
        :dataArray="dataArray"
        @remove="(data)=>handleRemove('role',data)"
        @edit="(data)=>handleEdit(data)"
      ></data-table-account>
    </v-col>

    <profile-dialog
      ref="dialog"
      :title="(dialogStatus==='add'?'新增':'編輯')+'-角色'"
      profileWidth="1000px"
      enableTitle
    >
      <template #dialog-content>
        <role-detail
          :dataSource="dataSource"
          :depts="depts"
          :menuData="menuData"
          @complete="handleComplete"
        ></role-detail>
      </template>
    </profile-dialog>
  </div>
</template>

<script>
import roleDetail from "@/containers/account/roleDetail";
import dataTableAccount from "@/containers/account/dataTable";
export default {
  layout: "audit/template",
  components: {
    roleDetail,
    dataTableAccount
  },
  data: () => ({
    headersUser: tableHeader_user,
    headersRole: tableHeader_role,
    searchParam: "user",
    depts: [],
    dataArray: [],
    cmDeptId: "",
    cmRoleName: "",
    dataSource: null,
    dialogStatus: "add",
    menuData: null,
    roles: [{ cmRoleId: "", cmRoleName: "全部" }]
  }),
  methods: {
    async exportExcel(type) {
      const obj = {
        user: { url: "api_excel_user", fileName: "人員角色報表" },
        role: { url: "api_excel_role", fileName: "角色權限報表" }
      };

      const res = await this.$store.dispatch("getExportExcel", {
        url: obj[type].url,
        params: { cmDeptId: this.cmDeptId, cmRoleName: this.cmRoleName }
      });
      if (res !== null && res !== undefined) {
        this.download(res, obj[type].fileName);
        this.$store.dispatch("alert", "下載成功");
      }
    },
    download(data, fileName) {
      if (!data) {
        return;
      }

      let blob = new Blob([data], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });

      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    },
    handleComplete() {
      this.$refs.dialog.toggle(false);
      this.getRoleData(this.cmDeptId, this.cmRoleName);
    },
    async getDept() {
      const data = await this.$store.dispatch("getDept");

      data.forEach(ele => {
        this.depts.push(ele);
      });

      this.roleData(this.cmDeptId);
    },

    roleData(cmDeptId) {
      this.roles = [];
      if (cmDeptId === "") {
        this.depts.forEach(ele => {
          ele.cmRoleDTOSet.forEach(ele2 => {
            this.roles.push(ele2);
          });
        });
      } else {
        this.depts.forEach(ele => {
          if (ele.cmDeptId === cmDeptId) {
            ele.cmRoleDTOSet.forEach(ele2 => {
              this.roles.push(ele2);
            });
          }
        });
      }
    },
    openDialog(data) {
      this.dataSource = null;
      this.$refs.dialog.toggle(true);
    },
    async handleEdit(data) {
      await this.getRoleMenuData(data.cmRoleDTO.cmRoleId);
      this.$refs.dialog.toggle(true);
    },
    async handleRemove(action, ele) {
      let res = null;
      if (action === "user" && ele !== null) {
        res = await this.$store.dispatch("actionApi", {
          method: "put",
          url: "api_privilegeUser",
          params: {
            cmRoleId: ele.cmRoleDTO.cmRoleId,
            cmUserId: ele.cmUserInfoDTO.cmUserId
          }
        });
        this.getUserData(this.cmDeptId, this.cmRoleName);
      } else {
        res = await this.$store.dispatch("actionApi", {
          method: "put",
          url: "api_privilegeRole",
          params: { cmRoleId: ele.cmRoleDTO.cmRoleId }
        });
        this.getRoleData(this.cmDeptId, this.cmRoleName);
      }

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "停用成功");
      } else {
        this.$store.dispatch("alert", "停用失敗");
      }
    },
    async getUserData(cmDeptId, cmRoleName) {
      this.searchParam = "user";

      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_privilegeUser",
        params: {
          cmDeptId: cmDeptId,
          cmRoleName: cmRoleName === "全部" ? "" : cmRoleName
        }
      });

      if (res !== null && res !== undefined) {
        this.dataArray = [];
        this.dataArray = res;
      }
    },
    async getRoleData(cmDeptId, cmRoleName) {
      this.searchParam = "role";

      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_privilege",
        params: {
          cmDeptId: cmDeptId,
          cmRoleName: cmRoleName === "全部" ? "" : cmRoleName
        }
      });

      if (res !== null && res !== undefined) {
        this.dataArray = [];
        this.dataArray = res;
      }
    },
    async getRoleMenuData(cmRoleId) {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_privilegeRole",
        params: { cmRoleId: cmRoleId }
      });

      if (res !== null && res !== undefined) {
        if (cmRoleId === "") {
          this.menuData = null;
          this.menuData = res;
        } else {
          this.dataSource = null;
          this.dataSource = res;
        }
      }
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
    cmDeptId() {
      this.roleData(this.cmDeptId);
    }
  },
  created() {
    this.getDept();
    this.getRoleMenuData("");
  },
  mounted() {
    this.getUserData();
  }
};

export const tableHeader_user = [
  {
    text: "角色名稱",
    value: "cmRoleDTO.cmRoleName",
    width: "20%",
    align: "center",
    sortable: false
  },
  {
    text: "所屬部門",
    value: "cmDeptDTO.cmDeptName",
    width: "30%",
    align: "center",
    sortable: false
  },
  {
    text: "中文姓名",
    value: "cmUserInfoDTO.cmUserName",
    width: "30%",
    align: "center",
    sortable: false
  },
  {
    text: "停用",
    value: "remove",
    width: "20%",
    align: "center",
    sortable: false
  }
];

export const tableHeader_role = [
  {
    text: "角色名稱",
    value: "cmRoleDTO.cmRoleName",
    width: "20%",
    align: "center",
    sortable: false
  },
  {
    text: "所屬部門",
    value: "cmDeptDTO.cmDeptName",
    width: "30%",
    align: "center",
    sortable: false
  },
  {
    text: "編輯",
    value: "edit",
    width: "10%",
    align: "center",
    sortable: false
  },
  {
    text: "停用",
    value: "remove",
    width: "10%",
    align: "center",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
</style>


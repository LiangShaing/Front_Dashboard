<template>
  <div id="roleDetail">
    <v-card-title>角色明細</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-col class="d-lg-flex d-md-flex ma-0 pa-0" cols="12">
        <v-col sm="12" md="3" lg="3">
          <v-select
            :items="depts"
            item-text="cmDeptName"
            item-value="cmDeptId"
            label="角色所屬單位"
            v-model="cmDeptId"
            outlined
            dense
            :disabled="status==='edit'"
            :rules="[v => !!v || '↑不能為空']"
          ></v-select>
        </v-col>

        <v-col sm="12" md="3" lg="3">
          <v-text-field
            outlined
            dense
            type="text"
            placeholder="角色名稱"
            v-model="roleName"
            :rules="[v => !!v || '↑不能為空']"
          ></v-text-field>
        </v-col>
      </v-col>

      <v-container grid-list-lg fluid>
        <v-card-title class="ma-0 pa-0">
          <v-col class="d-lg-flex d-md-flex ma-0 pa-0" cols="12">
            <v-col sm="6" md="6" lg="6" class="ma-0 pa-0">
              <p class="text-start">權限設定</p>
            </v-col>
          </v-col>
        </v-card-title>
        <data-table-account :headers="headers" :dataArray="dataArray"></data-table-account>
      </v-container>
    </v-form>

    <v-col class="d-lg-flex d-md-flex" cols="12" sm="12">
      <v-btn
        color="primary"
        class="ma-1"
        @click="save()"
        :disabled="!valid ||(status==='edit' && updateButton)"
      >儲存</v-btn>
    </v-col>
  </div>
</template>

<script>
import axios from "@/util/axios";
import uri from "@/api/uri";
import dataTableAccount from "@/containers/account/dataTable";
export default {
  components:{
dataTableAccount
  },
  props: {
    menuData: {
      type: Object,
      default: null
    },
    depts: {
      type: Array,
      default: []
    },
    dataSource: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    headers: tableHeader,
    dataArray: [],
    roleName: "",
    cmDeptId: "",
    status: "add",
    updateButton: false,
    valid: true
  }),
  methods: {
    async save() {
      let clone = null;
      if (this.status === "add") {
        clone = JSON.parse(JSON.stringify(this.menuData));
        clone.cmDeptDTO.cmDeptId = this.cmDeptId;
      } else {
        clone = JSON.parse(JSON.stringify(this.dataSource));
      }
      clone.cmRoleDTO.cmRoleName = this.roleName;
      clone.cmMenuDTOList = this.dataArray;

      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_privilegeRole",
        params: clone
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch(
          "alert",
          (this.status === "add" ? "新增" : "更新") + "成功"
        );
        this.$emit("complete");
      } else {
        this.$store.dispatch(
          "alert",
          (this.status === "add" ? "新增" : "更新") + "失敗"
        );
      }
    },
    editData() {
      if (this.dataSource !== null) {
        this.status = "edit";
        const clone = JSON.parse(JSON.stringify(this.dataSource));
        this.cmDeptId = clone.cmDeptDTO.cmDeptId;
        this.roleName = clone.cmRoleDTO.cmRoleName;

        this.dataArray.forEach(ele => {
          this.dataSource.cmMenuDTOList.forEach(val => {
            if (ele.cmMenuId === val.cmMenuId) {
              ele.level = val.level;
            }
          });
        });
      }
    }
  },
  watch: {},
  created() {
    // 取得menu data
    this.dataArray = JSON.parse(JSON.stringify(this.menuData.cmMenuDTOList));
  },
  mounted() {
    // 存入編輯data
    this.editData();
  }
};

export const tableHeader = [
  {
    text: "一階",
    value: "cmMenuName1",
    width: "20%",
    align: "center",
    sortable: false
  },
  {
    text: "二階",
    value: "cmMenuName2",
    width: "20%",
    align: "center",
    sortable: false
  },
  {
    text: "三階",
    value: "cmMenuName3",
    width: "20%",
    align: "center",
    sortable: false
  },
  {
    text: "審核層級(E:經辦、R:大經辦、A:覆核者)",
    value: "level",
    width: "40%",
    align: "",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
</style>


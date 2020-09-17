<template>
  <div id="saveOrUpdateUser">
    <v-col cols="12" sm="12" md="11" lg="11">
      <v-form v-model="valid" ref="form">
        <form-generate :labels="accountLabels" :dataSourceList="[form]"></form-generate>
      </v-form>
    </v-col>

    <v-col class="d-flex pa-5 justify-center" sm="12" md="12" lg="12">
      <profile-dialog profileWidth="400px">
        <template #open-dialog>
          <v-btn color="primary" @click="save()" class="ma-1" :disabled="!valid">儲存</v-btn>
        </template>

        <template #dialog-content>
          <div class="text-center">確認{{action==='add'?'新增':'修改'}}?</div>
        </template>

        <template #dialog-close>
          <v-btn color="primary">取消</v-btn>
        </template>

        <template #dialog-save>
          <v-btn color="primary" @click="confirm(action)">確認</v-btn>
        </template>
      </profile-dialog>

      <v-btn
        v-if="action==='editor'"
        color="error"
        @click="suspend"
        class="ma-1"
        :disabled="form.cmActive==='0'"
      >註銷</v-btn>
    </v-col>
  </div>
</template>

<script>
import axios from "@/util/axios";
import uri from "@/api/uri";
export default {
  props: {
    action: {
      type: String,
      default: "add"
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
    accountLabels: [
      {
        text: "AD帳號",
        type: "text",
        value: "cmUserId",
        valid: ["required"]
      },
      {
        text: "中文姓名",
        type: "text",
        value: "cmUserName",
        valid: ["required"]
      },
      {
        text: "所屬單位",
        type: "select",
        value: "cmDeptId",
        itemsValue: "cmDeptId",
        itemsText: "cmDeptName",
        items: [],
        valid: ["required"]
      },
      {
        text: "電子郵件",
        type: "text",
        value: "cmUserEmail",
        valid: ["required", "email"]
      },
      {
        text: "角色",
        type: "multipleSelect",
        value: "cmRoleIdSet",
        itemsValue: "cmRoleId",
        itemsText: "cmRoleName",
        items: [],
        valid: ["required"]
      }
    ],
    form: {
      cmUserId: "",
      cmUserName: "",
      cmDeptId: "",
      cmUserEmail: "",
      cmRoleIdSet: [],
      cmActive: ""
    },
    valid: true
  }),
  computed: {},
  methods: {
    save() {
      this.$refs.form.validate();
    },
    async confirm(action) {
      if (action === "add") {
        const res = await this.$store.dispatch("actionApi", {
          method: "post",
          url: "api_user",
          params: this.form
        });
        this.dataArray = [];

        if (res !== null && res !== undefined) {
          this.$emit("complete");
          this.$store.dispatch("alert", "新增成功");
        } else {
          this.$store.dispatch("alert", "新增失敗");
        }
      } else {
        const res = await this.$store.dispatch("actionApi", {
          method: "put",
          url: "api_user",
          params: this.form
        });
        this.dataArray = [];

        if (res !== null && res !== undefined) {
          this.$emit("complete");
          this.$store.dispatch("alert", "修改成功");
        } else {
          this.$store.dispatch("alert", "修改失敗");
        }
      }
    },
    async suspend() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_userSuspend",
        params: this.dataSource
      });
      this.dataArray = [];

      if (res !== null && res !== undefined) {
        this.$emit("complete");
        this.$store.dispatch("alert", "註銷成功");
      }
    },
    getDept() {
      this.accountLabels.forEach(ele => {
        if (ele.value === "cmDeptId") {
          ele.items = this.depts;
        }
      });
    },
    getRole(deptVal) {
      let roles = [];
      if (deptVal !== "") {
        this.depts.forEach(ele => {
          if (ele.cmDeptId === deptVal) {
            ele.cmRoleDTOSet.forEach(ele2 => {
              roles.push(ele2);
            });
          }
        });
      }
      this.accountLabels.forEach(ele => {
        if (ele.value === "cmRoleIdSet") {
          ele.items = roles;
        }
      });
    },
    editorData() {
      if (this.action === "editor" && this.dataSource !== null) {
        this.accountLabels.forEach(ele => {
          if (ele.value === "cmUserId") {
            ele.disabled = true;
          }
        });

        this.form.cmUserId = this.dataSource.cmUserId;
        this.form.cmUserName = this.dataSource.cmUserName;
        this.form.cmDeptId = this.dataSource.cmDeptDTO.cmDeptId;
        this.form.cmUserEmail = this.dataSource.cmUserEmail;
        this.form.cmActive = this.dataSource.cmActive;
        let arr = [];
        this.dataSource.cmRoleDTOSet.forEach(ele => arr.push(ele.cmRoleId));
        this.form.cmRoleIdSet = arr;
      }
    }
  },
  watch: {
    "form.cmDeptId": function(val, oldVal) {
      if (val !== oldVal) {
        if (
          this.dataSource !== null &&
          this.dataSource.cmDeptDTO.cmDeptId !== val
        ) {
          this.form.cmRoleIdSet = [];
        }
        this.getRole(val);
      }
    }
  },
  created() {
    this.getDept();
  },
  mounted() {
    this.editorData();
  }
};
</script>

<style lang="css" >
</style>


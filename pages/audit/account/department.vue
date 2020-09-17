<template>
  <div id="department">
    <v-card-title class="font-weight-black">部門維護</v-card-title>
    <div class="ma-10">
      <v-col sm="12" md="3" lg="3">
        <v-btn dark color="cyan" @click="handleAdd">新增部門</v-btn>
      </v-col>

      <v-form v-model="valid" ref="form">
        <v-col cols="12" sm="12" md="6" lg="6">
          <data-table-account :headers="headers" :dataArray="deptList" @delete="handleDelete"></data-table-account>
        </v-col>

        <v-col sm="12" md="6" lg="6" class="justify-center text-center">
          <v-btn color="primary" :disabled="!valid" @click="save">儲存</v-btn>
        </v-col>
      </v-form>
    </div>
  </div>
</template>

<script>
import dataTableAccount from "@/containers/account/dataTable";
export default {
  layout: "audit/template",
  components: {
    dataTableAccount
  },
  data: () => ({
    headers: tableHeader,
    deptList: [],
    newObj: { cmDeptName: "" },
    valid: true
  }),
  methods: {
    handleAdd() {
      let obj = JSON.parse(JSON.stringify(this.newObj));
      this.deptList.splice(0, 0, obj);
    },
    handleDelete(item) {
      let index = this.deptList
        .map(function(x) {
          return x;
        })
        .indexOf(item);
      this.deptList.splice(index, 1);
    },
    async getDept() {
      const data = await this.$store.dispatch("getDept");
      this.deptList = data.map(ele => {
        ele.checkbox = false;
        return ele;
      });
    },
    async save() {
      let saveDeptList = [];
      let delDeptList = [];

      this.deptList.forEach(ele => {
        if (ele.checkbox !== undefined && ele.checkbox) {
          delDeptList.push(ele);
        } else {
          saveDeptList.push(ele);
        }
      });

      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_dept",
        params: {
          saveDeptList: saveDeptList,
          delDeptList: delDeptList
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "儲存成功");
        this.getDept();
      } else {
        this.$store.dispatch("alert", "儲存失敗");
      }
    }
  },
  watch: {
    deptList: {
      handler: function(val, oldVal) {
        this.$refs.form.validate();
      },
      deep: true
    }
  },
  created() {
    this.getDept();
  },
  mounted() {}
};

export const tableHeader = [
  {
    text: "部門名稱",
    value: "cmDeptName",
    width: "80%",
    align: "center",
    sortable: false,
    class: ["mb-0"]
  },
  {
    text: "刪除",
    value: "checkbox",
    width: "20%",
    sortable: false
  }
];
</script>

<style lang="css" scoped>
</style>


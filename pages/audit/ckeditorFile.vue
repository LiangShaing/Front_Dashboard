<template>
  <div id="ckeditorFile" data-app="true">
    <v-card-title>選擇檔案</v-card-title>

    <!-- <form-option title="幣別">
      
    </form-option>-->
    <v-col cols="12" md="6" class="d-flex">
      <v-select
        :items="stockItems"
        v-model="value"
        item-text="text"
        item-value="value"
        label="選擇檔案"
        outlined
        dense
      ></v-select>
      <v-btn @click="save">確認</v-btn>
    </v-col>
  </div>
</template>

<script>
import axios from "@/util/axios";
import uri from "@/api/uri";
export default {
  props: {},
  data: () => ({
    value: "",
    stockItems: []
  }),
  methods: {
    save() {
      let search = new URLSearchParams(window.location.search);
      let func = search.get("CKEditorFuncNum");
      let url = "";
     
      const name = this.value;
      const suffixIndex = name.lastIndexOf(".");
      const suffix = name.substring(suffixIndex + 1).toLowerCase();
      if (process.env.IMAGE_TYPE.includes(suffix)) {
        url =
          `${axios.defaults.baseURL}` +
          uri.api_resource_image +
          "/" +
          this.value;
      } else if (process.env.PDF_TYPE.includes(suffix)) {
        url =
          `${axios.defaults.baseURL}` + uri.api_resource_pdf + "/" + this.value;
      }
       
      if (url !== "") {
        window.opener.CKEDITOR.tools.callFunction(func, url);
        window.close();
      }
    },
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItems = data;
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getResource();
  }
};
</script>

<style lang="css" scoped>
</style>


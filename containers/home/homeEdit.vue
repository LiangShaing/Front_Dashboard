<template>
  <div id="homeEdit">
    <v-form v-model="valid">
      <v-card-title>Banner廣告區塊</v-card-title>
      <panel-multiple :labels="bannerLabels" :dataSourceList="form.bannerList" enAction></panel-multiple>

      <v-divider :inset="false" class="ma-2"></v-divider>

      <v-card-title>您需要什麼保障</v-card-title>
      <form-option title="標題">
        <v-text-field outlined dense type="text" placeholder v-model="form.title" required></v-text-field>
      </form-option>
      <form-option title="內容">
        <v-text-field outlined dense type="text" placeholder v-model="form.content" required></v-text-field>
      </form-option>
      <template v-for="(insuranceGroup,index) in form.insuranceGroupList">
        <insurance-group
          :key="index+'-insuranceGroup'"
          :dataSource="insuranceGroup"
          @add="handleAddInsuranceGroup"
          @remove="handleRmInsuranceGroup"
          :index="index"
        ></insurance-group>

        <v-btn
          v-if="insuranceGroup.insuranceList.length===0"
          :key="index+'_b'"
          class="ma-2"
          outlined
          color="green"
          @click="handleAddInsurance(index)"
          v-show="insuranceGroup.childExpand"
        >
          <v-icon>playlist_add</v-icon>新增險別資訊
        </v-btn>

        <div :key="index+'-d'" v-show="insuranceGroup.childExpand">
          <template v-for="(insurance,index2) in insuranceGroup.insuranceList">
            <insurance
              :key="index2+'-insurance'"
              :dataSource="insurance"
              @add="handleAddInsurance"
              @remove="handleRmInsurance"
              :groupIndex="index"
              :index="index2"
            ></insurance>
          </template>
        </div>
      </template>

      <v-divider :inset="false" class="ma-2"></v-divider>

      <v-card-title>線上即時服務</v-card-title>
      <form-option title="標題">
        <v-text-field outlined dense type="text" placeholder v-model="form.title" required></v-text-field>
      </form-option>
      <form-option title="內容">
        <v-text-field outlined dense type="text" placeholder v-model="form.content" required></v-text-field>
      </form-option>
      <panel-multiple :labels="serviceLabels" :dataSourceList="service.serviceList" enAction></panel-multiple>

      <v-divider :inset="false" class="ma-5"></v-divider>

      <v-col class="d-lg-flex d-md-flex pa-5" cols="12" sm="12">
        <v-btn dark color="primary" class="ma-1">預覽</v-btn>
        <v-btn dark color="primary" @click="save()" class="ma-1">儲存</v-btn>
        <v-btn dark color="primary" class="ma-1">送出</v-btn>
        <v-btn dark color="error" class="ma-1">退件</v-btn>
        <v-btn dark color="cyan" class="ma-1">審核通過</v-btn>
      </v-col>
    </v-form>
  </div>
</template>

<script>
import insuranceGroup from "@/components/home-edit-widgets/InsuranceGroup";
import insurance from "@/components/home-edit-widgets/Insurance";

export default {
  components: {
    insuranceGroup,
    insurance
  },
  data: () => ({
    bannerLabels: bannerLabels,
    serviceLabels: serviceLabels,
    initInsuranceGroup: {
      title: "",
      insuranceList: [],
      childExpand: false
    },
    initInsurance: {
      insurance: "",
      img: []
    },
    initService: {
      title: "",
      link: "",
      img: []
    },
    form: {
      title: "",
      content: "",
      bannerList: [],
      insuranceGroupList: [
        {
          title: "",
          insuranceList: [],
          childExpand: true
        }
      ]
    },
    service: {
      title: "",
      content: "",
      serviceList: []
    },
    valid: true
  }),
  methods: {
    handleAddInsuranceGroup() {
      const newObj = JSON.parse(JSON.stringify(this.initInsuranceGroup));
      this.form.insuranceGroupList.push(newObj);
    },
    handleRmInsuranceGroup(index) {
      if (this.form.insuranceGroupList.length === 1) {
        this.$store.dispatch("alert", "無法刪除，至少保留1項");
      } else {
        const newObj = JSON.parse(JSON.stringify(this.form.insuranceGroupList));
        newObj.splice(index, 1);
        this.form.insuranceGroupList = newObj;
      }
    },
    handleAddInsurance(index) {
      // if (this.ensure.insuranceGroupList[index].insuranceList.length < 9) {
        const newObj = JSON.parse(JSON.stringify(this.initInsurance));
        this.form.insuranceGroupList[index].insuranceList.push(newObj);
      // } else {
      //   this.$store.dispatch("alert", "最多可以有6個二階");
      // }
    },
    handleRmInsurance(groupIndex, index) {
      const insuranceList = this.form.insuranceGroupList[groupIndex]
        .insuranceList;
      const newObj = JSON.parse(JSON.stringify(insuranceList));
      newObj.splice(index, 1);
      this.form.insuranceGroupList[groupIndex].insuranceList = newObj;
    },
    save() {
      //   console.log(this.levelOne);
    }
  },
  mounted() {
    // if (this.$route.params && Object.keys(this.$route.params).length !== 0) {
    //   this.form = this.$route.params;
    // }
  }
};

// Banner廣告區塊
export const bannerLabels = [
  {
    text: "廣告小標",
    type: "text",
    value: "mark"
  },
  {
    text: "廣告內容",
    type: "text",
    value: "content"
  },
  {
    text: "廣告圖檔",
    type: "file",
    value: "img"
  }
];
// 線上即時服務
export const serviceLabels = [
  {
    text: "服務標題",
    type: "text",
    value: "title"
  },
  {
    text: "服務連結",
    type: "text",
    value: "link"
  },
  {
    text: "服務圖示",
    type: "file",
    value: "img"
  }
];
</script>

<style lang="css" scoped>
</style>


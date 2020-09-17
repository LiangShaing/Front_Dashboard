<template>
  <div id="customerRights">
    <breadcrumbs :items="breadcrumbs" :currentIndex="currentIndex"></breadcrumbs>
    <div v-if="currentIndex==='0'">
      <v-col cols="12" class="d-md-flex d-lg-flex pb-0">
        <v-col sm="12" md="5" lg="5" class="pl-0">
          <form-option title="所屬頁籤">
            <v-select
              :items="items"
              item-text="name"
              item-value="uid"
              label="頁籤"
              outlined
              dense
              v-model="tag"
            ></v-select>
          </form-option>
        </v-col>
        <v-col sm="12" md="4" lg="4" >
          <v-btn
            v-if="currentPageAuth.indexOf(caseEnum.e)!==-1"
            dark
            color="#4caf50"
            class="ma-1"
            @click="()=>openEdit('1','add',null)"
          >
            <v-icon small class="mr-1">playlist_add</v-icon>新增
          </v-btn>
          <v-btn dark color="primary" @click="preview" class="ma-1">
            <v-icon small class="mr-1">pageview</v-icon>預覽
          </v-btn>
        </v-col>
      </v-col>

      <v-col sm="12" md="10" lg="10" class="pt-0">
        <data-table
          hideFooter
          :headers="headers"
          :dataArray="dataArray"
          @edit="(data)=>openEdit('1','editor',data)"
          @remove="(data)=>handleRemove(data)"
          @audit="(data)=>openEdit('1','audit',data)"
          sort="seq"
          sortAsc
        ></data-table>
      </v-col>
    </div>

    <customer-rights-edit
      v-else
      :pageTitle="(action==='add'?'新增':action==='audit'?'審核':'編輯')"
      :tags="items"
      :dataSource="dataSource"
      @complete="handleComplete"
      @back="handleBack"
      :currentPageAuth="currentPageAuth"
    ></customer-rights-edit>
  </div>
</template>

<script>
import customerRightsEdit from "@/containers/footer/customerRightsEdit";
import authUtil from "@/util/authUtil";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {
    customerRightsEdit
  },
  data: vm => ({
    breadcrumbs: [
      {
        text: "客戶權益須知",
        disabled: false,
        click: () => {
          vm.handleBack();
        }
      },
      {
        text: "明細",
        disabled: false,
        click: () => {}
      }
    ],
    currentIndex: "0",
    member: JSON.parse(window.sessionStorage.getItem("userInfo")),
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    headers: JSON.parse(JSON.stringify(tableHeader)),
    dataArray: [],
    items: [],
    tag: "",
    dataSource: null,
    action: "add",
    featureShow: []
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    }
  },
  methods: {
    preview() {
      window.open(previewUrl.rights + "/?preview=true", "_blank");
    },
    handleComplete() {
      window.scrollTo(0, 0);
      this.currentIndex = "0";
      this.getData(this.tag);
    },
    handleBack() {
      window.scrollTo(0, 0);
      this.getData(this.tag);
      this.currentIndex = "0";
    },
    openEdit(view, action, data) {
      this.action = action;
      this.dataSource = null;
      if (view === "1") {
        if (data !== null) {
          this.dataSource = data;
          if (data.status === caseEnum.r || data.status === caseEnum.a) {
            this.action = "audit";
          } else {
            this.action = "edit";
          }
        }
      }

      this.currentIndex = view;
    },
    async getTags() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_about_right_tags_rest_findByCmDeptListLike",
        params: { id: this.$store.state.userInfo.cmDeptDTO.cmDeptId }
      });
      this.items = [];
      if (res !== null && res !== undefined) {
        this.items = res._embedded.aboutRightTagses;
      }
    },
    async getData(tagId) {
      if (tagId) {
        const res = await this.$store.dispatch("actionApi", {
          method: "get",
          url: "api_about_right",
          params: {
            tagUid: tagId,
            cmDeptId: this.member.cmDeptDTO.cmDeptId
          }
        });
        this.dataArray = [];
        if (res !== null && res !== undefined) {
          this.dataArray = res;
        }
      }
    },
    async handleRemove(data) {
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_about_right",
        restParam: "/" + data.uid
      });
      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "刪除成功");
        this.getData(this.tag);
      } else {
        this.$store.dispatch("alert", "刪除失敗");
      }
    }
  },
  watch: {
    tag() {
      this.getData(this.tag);
    }
  },
  created() {
    // authUtil.combindAuthBtn(this.currentPageAuth, this.headers);
    authUtil.combindAuthBtn(this.currentPageAuth, this.headers);
  },
  mounted() {
    this.getTags();
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
  {
    text: "排序",
    value: "seq",
    align: "center",
    width: "5%"
  },
  {
    text: "狀態",
    value: "status",
    align: "center",
    width: "8%",
    sortable: false
  }
  //   {
  //     text: "上架時間",
  //     value: "onTime",
  //     align: "center",
  //     width: "12%",
  //   },
  //   {
  //     text: "下架時間",
  //     value: "offTime",
  //     align: "center",
  //     width: "12%",
  //   }
];
</script>

<style lang="css" scoped>
</style>


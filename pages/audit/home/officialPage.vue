<template>
  <div id="officialPage">
    <page-tool-bar
      :currentStatus="currentStatus"
      :currentIsDelete="form.isDelete"
      :currentCompontent="currentCompontent"
      :breadcrumbs="breadcrumbs"
    ></page-tool-bar>
    <div class="main-content">
      <!-- <v-btn icon class="ma-2" min-width="150" @click="collapse" light>
        <v-icon color="primary">list</v-icon>
        {{collapseBln?'全部收缩' :'全部展開'}}
      </v-btn>-->
      <v-form v-model="valid" ref="form">
        <!-- <v-card-text>
          <template v-for="(item,levelOneIndex) in levelOne">
            <level-one
              :key="levelOneIndex"
              @add="handleAddLevelOne"
              @remove="handleRmLevelOne"
              :index="levelOneIndex"
              :dataSource="item"
              :disabled="disabled"
              :stockItems="stockItems"
            ></level-one>
            <div
              v-if="item.levelTwo.length===0"
              :key="levelOneIndex+'_b'"
              v-show="item.childExpand"
            >
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                @click="handleAddLevelTwo(levelOneIndex)"
                :disabled="disabled || (item.link!==null && item.link!=='')"
              >
                <v-icon>playlist_add</v-icon>新增第二階
              </v-btn>
              <span class="ma-1">提示 : 第一階功能連結欄位有值時，不能新增第二階</span>
            </div>
            <div :key="levelOneIndex+'-level2'" v-show="item.childExpand" class="ml-5">
              <template v-for="(item2,levelTwoIndex) in item.levelTwo">
                <level-two
                  :key="levelOneIndex+'-'+levelTwoIndex"
                  @add="handleAddLevelTwo"
                  @remove="handleRmLevelTwo"
                  :levelOneIndex="levelOneIndex"
                  :index="levelTwoIndex"
                  :dataSource="item2"
                  :disabled="disabled"
                ></level-two>

                <div
                  v-if="item2.levelThr.length===0"
                  :key="levelOneIndex+'-'+levelTwoIndex+'-b'"
                  v-show="item2.childExpand"
                >
                  <v-btn
                    class="ml-12 mt-1"
                    outlined
                    color="indigo"
                    @click="handleAddLevelThr(levelOneIndex,levelTwoIndex)"
                    :disabled="disabled || (item2.link!==null &&item2.link!=='')"
                  >
                    <v-icon>playlist_add</v-icon>新增第三階
                  </v-btn>
                  <span class="ma-1">提示 : 第二階功能連結欄位有值時，不能新增第三階</span>
                </div>
                <div :key="levelTwoIndex+'-level3'" v-show="item2.childExpand" class="ml-5">
                  <template v-for="(item3,levelThrIndex) in item2.levelThr">
                    <level-thr
                      :key="levelOneIndex+'-'+levelTwoIndex+'-'+levelThrIndex"
                      @add="handleAddLevelThr"
                      @remove="handleRmLevelThr"
                      :levelOneIndex="levelOneIndex"
                      :levelTwoIndex="levelTwoIndex"
                      :index="levelThrIndex"
                      :dataSource="item3"
                      :disabled="disabled"
                      :bigCoverageList="bigCoverageList"
                    ></level-thr>
                  </template>
                </div>
              </template>
            </div>

            <v-divider :key="levelOneIndex+'_1'" :inset="false" class="ma-5"></v-divider>
          </template>
        </v-card-text>-->
        <v-card-title class="font-weight-black">
          <v-icon>label_important</v-icon>頁尾設定
        </v-card-title>

        <v-card class="ma-5 pa-lg-5">
          <v-card-title>集團成員</v-card-title>
          <form-generate
            :labels="companyLabels"
            :dataSourceList="companyList"
            :disabled="disabled"
            enAction
          ></form-generate>
        </v-card>

        <v-card class="ma-5 pa-lg-5">
          <v-card-title>連結設定</v-card-title>
          <form-generate
            :labels="pageFooterLabels"
            :dataSourceList="pageFooterList"
            :disabled="disabled"
            enAction
          ></form-generate>
        </v-card>

        <v-card class="ma-5 pa-lg-5">
          <v-card-title>社群連結</v-card-title>
          <form-generate
            :labels="communityLabels"
            :dataSourceList="communityList"
            :stockItems="stockItems"
            :disabled="disabled"
            enAction
          ></form-generate>
        </v-card>
        
        <v-card class="ma-5 pa-lg-5">
          <v-card-title>公司資訊</v-card-title>
          <form-generate
            :labels="companyInfoLabels"
            :dataSourceList="[companyInfo]"
            :disabled="disabled"
          ></form-generate>
        </v-card>

        <!-- <v-col class="pa-0 ma-2" cols="12">
          <doc-review
            :form="form"
            :disabled="disabled || currentStatus===caseEnum.r || currentStatus===caseEnum.a"
          ></doc-review>
          <action-btn
            :currentCaseStatus="currentStatus"
            :currentPageAuth="currentPageAuth"
            :currentCaseIsDelete="form.isDelete"
            :valid="valid"
            @preview="preview"
            @checkSave="checkSave"
            @auditSuccess="auditSuccess"
            @inputRejectMessage="inputRejectMessage"
            :btn="[ 'preview', 'save', 'audit', 'reject']"
          ></action-btn>
        </v-col> -->
      </v-form>

      <profile-dialog profileWidth="400px" ref="confirmDialog">
        <template #dialog-content>
          <div class="text-center">檔名已重複 : {{confirmMessages}}</div>
          <div class="text-center">確認覆蓋?</div>
        </template>

        <template #dialog-close>
          <v-btn color="primary">取消</v-btn>
        </template>

        <template #dialog-save>
          <v-btn color="primary" @click="save">確認</v-btn>
        </template>
      </profile-dialog>

      <profile-dialog profileWidth="400px" ref="rejectDialog">
        <template #dialog-content>
          <div class="text-center">退件原因 :</div>
          <v-textarea outlined label v-model="rejectMessages"></v-textarea>
        </template>

        <template #dialog-close>
          <v-btn color="primary">取消</v-btn>
        </template>

        <template #dialog-save>
          <v-btn color="primary" @click="reject">確認</v-btn>
        </template>
      </profile-dialog>
    </div>
  </div>
</template>

<script>
import LevelOne from "@/components/official-edit-widgets/LevelOne";
import LevelTwo from "@/components/official-edit-widgets/LevelTwo";
import LevelThr from "@/components/official-edit-widgets/LevelThr";

import {
  caseEnum,
  officialPageLinkAreaEnum,
  officialPageHeaderLinkEnum,
  currentCaseStatusEnum
} from "@/api/enum";
import Util from "@/util";
import previewUrl from "@/api/previewUrl";
export default {
  layout: "audit/template",
  components: {
    LevelOne,
    LevelTwo,
    LevelThr
  },
  data: vm => ({
    currentCompontent: "agent1",
    breadcrumbs: [
      {
        text: "頁面連結管理",
        disabled: false,
        compontent: "officailPage",
        click: () => {
          vm.currentCompontent = "officailPage";
        }
      },
      {
        text: "明細",
        disabled: false,
        compontent: "agent",
        click: () => {
          vm.currentCompontent = "agent";
        }
      },
      {
        text: "內容",
        disabled: false,
        compontent: "agent1",
        click: () => {
          vm.currentCompontent = "agent1";
        }
      }
    ],

    collapseBln: true,
    dataSource: null,
    member: JSON.parse(window.sessionStorage.getItem("userInfo")),
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    officialPageHeaderLinkEnum: officialPageHeaderLinkEnum,
    currentStatus: caseEnum.a,
    rejectMessages: "",
    confirmMessages: "",
    companyLabels: companyLabels,
    pageFooterLabels: pageFooterLabels,
    communityLabels: communityLabels,
    companyInfoLabels: companyInfoLabels,
    initLevelOne: {
      ydPageParentId: null,
      ydPageArea: officialPageLinkAreaEnum.m,
      bannerId: null,
      name: "",
      seq: "",
      link: "",
      hoverLink: "",
      cmDeptId: null,
      address: null,
      mapLink: null,
      serviceLine: null,
      serviceMail: null,
      socialLink: null,
      iconReq: null,
      level: 1,
      type: officialPageHeaderLinkEnum.u,
      levelTwo: [],
      childExpand: true,
      fileInput: {
        imageFile: [],
        imageStock: "",
        imageType: "stock"
      }
    },
    initLevelTwo: {
      ydPageParentId: null,
      ydPageArea: officialPageLinkAreaEnum.m,
      bannerId: null,
      name: "",
      seq: "",
      link: "",
      hoverLink: "",
      cmDeptId: null,
      address: null,
      mapLink: null,
      serviceLine: null,
      serviceMail: null,
      socialLink: null,
      iconReq: null,
      level: 2,
      type: officialPageHeaderLinkEnum.u,
      levelThr: [],
      childExpand: true
    },
    initLevelThr: {
      ydPageParentId: null,
      ydPageArea: officialPageLinkAreaEnum.m,
      bannerId: null,
      name: "",
      seq: "",
      link: "",
      type: "A",
      hoverLink: "",
      cmDeptId: null,
      address: null,
      mapLink: null,
      serviceLine: null,
      serviceMail: null,
      socialLink: null,
      iconReq: null,
      level: 3,
      type: officialPageHeaderLinkEnum.u
    },
    levelOne: [
      {
        ydPageArea: officialPageLinkAreaEnum.m,
        cmDeptId: null,
        address: null,
        mapLink: null,
        serviceLine: null,
        serviceMail: null,
        socialLink: null,
        iconReq: null,
        level: 1,
        name: "",
        seq: "",
        link: "",
        hoverLink: "",
        type: officialPageHeaderLinkEnum.u,
        levelTwo: [],
        childExpand: true,
        fileInput: {
          imageFile: [],
          imageStock: "",
          imageType: "stock"
        }
      }
    ],
    companyList: [],
    pageFooterList: [],
    communityList: [],
    companyInfo: {
      ydPageArea: officialPageLinkAreaEnum.c,
      seq: 0,
      cmDeptId: null,
      level: 1,
      isDelete: caseEnum.n,
      ydPageInfoDTOMap: null,
      address: "",
      mapLink: "",
      serviceLine: "",
      serviceMail: "",
      socialLink: "",
      iconReq: null
    },
    valid: true,
    disabled: false,
    form: {
      onTime: "",
      offTime: "",
      // onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      // offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date()),
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      isDelete: caseEnum.n,
      originalState: "",
      ydPageInfoDTOMap: null,
      stypeList: [],
      gtypeList: [],
      utypeList: [],
      ctypeList: [],
      mtypeList: []
    },

    stockItems: [],
    bigCoverageList: []
  }),
  computed: {
    currentPageAuth() {
      return this.$store.state.currentPageAuth;
    },
    currentCaseStatusText() {
      return currentCaseStatusEnum(this.currentStatus, this.form.isDelete);
    }
  },
  methods: {
    collapse() {
      this.collapseBln = !this.collapseBln;
      this.levelOne.map(ele => {
        ele.childExpand = this.collapseBln;
        ele.levelTwo.map(sub => (sub.childExpand = this.collapseBln));
        return ele;
      });
    },
    preview() {
      window.open(previewUrl.index + "/?preview=true", "_blank");
    },
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_page_info",
        params: { uid: "", message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        await this.getData();
        await this.editData();
      }
    },
    async auditSuccess() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_page_info",
        params: {
          uid: "",
          onTime: this.form.onTime,
          offTime: this.form.offTime
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        await this.getData();
        await this.editData();
      }
    },
    handleAddLevelOne() {
      if (this.levelOne.length < 9) {
        const newObj = JSON.parse(JSON.stringify(this.initLevelOne));
        this.levelOne.push(newObj);
      } else {
        this.$store.dispatch("alert", "最多可以有9個一階");
      }
    },
    handleRmLevelOne(index) {
      if (this.levelOne.length === 1) {
        this.$store.dispatch("alert", "無法刪除");
      } else {
        const newObj = JSON.parse(JSON.stringify(this.levelOne));
        newObj.splice(index, 1);
        this.levelOne = newObj;
      }
    },
    handleAddLevelTwo(index) {
      if (this.levelOne[index].levelTwo.length < 6) {
        const newObj = JSON.parse(JSON.stringify(this.initLevelTwo));
        this.levelOne[index].levelTwo.push(newObj);
      } else {
        this.$store.dispatch("alert", "最多可以有6個二階");
      }
    },
    handleRmLevelTwo(levelOneIndex, index) {
      const newObj = JSON.parse(
        JSON.stringify(this.levelOne[levelOneIndex].levelTwo)
      );
      newObj.splice(index, 1);
      this.levelOne[levelOneIndex].levelTwo = newObj;
    },
    handleAddLevelThr(level1Index, level2Index) {
      const level3 = this.levelOne[level1Index].levelTwo[level2Index].levelThr;
      if (level3.length < 13) {
        const newObj = JSON.parse(JSON.stringify(this.initLevelThr));
        this.levelOne[level1Index].levelTwo[level2Index].levelThr.push(newObj);
      } else {
        this.$store.dispatch("alert", "最多可以有12個三階");
      }
    },
    handleRmLevelThr(levelOneIndex, levelTwoIndex, index) {
      const newObj = JSON.parse(
        JSON.stringify(
          this.levelOne[levelOneIndex].levelTwo[levelTwoIndex].levelThr
        )
      );
      newObj.splice(index, 1);
      this.levelOne[levelOneIndex].levelTwo[levelTwoIndex].levelThr = newObj;
    },
    async checkSave(status) {
      let checkFile = [];
      let submit = {
        ydPageArea: "",
        seq: 0,
        hoverImage: null,
        hoverLink: null,
        link: "",
        cmDeptId: null,
        address: null,
        mapLink: null,
        serviceLine: null,
        serviceMail: null,
        socialLink: null,
        iconReq: null,
        level: 1,
        isDelete: caseEnum.n,
        ydPageInfoDTOMap: null
      };
      try {
        if (!this.valid) {
          this.$refs.form.validate();
          throw "請檢查*為必填欄位";
        }

        let mtypeList = [];
        for (const ele of this.levelOne) {
          const image = await Util.imageCheck(
            checkFile,
            ele,
            "imageType",
            "imageFile",
            "imageStock"
          );
          if (!image) {
            throw "活動行銷圖需為圖檔";
          } else {
            const e = JSON.parse(JSON.stringify(ele));
            e.hoverReq = image;
            delete e.fileInput;
            e.pageDTOList = e.levelTwo.map(two => {
              two.pageDTOList = two.levelThr.map(thr => thr);
              delete two.levelThr;
              return two;
            });
            delete e.levelTwo;
            mtypeList.push(e);
          }
        }

        // 集團成員
        const gtypeList = this.companyList.map(ele => {
          let g = JSON.parse(JSON.stringify(submit));
          const gtype = Object.assign({}, g, ele);
          gtype.ydPageArea = officialPageLinkAreaEnum.g;
          return gtype;
        });

        // 連結設定
        const stypeList = this.pageFooterList.map(ele => {
          let s = JSON.parse(JSON.stringify(submit));
          const stype = Object.assign({}, s, ele);
          stype.ydPageArea = officialPageLinkAreaEnum.s;
          return stype;
        });

        // 社群連結
        let utypeList = [];
        for (const ele of this.communityList) {
          const image = await Util.imageProcess(
            checkFile,
            ele,
            "imageType",
            "imageFile",
            "imageStock"
          );
          if (!image) {
            throw "社群連結需為圖檔";
          } else {
            let u = JSON.parse(JSON.stringify(submit));
            u.link = ele.link;
            u.ydPageArea = officialPageLinkAreaEnum.u;
            u.iconReq = {
              fileName: image.fileName,
              contents: image.contents
            };
            utypeList.push(u);
          }
        }

        // 總公司
        let c = JSON.parse(JSON.stringify(submit));
        const ctypeList = [Object.assign({}, c, this.companyInfo)];

        this.form.status = status;

        this.form.ctypeList = ctypeList;
        this.form.stypeList = stypeList;
        this.form.utypeList = utypeList;
        this.form.gtypeList = gtypeList;
        this.form.mtypeList = mtypeList;

        if (checkFile.length === 0) {
          this.save();
        } else {
          const res = await this.$store.dispatch("getCheckFileName", {
            fileNameList: checkFile
          });

          if (res !== null && res !== undefined) {
            if (res._embedded.resourcesTemps.length !== 0) {
              res._embedded.resourcesTemps.forEach((ele, index) => {
                if (
                  this.confirmMessages !== "" &&
                  res._embedded.resourcesTemps.length > index
                ) {
                  this.confirmMessages = this.confirmMessages + ",";
                }
                this.confirmMessages = this.confirmMessages + ele.fileName;
              });
              this.$refs.confirmDialog.toggle(true);
            } else {
              this.save();
            }
          }
        }
      } catch (e) {
        this.$store.dispatch("alert", e);
        return;
      }
    },
    save() {
      window.setTimeout(async () => {
        const res = await this.$store.dispatch("actionApi", {
          method: "post",
          url: "api_page_info",
          params: this.form
        });
        if (res !== null && res !== undefined) {
          if (this.form.status === caseEnum.d) {
            this.$store.dispatch("alert", "儲存成功");
          } else {
            this.$store.dispatch("alert", "送出成功");
          }
          await this.getData();
          await this.editData();
        }
      }, 500);
    },
    editData() {
      if (this.dataSource !== null && this.dataSource !== undefined) {
        this.form.originalState = JSON.stringify(this.dataSource);
        let clone = JSON.parse(JSON.stringify(this.dataSource));
        this.form.status = clone.status;
        this.form.isDelete = clone.isDelete;
        this.form.docReview = Util.isBlank(clone.docReview)
          ? caseEnum.docReview_n
          : clone.docReview;
        this.form.docReviewNo = Util.isEmpty(clone.docReviewNo)
          ? ""
          : clone.docReviewNo;
        this.currentStatus = clone.status;
        if (clone.status === caseEnum.r || clone.status === caseEnum.a) {
          this.disabled = true;
        } else if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }

        // header link
        this.levelOne = clone.mtypeList.map(ele => {
          let newOneObj = JSON.parse(JSON.stringify(this.initLevelOne));
          let one = Object.assign({}, newOneObj, ele);
          one.fileInput.imageStock = ele.hoverReq.fileName;

          if (ele.pageDTOList && ele.pageDTOList.length !== 0) {
            one.levelTwo = ele.pageDTOList.map(w => {
              let newTwoObj = JSON.parse(JSON.stringify(this.initLevelTwo));
              let two = Object.assign({}, newTwoObj, w);
              if (w.pageDTOList && w.pageDTOList.length !== 0) {
                two.levelThr = w.pageDTOList.map(t => {
                  let newThrObj = JSON.parse(JSON.stringify(this.initLevelThr));
                  let thr = Object.assign({}, newThrObj, t);
                  return thr;
                });
              }
              return two;
            });
          }
          return one;
        });

        // 集團成員
        this.companyList = [];
        this.companyList = clone.gtypeList;
        // 連結設定
        this.pageFooterList = [];
        this.pageFooterList = clone.stypeList;
        // 社群連結
        this.communityList = [];
        if (clone.utypeList.length !== 0) {
          this.communityList = clone.utypeList.map(ele => {
            ele.fileInput = {
              imageFile: [],
              imageStock: ele.iconReq.fileName,
              imageType: "stock"
            };
            return ele;
          });
        }
        // 總公司
        if (clone.ctypeList.length !== 0) {
          this.companyInfo = clone.ctypeList[0];
        }
      }
    },
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItems = data;
    },
    async getBigCoverage() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_bigCoverage_rest"
      });
      if (res !== null && res !== undefined) {
        this.bigCoverageList = [];
        this.bigCoverageList = res._embedded.aboutBigCoverages;
      }
    },
    async getData() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_page_info"
      });
      this.dataSource = null;
      if (res !== null && res !== undefined) {
        this.dataSource = res;
      }
    }
  },
  async created() {
    // await this.getResource();
    // await this.getBigCoverage();
  },
  async mounted() {
    // await this.getData();
    // await this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};

//集團成員
const companyLabels = [
  {
    text: "成員名稱*",
    type: "text",
    value: "name",
    valid: ["required"]
  },
  {
    text: "成員網站連結*",
    type: "text",
    value: "link",
    valid: ["required"]
  },
  {
    text: "順序",
    type: "number",
    value: "seq"
  }
];

// 頁尾連結
const pageFooterLabels = [
  {
    text: "連結文字*",
    type: "text",
    value: "name",
    valid: ["required"]
  },
  {
    text: " 連結位址*",
    type: "text",
    value: "link",
    valid: ["required"]
  },
  {
    text: "連結順序",
    type: "number",
    value: "seq"
  }
];

// 社群連結
const communityLabels = [
  {
    text: "ICON*",
    type: "fileInput",
    value: "imageFile",
    value_stock: "imageStock",
    option: "imageType",
    valid: ["required"]
  },

  {
    text: " 連結*",
    type: "text",
    value: "link",
    valid: ["required"]
  }
];

// 總公司資訊
const companyInfoLabels = [
  {
    text: "總公司地址",
    type: "text",
    value: "address",
    lg: "10"
  },
  {
    text: "Google map 連結",
    type: "text",
    value: "mapLink",
    lg: "10"
  },
  {
    text: "客戶服務專線",
    type: "text",
    value: "serviceLine",
    lg: "10"
  },
  {
    text: "客戶服務信箱",
    type: "text",
    value: "serviceMail",
    lg: "10"
  },
  {
    text: "社群服務帳號連結",
    type: "text",
    value: "socialLink",
    lg: "10"
  }
];
</script>

<style lang="scss" scoped>
.officialPage {
  width: 100%;
}
</style>


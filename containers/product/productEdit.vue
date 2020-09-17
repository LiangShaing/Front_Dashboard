<template>
  <div id="productEdit">
     <v-card-title class="font-weight-black pb-0 ml-2">
      <v-icon>edit</v-icon>
      {{pageTitle}}
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-col cols="12" class="d-lg-flex d-md-flex pa-0 ma-0">
          <v-col sm="12" md="6" lg="6" class="pa-0 ma-0">
            <form-option title="險別*" titleClass="ma-2 ml-0">
              <v-select
                :items="contracts"
                v-model="form.bigCoverageUid"
                item-text="title"
                item-value="uid"
                label="險別"
                outlined
                dense
                :disabled="disabled"
                :rules="requiredRules"
              ></v-select>
            </form-option>

            <form-option title="商品名稱*" titleClass="ma-2 ml-0">
              <v-text-field
                outlined
                dense
                type="text"
                v-model="text"
                :disabled="disabled"
                :rules="requiredRules"
              ></v-text-field>
            </form-option>

            <form-option title="承保年齡" titleClass="ma-2 ml-0">
              <div class="d-flex">
                <div style="width:50px">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    v-model="coverageAgeStartText"
                    hide-details
                    class="pa-0"
                    :disabled="disabled"
                  ></v-text-field>
                </div>
                <div class="ma-2">歲~</div>
                <div style="width:50px">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    v-model="coverageAgeEndText"
                    hide-details
                    class="pa-0"
                    :disabled="disabled"
                  ></v-text-field>
                </div>
                <div class="ma-2">歲</div>
                <div style="width:100px">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    v-model="coverageAgeTagText"
                    hide-details
                    class="pa-0"
                    :disabled="disabled"
                  ></v-text-field>
                </div>
              </div>
            </form-option>

            <form-option title="主約/副約*" titleClass="ma-2 ml-0">
              <v-select
                :items="main"
                v-model="form.isMain"
                item-text="text"
                item-value="value"
                label="險別"
                outlined
                dense
                :disabled="disabled"
                :rules="requiredRules"
              ></v-select>
            </form-option>

            <form-option
              title="是否在審閱期專區顯示"
              titleClass="ma-2 ml-0"
              titleWidth="50%"
              contentWidth="50%"
            >
              <v-radio-group
                v-model="form.isReviewPeriodShow"
                :mandatory="false"
                row
                :disabled="disabled"
              >
                <v-radio value="Y" label="是"></v-radio>
                <v-radio value="N" label="否"></v-radio>
              </v-radio-group>
            </form-option>

            <template v-for="(a,index) in featureShow">
              <form-option
                :key="index"
                :title="'是否在'+a.title+'顯示'"
                titleClass="ma-2 ml-0"
                titleWidth="50%"
                contentWidth="50%"
              >
                <v-radio-group v-model="a.show" :mandatory="false" row :disabled="disabled">
                  <v-radio value="Y" label="是"></v-radio>
                  <v-radio value="N" label="否"></v-radio>
                </v-radio-group>
              </form-option>
            </template>
          </v-col>

          <v-col sm="12" md="6" lg="6" class="pa-0 ma-0">
            <form-option title="商品編號*" titleClass="ma-2 ml-0">
              <v-text-field
                outlined
                dense
                type="text"
                v-model="form.code"
                :disabled="disabled"
                :rules="requiredRules"
              ></v-text-field>
            </form-option>

            <form-option title="商品年期*" rowHeight="auto" titleClass="ma-2 ml-0">
              <v-radio-group v-model="annualType" :mandatory="false" :disabled="disabled">
                <v-radio value="D" label="年期輸入"></v-radio>
                <v-radio value="T" label="文字輸入"></v-radio>

                <div v-if="annualType==='T'">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    v-model="form.annual"
                    :disabled="disabled"
                    :rules="requiredRules"
                  ></v-text-field>
                </div>

                <div v-if="annualType==='D'" class="d-flex">
                  <template v-for="(a,index) in annualList">
                    <div :key="index" style="width:50px">
                      <v-text-field
                        outlined
                        dense
                        type="text"
                        v-model="annualList[index]"
                        hide-details
                        class="pa-0"
                        :disabled="disabled"
                        :rules="requiredRules"
                      ></v-text-field>
                    </div>
                    <div v-if="index < (annualList.length-1)" :key="index+'-'" class="ma-2 ml-0">/</div>
                  </template>
                  <div class="ma-2">年期</div>

                  <v-btn dark color="green" small icon class="mt-1" @click="addAnnual">
                    <v-icon>add</v-icon>
                  </v-btn>

                  <v-btn dark color="error" small icon class="mt-1" @click="deleteAnnual">
                    <v-icon>close</v-icon>
                  </v-btn>
                </div>
              </v-radio-group>
            </form-option>

            <form-option title="幣別*" titleClass="ma-2 ml-0">
              <v-select
                :items="currency"
                v-model="form.currencyUid"
                item-text="title"
                item-value="uid"
                label="幣別"
                outlined
                dense
                :disabled="disabled"
                :rules="requiredRules"
              ></v-select>
            </form-option>

            <form-option title="備查函號*" rowHeight="auto" titleClass="ma-2 ml-0">
              <v-textarea
                outlined
                label
                v-model="form.contents"
                :disabled="disabled"
                :rules="requiredRules"
              ></v-textarea>
            </form-option>

            <form-option title="排序*" titleClass="ma-2 ml-0">
              <v-text-field
                outlined
                dense
                type="number"
                placeholder
                v-model="form.sort"
                required
                :disabled="disabled"
                :rules="requiredRules"
                min="0"
                :messages="['目前最大排序：'+maxSort]"
              ></v-text-field>
            </form-option>
          </v-col>
        </v-col>

        <form-generate
          :labels="productFeatureLabels"
          :dataSourceList="aboutContractInfoReqSet"
          enAction
          :disabled="disabled"
          addBtnText="新增商品特色"
          @validate="handleSortResetValidate"
        ></form-generate>

        <form-generate
          :labels="fileInputLabels"
          :dataSourceList="[file]"
          :disabled="disabled"
          :stockItems="stockItems"
        ></form-generate>
        <!-- V2 -->
        <!-- <form-option title="商品分類" titleClass="ma-2 ml-0">
          <v-select
            v-model="form.tagsDTOList"
            :items="contractTagItems"
            item-text="name"
            item-value="uid"
            multiple
            outlined
            dense
            return-object
            :disabled="disabled"
          ></v-select>
        </form-option>

        <v-divider :inset="false" class="ma-5"></v-divider>

        <v-card-title>給付說明</v-card-title>

        <template v-for="(data,index) in contractTermList">
          <panel-function
            :key="index+'_term'"
            :hideHeader="false"
            :enExpand="true"
            :expand="data.show"
            @remove="handleRemove(index)"
            :enAction="true"
            @childExpand="()=>handleChildExpand(index)"
            :disabled="disabled"
          >
            <form-option title="給付說明類別" titleClass="ma-0 mb-2">
              <v-select
                :items="contractTermItems"
                item-text="title"
                item-value="uid"
                outlined
                dense
                v-model="data.contractTermUid"
                :disabled="disabled"
                :rules="requiredRules"
              ></v-select>
            </form-option>
            <div v-show="data.show">
              <form-option title="標題*" titleClass="ma-0 mb-2">
                <v-text-field
                  outlined
                  dense
                  type="text"
                  v-model="data.title"
                  :disabled="disabled"
                  :rules="requiredRules"
                ></v-text-field>
              </form-option>

              <form-option title="內文" rowHeight="auto">
                <document-editor
                  v-if="!disabled"
                  @getData="(data)=>handleGetEditor2Data(index,data)"
                  :contents="JSON.parse(JSON.stringify(data.contents))"
                ></document-editor>
                <v-textarea v-else outlined label :value="data.contents" :disabled="disabled"></v-textarea>
              </form-option>

              <form-generate
                :labels="contractTermPdfLabels"
                :dataSourceList="[data]"
                :disabled="disabled"
                :stockItems="stockItemsGeneral"
              ></form-generate>

              <form-generate
                :labels="explanationLabels"
                :dataSourceList="data.explanationDTOSet"
                :disabled="disabled"
                enAction
                addBtnText="新增給付說明子項"
              ></form-generate>
            </div>
          </panel-function>
        </template>

        <v-btn class="ma-2" outlined color="green" @click="handleAdd" :disabled="disabled">
          <v-icon>playlist_add</v-icon>新增給付說明
        </v-btn>

        <v-divider :inset="false" class="ma-5"></v-divider>

        <v-card-title>投保規則</v-card-title>

        <form-generate
          :labels="rulesLabels"
          :dataSourceList="form.ruleDTOSet"
          :disabled="disabled"
          enAction
          addBtnText="新增投保規則"
        ></form-generate>-->

        <v-divider :inset="false" class="ma-5"></v-divider>

        <v-col class="pa-0 ma-0" cols="12">
          <date-picker
            flex
            @getDate="handleGetDate"
            startLabelText="預設上架時間"
            endLabelText="預設下架時間"
            enableTime
            :defaultStartDate="date.startDate"
            :defaultEndDate="date.endDate"
            :defaultStartTimeH="date.startHour"
            :defaultStartTimeM="date.startMin"
            :defaultEndTimeH="date.endHour"
            :defaultEndTimeM="date.endMin"
            :disabled="((form.status===caseEnum.d || form.status===caseEnum.p)  && !isE && !isR) || (form.status===caseEnum.r && (!isR)) || (form.status===caseEnum.a && (!isA))"
            titleWidth="30%"
            contentWidth="70%"
          ></date-picker>

          <doc-review
            :form="form"
            :disabled="disabled || currentStatus===caseEnum.r || currentStatus===caseEnum.a"
          ></doc-review>
        </v-col>
        <action-btn
          :caseAction="action"
          :currentCaseStatus="currentStatus"
          :currentPageAuth="currentPageAuth"
          :currentCaseIsDelete="currentIsDelete"
          :valid="valid"
          @back="back"
          @preview="preview"
          @checkSave="checkSave"
          @auditSuccess="auditSuccess"
          @inputRejectMessage="inputRejectMessage"
        ></action-btn>
      </v-form>
    </v-card-text>

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
</template>

<script>
import dateUtil from "@/util/dateUtil";
import Util from "@/util";
import { caseEnum } from "@/api/enum";
import previewUrl from "@/api/previewUrl";

export default {
  props: {
    pageTitle: {
      type: String,
      default: ""
    },
    contracts: {
      type: Array,
      default: []
    },
    dataSource: {
      type: Object,
      default: {}
    },
    featureShow: {
      type: Array,
      default: []
    },
    currentPageAuth: {
      type: Array,
      default: []
    },
    text:{
      type: String,
      default: ""
    },
  },
  data: () => ({
    maxSort: 0,
    requiredRules: [v => !!v || "↑不能為空"],
    fileInputLabels: fileInputLabels,
    productFeatureLabels: productFeatureLabels,
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    //當前案件狀態
    currentStatus: caseEnum.d,
    currentIsDelete: caseEnum.n,

    //商品特色
    aboutContractInfoReqSet: [],
    // 檔案
    file: {
      fileInput: {
        productResources: [],
        productType: "upload",
        productStock: "",
        clauseResources: [],
        clauseType: "upload",
        clauseStock: "",
        instructionsResources: [],
        instructionsType: "upload",
        instructionsStock: ""
      }
    },
    // 審閱者關閉編輯
    disabled: false,
    // 年期 1/10/20 輸入
    annualList: [""],
    // 年期 文字 輸入
    annualText: "",
    // 年期 輸入方式 T:文字 D:Array
    annualType: "T",
    // 承保年齡
    coverageAgeStartText: "",
    coverageAgeEndText: "",
    coverageAgeTagText: "",
    date: {
      startDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      endDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
      startHour: "00",
      startMin: "00",
      endHour: "23",
      endMin: "59"
    },
    form: {
      status: caseEnum.d,
      bigCoverageUid: "",
      code: "",
      title: "",
      coverageAge: "",
      isDelete: caseEnum.n,
      isMain: "",
      annual: "",
      currencyUid: "",
      contents: "",
      sort: "",
      isReviewPeriodShow: caseEnum.n,
      aboutFeatureReqSet: [],
      aboutContractInfoReqSet: [],
      productResources: { fileName: "", contents: "" },
      clauseResources: { fileName: "", contents: "" },
      instructionsResources: { fileName: "", contents: "" },
      onTime: dateUtil.formatDateFun("yyyy-MM-dd 00:00:00", new Date()),
      offTime: dateUtil.formatDateFun("yyyy-MM-dd 23:59:00", new Date()),
      docReview: caseEnum.docReview_n,
      docReviewNo: null,
      termInfoDTOSet: [],
      ruleDTOSet: [],
      tagsDTOList: [],
      // 原始資料 異動紀錄用
      originalState: ""
    },
    main: [
      { value: caseEnum.main, text: "主約" },
      { value: caseEnum.attach, text: "附約" }
    ],
    currency: [],
    valid: true,
    // 檔案庫存
    stockItems: [],
    stockItemsGeneral: [],
    // 當前操作頁面狀態
    action: "add",
    // 退件原因
    rejectMessages: "",
    // 給付說明
    contractTermPdfLabels: contractTermPdfLabels,
    explanationLabels: explanationLabels,
    contractTermItems: [],
    contractTermList: [
      {
        contractTermUid: "",
        title: "",
        contents: "",
        isDelete: caseEnum.n,
        fileInput: {
          pdfFile: [],
          pdfStock: "",
          pdfType: "upload"
        },
        explanationDTOSet: [],
        show: true
      }
    ],

    // 投保規則
    rulesLabels: rulesLabels,
    // 商品分類
    contractTagItems: []
  }),
  computed: {
    isE() {
      return this.currentPageAuth.indexOf(caseEnum.e) !== -1;
    },
    isR() {
      return this.currentPageAuth.indexOf(caseEnum.r) !== -1;
    },
    isA() {
      return this.currentPageAuth.indexOf(caseEnum.a) !== -1;
    }
  },
  methods: {
    handleChildExpand(index) {
      this.contractTermList[index].show = !this.contractTermList[index].show;
    },
    handleRemove(index) {
      this.contractTermList.splice(index, 1);
    },
    handleAdd() {
      const obj = {
        contractTermUid: "",
        title: "",
        contents: "",
        isDelete: caseEnum.n,
        fileInput: {
          pdfFile: [],
          pdfStock: "",
          pdfType: "upload"
        },
        explanationDTOSet: [],
        show: true
      };
      this.contractTermList.push(obj);
    },
    handleGetEditor2Data(index, data) {
      this.contractTermList[index].contents = data;
    },
    handleSortResetValidate() {
      this.$refs.form.validate();
    },
    preview() {
      window.open(
        previewUrl.product + "/" + this.form.bigCoverageUid + "/?preview=true",
        "_blank"
      );
    },
    coverageAgeText(coverageAge) {
      let str = coverageAge;
      const arr = str.split(" ");
      if (arr.length > 1) {
        this.coverageAgeTagText = arr[1];
      }
      const arr2 = arr[0].split("~");
      if (arr2.length > 1) {
        this.coverageAgeEndText = arr2[1].split("歲")[0];
      }
      this.coverageAgeStartText = arr2[0].split("歲")[0];
    },
    async auditSuccess() {
      const res = await this.$store.dispatch("actionApi", {
        method: "put",
        url: "api_contract",
        params: {
          uid: this.form.uid,
          onTime: this.form.onTime,
          offTime: this.form.offTime
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "審核成功");
        this.$emit("complete");
      }
    },
    async getCurrency() {
      const res = await this.$store.dispatch("getCurrency", {
        params: { isDelete: caseEnum.n }
      });
      this.currency = res;
    },
    async checkSave(status) {
      this.confirmMessages = "";
      try {
        if (!this.valid) {
          this.$refs.form.validate();
          throw "請檢查欄位";
        }

        // 承保年齡
        let str = "";
        if (this.coverageAgeStartText !== "") {
          str = str + this.coverageAgeStartText + "歲";
        }
        if (this.coverageAgeEndText !== "") {
          if (str !== "") {
            str = str + "~";
          }
          str = str + this.coverageAgeEndText + "歲";
        }

        if (this.coverageAgeTagText !== "") {
          str = str + " " + this.coverageAgeTagText;
        }
        this.form.coverageAge = str;

        //商品年期
        if (this.annualType === "D") {
          let str = "";
          this.annualList.forEach((s, index) => {
            if (str !== "" && this.annualList.length > index) {
              str = str + "/";
            }
            str = str + s;
          });
          this.form.annual = str;
        }

        if (this.form.annual === "") {
          throw "年期為必填欄位";
        }

        // 商品特色
        this.aboutContractInfoReqSet.forEach(ele => {
          ele.isDelete = "N";
        });
        this.form.aboutContractInfoReqSet = this.aboutContractInfoReqSet;

        // 檔案
        let checkFile = [];

        const file = this.file.fileInput;

        // 商品DM
        const product = await Util.reservationFileCheck(
          checkFile,
          this.file,
          "productType",
          "productResources",
          "productStock",
          this.stockItems
        );

        if (!product) {
          throw "商品DM : 上傳檔案不能為空";
        }
        this.form.productResources = product;

        // 條款樣張
        const clause = await Util.reservationFileCheck(
          checkFile,
          this.file,
          "clauseType",
          "clauseResources",
          "clauseStock",
          this.stockItems
        );
        if (!clause) {
          throw "條款樣張 : 上傳檔案不能為空";
        }
        this.form.clauseResources = clause;

        //  商品說明書
        const instructions = await Util.reservationFileCheck(
          checkFile,
          this.file,
          "instructionsType",
          "instructionsResources",
          "instructionsStock",
          this.stockItems
        );
        if (!instructions) {
          throw "商品說明書 : 上傳檔案不能為空";
        }
        this.form.instructionsResources = instructions;

        // 檢查相同檔名
        let validName = [
          product.fileName,
          clause.fileName,
          instructions.fileName
        ];
        let error = false;
        validName.forEach(function(value, index) {
          validName.forEach(function(val, i) {
            if (index !== i && value !== "" && val !== "" && value === val) {
              error = true;
            }
          });
        });
        if (error) {
          throw "上傳檔名重複，請確認";
        }

        // 是否在特色專區顯示
        this.form.aboutFeatureReqSet = [];
        this.featureShow.forEach(ele => {
          if (ele.show === "Y") {
            this.form.aboutFeatureReqSet.push({ uid: ele.uid });
          }
        });

        // 一般檔案
        let checkFileGeneral = [];
        // 給付說明
        this.form.termInfoDTOSet = [];
        for (const ele of this.contractTermList) {
          const pdf = await Util.pdfCheck(
            checkFileGeneral,
            ele,
            "pdfType",
            "pdfFile",
            "pdfStock"
          );
          if (!pdf) {
            throw "給付說明 : 上傳檔案不能為空並且需為PDF";
          }
          this.form.termInfoDTOSet.push({
            contractTermUid: ele.contractTermUid,
            title: ele.title,
            contents: ele.contents,
            isDelete: caseEnum.n,
            imageReq: null,
            pdfReq: pdf,
            explanationDTOSet: ele.explanationDTOSet.map(ele => {
              ele.isDelete = caseEnum.n;
              return ele;
            })
          });
        }

        // 投保規則
        this.form.ruleDTOSet.map(ele => {
          ele.isDelete = caseEnum.n;
          return ele;
        });

        if (this.form.uid === "") {
          delete this.form.uid;
        }

        this.form.status = status;
        this.form.isDelete = this.caseEnum.n;

        if (checkFile.length === 0 && checkFileGeneral.length === 0) {
          this.save();
        } else {
          //預約檔案
          if (checkFile.length !== 0) {
            const res = await this.$store.dispatch(
              "getCheckReservaionFileName",
              {
                fileNameList: checkFile,
                onTime: this.form.onTime
              }
            );

            if (res !== null && res !== undefined) {
              res.forEach((ele, index) => {
                if (this.confirmMessages !== "" && res.length > index) {
                  this.confirmMessages = this.confirmMessages + ",";
                }
                this.confirmMessages = this.confirmMessages + ele.fileName;
              });
            }
          }

          // 一般檔案
          if (checkFileGeneral.length !== 0) {
            const res2 = await this.$store.dispatch("getCheckFileName", {
              fileNameList: checkFileGeneral
            });
            if (
              res2 !== null &&
              res2 !== undefined &&
              res2._embedded.resourcesTemps.length !== 0
            ) {
              res2._embedded.resourcesTemps.forEach((ele, index) => {
                if (
                  this.confirmMessages !== "" &&
                  res2._embedded.resourcesTemps.length > index
                ) {
                  this.confirmMessages = this.confirmMessages + ",";
                }
                this.confirmMessages = this.confirmMessages + ele.fileName;
              });
            }
          }

          if (this.confirmMessages !== "") {
            this.$refs.confirmDialog.toggle(true);
          } else {
            this.save();
          }
        }
      } catch (e) {
        this.$store.dispatch("alert", e);
      }
    },
    async save() {
      window.setTimeout(async () => {
        const res = await this.$store.dispatch("actionApi", {
          method: "post",
          url: "api_contract",
          params: this.form
        });
        if (res !== null && res !== undefined) {
          if (this.form.status === caseEnum.d) {
            this.$store.dispatch("alert", "儲存成功");
            this.$emit("complete");
          } else {
            this.$store.dispatch("alert", "送出成功");
            this.$emit("complete");
          }
        }
      }, 1000);
    },
    async getReservationResource() {
      const data = await this.$store.dispatch("getReservationResource");
      this.stockItems = data;
    },
    handleGetDate(data) {
      this.form.onTime =
        data.startDate === null || data.startDate === ""
          ? null
          : data.startDate + " " + data.startTime;
      this.form.offTime =
        data.endDate === null || data.endDate === ""
          ? null
          : data.endDate + " " + data.endTime;
    },
    back() {
      this.$emit("back");
    },
    inputRejectMessage() {
      this.$refs.rejectDialog.toggle(true);
    },
    async reject() {
      this.$refs.rejectDialog.toggle(false);
      const res = await this.$store.dispatch("actionApi", {
        method: "delete",
        url: "api_contract",
        params: { uid: this.form.uid, message: this.rejectMessages }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "退件成功");
        this.$emit("complete");
      }
    },
    addAnnual() {
      this.annualList.push("");
    },
    deleteAnnual() {
      if (this.annualList.length > 1) {
        const last = this.annualList.length - 1;
        this.annualList.splice(last, 1);
      }
    },
    async getMaxSort(uid) {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract_temp_rest_getMaxSort",
        params: { uid: uid }
      });
      if (res !== null && res !== undefined) {
        this.maxSort = res;
      }
    },
    async getContractTerm() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract_term_temp_rest_findByIsDelete",
        params: { isDelete: caseEnum.n }
      });
      this.contractTermItems = [];
      if (res !== null && res !== undefined) {
        this.contractTermItems = res._embedded.aboutContractTermTemps;
      }
    },
    async getContractTags() {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_contract_tags_rest_findByIsDelete",
        params: { isDelete: caseEnum.n }
      });
      this.contractTagItems = [];
      if (res !== null && res !== undefined) {
        this.contractTagItems = res._embedded.aboutContractTagsTemps;
      }
    },
    async getResource() {
      const data = await this.$store.dispatch("getResource");
      this.stockItemsGeneral = data;
    },
    async editData() {
      if (this.dataSource !== null && this.dataSource !== undefined) {
        this.action = "edit";
        let clone = JSON.parse(JSON.stringify(this.dataSource));
        this.form.uid = clone.uid;
        this.form.bigCoverageUid = clone.bigCoverageUid;
        await this.getMaxSort(clone.bigCoverageUid);
        this.form.code = clone.code;
        this.form.title = clone.title;
        this.coverageAgeText(clone.coverageAge);
        this.form.isMain = clone.isMain;
        this.form.isReviewPeriodShow = clone.isReviewPeriodShow;
        this.form.status = clone.status;
        this.form.isDelete = clone.isDelete;
        this.currentIsDelete = clone.isDelete;
        this.form.docReview = Util.isBlank(clone.docReview)
          ? caseEnum.docReview_n
          : clone.docReview;
        this.form.docReviewNo = Util.isEmpty(clone.docReviewNo)
          ? ""
          : clone.docReviewNo;
        this.currentStatus = clone.status;
        if (clone.status === caseEnum.r || clone.status === caseEnum.a) {
          this.disabled = true;
        }

        this.form.annual = clone.annual;
        this.annualType = clone.annualType;
        if (clone.annualType === "D") {
          this.annualList = clone.annual.split("/");
        }

        this.featureShow.forEach(ele => {
          clone.aboutFeatureTempSet.forEach(sub => {
            if (ele.uid === sub) {
              ele.show = "Y";
            }
          });
        });

        this.form.sort = clone.sort;
        this.form.currencyUid = clone.currencyUid;
        this.form.contents = clone.contents;

        this.aboutContractInfoReqSet = clone.aboutContractInfoTempSet;

        this.file.fileInput.productStock = clone.productResources.uid;
        this.file.fileInput.productType = Util.fileType(
          clone.productResources.uid
        );
        this.file.fileInput.clauseStock = clone.clauseResources.uid;
        this.file.fileInput.clauseType = Util.fileType(
          clone.clauseResources.uid
        );
        this.file.fileInput.instructionsStock = clone.instructionsResources.uid;
        this.file.fileInput.instructionsType = Util.fileType(
          clone.instructionsResources.uid
        );

        let resources = [
          clone.productResources,
          clone.clauseResources,
          clone.instructionsResources
        ];
        //將stockitem檔案的uid換成data的resource uid沒有就新增
        for (const r of resources) {
          let bln = true;
          this.stockItems.forEach(ele => {
            if (ele.text === r.fileName) {
              bln = false;
              ele.value = r.uid;
            }
          });
          if (bln && r.fileName !== "") {
            this.stockItems.push({ text: r.fileName, value: r.uid });
          }
        }

        this.contractTermList = clone.termInfoDTOSet.map(ele => {
          ele.show = true;
          ele.fileInput = {
            pdfFile: [],
            pdfStock: ele.pdfReq.fileName,
            pdfType: Util.fileType(ele.pdfReq.fileName)
          };
          return ele;
        });
        this.form.ruleDTOSet = clone.ruleDTOSet;
        this.form.tagsDTOList = clone.tagsDTOList;

        dateUtil.combinationDate(this.date, clone);
        this.form.originalState = JSON.stringify(this.dataSource);
      }
    }
  },
  watch: {
    "form.docReview": function(val, oldVal) {
      if (val === caseEnum.docReview_n) {
        this.form.docReviewNo = null;
      }
    }
  },
  async created() {
    await this.getCurrency();
    this.getContractTerm();
    this.getResource();
    this.getContractTags();
  },
  async mounted() {
    await this.getReservationResource();
    await this.editData();
    if (this.currentPageAuth.indexOf(this.caseEnum.a) !== -1) {
      this.disabled = true;
    }
  }
};

// 主圖設定
const fileInputLabels = [
  {
    text: "商品DM",
    type: "fileInput",
    value: "productResources",
    value_stock: "productStock",
    option: "productType"
  },
  {
    text: "條款樣張",
    type: "fileInput",
    value: "clauseResources",
    value_stock: "clauseStock",
    option: "clauseType"
  },
  {
    text: "商品說明書",
    type: "fileInput",
    value: "instructionsResources",
    value_stock: "instructionsStock",
    option: "instructionsType"
  }
];

// 商品特色標題
const productFeatureLabels = [
  {
    text: "商品特色標題*",
    type: "text",
    value: "title",
    valid: ["required"]
  },
  {
    text: "商品特色內容*",
    type: "text",
    value: "contents",
    valid: ["required"]
  },
  {
    text: "排序*",
    type: "number",
    value: "sort",
    valid: ["required", "sort"]
  }
];
// 給付說明-PDF
const contractTermPdfLabels = [
  {
    text: "PDF檔案",
    type: "fileInput",
    value: "pdfFile",
    value_stock: "pdfStock",
    option: "pdfType",
    valid: ["required"]
  }
];
// 給付說明
const explanationLabels = [
  {
    text: "標題*",
    type: "text",
    value: "title",
    valid: ["required"]
  },
  {
    text: "內容*",
    type: "text",
    value: "contents",
    valid: ["required"]
  }
];

// 投保規則
const rulesLabels = [
  {
    text: "標題*",
    type: "text",
    value: "title",
    valid: ["required"]
  },
  {
    text: "內容*",
    type: "editor",
    value: "contents",
    valid: ["required"]
  }
];
</script>

<style lang="css" scoped>
</style>


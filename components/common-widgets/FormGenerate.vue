<!-- 
 components
 @param dataSourceList : data
 @param enAction : 開啟新增刪除功能
 @param optionClass : 自訂義class
 @param disabled : 元件disabled
 @param stockItems : resource data(目前提供檔案的data)
 @param hideHeader : 隱藏展開收合的icon
 @param enExpand : 開啟展開功能
 @param enExpandMainOption : 收合時顯示哪個option
 @param addBtnText : 新增按鈕的文字
 @param limitSize : 新增限制數量
 @param titleBg : form-option title 背景顏色

 label 
 @param: text : title文字
 @param: type : input 型態
 @param: value : 對應 input 值 
 @param: sm
 @param: md
 @param: lg
 @param: titleWidth : title 寬度
 @param: contentWidth : input 寬度
 @param: rowHeight : row 高度
 @param: contentStyle : input 樣式
 -->
<template>
  <div class="formGenerate">
    <template v-for="(data,index) in dataSourceList">
      <panel-function
        :key="index+label"
        :hideHeader="hideHeader"
        :enExpand="enExpand"
        :expand="data.show"
        @remove="handleRemove(index)"
        :enAction="enAction"
        :disabled="disabled"
        @childExpand="handleChildExpand"
        :index="index"
      >
        <v-col cols="12" :class="optionClass" class="ma-0 pa-0">
          <div
            class="mt-2 pt-1"
            :key="index+'_enExpandMainText'"
            v-if="enExpand && enExpandMainOption==='none' && !data.show"
          >{{enExpandMainText}}{{index+1}}</div>
          <template v-for="(label,labelIndex) in labels">
            <v-col
              :key="labelIndex+label"
              class="mt-2 mb-1 pa-0"
              :sm="label.sm"
              :md="label.md"
              :lg="label.lg"
              v-show="enExpand?(enExpandMainOption!==''?(enExpandMainOption===label.value?true:data.show):true):true"
            >
              <!-- 多筆 -->
              <panel-single
                v-if="label.type==='multiple'"
                :label="label.text"
                :dataSourceList="data[label.value]"
                :inputType="label.inputType"
                :enAction="label.enAction"
                :disabled="disabled"
                :stockItems="stockItems"
                :titleBg="titleBg===''?evenColor(index):titleBg"
                :selectFileOnly="label.selectFileOnly?label.selectFileOnly:false"
              ></panel-single>
              <!-- 日期選擇器 -->
              <date-picker
                v-else-if="label.type==='datePicker'"
                @getDate="(data)=>handleGetDate(index,label.startValue,label.endValue,data)"
                :startLabelText="label.startText"
                :endLabelText="label.endText"
                :titleBg="titleBg===''?evenColor(index):titleBg"
                :titleWidth="label.titleWidth"
                :contentWidth="label.contentWidth"
                :rowHeight="label.rowHeight"
                :disabled="disabled"
              ></date-picker>
              <!-- 一般 -->
              <form-option
                v-else
                :title="label.text"
                :titleBg="titleBg===''?evenColor(index):titleBg"
                :titleWidth="label.titleWidth"
                :contentWidth="label.contentWidth"
                :rowHeight="label.type==='editor'||label.type==='fileInput'?'auto':label.rowHeight"
              >
                <v-col cols="12" :style="label.contentStyle" class="ma-0 pa-0 d-flex">
                  <!-- 日期 -->
                  <v-menu
                    v-if="label.type==='date'"
                    ref="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    maxWidth="290px"
                    v-model="menu1"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="data[label.value]"
                        label="請選擇日期"
                        readonly
                        v-on="on"
                        :disabled="disabled"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="data[label.value]"
                      no-title
                      scrollable
                      :allowed-dates="(val)=>allowedDates(label.allowDate,val,data[label.value])"
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                  <!-- 文字輸入 -->
                  <v-text-field
                    v-if="label.type==='text' || label.type==='number'"
                    outlined
                    dense
                    :type="label.type"
                    placeholder
                    v-model="data[label.value]"
                    :disabled="disabled || label.disabled"
                    :rules="bindVaild(label.valid)"
                    @change="(data)=>handleChange(label.type,label.value,data)"
                  ></v-text-field>

                  <!-- 檔案輸入-->
                  <div v-if="label.type==='fileInput'" class="d-flex">
                    <v-radio-group
                      v-model="data.fileInput[label.option]"
                      :mandatory="false"
                      row
                      :disabled="disabled"
                      hide-details
                    >
                      <v-radio value="stock" label="選擇現有檔案"></v-radio>

                      <v-radio value="upload" label="上傳新檔案"></v-radio>
                    </v-radio-group>

                    <div class="fileInput" v-if="data.fileInput[label.option]==='stock'">
                      <v-autocomplete
                        :items="stockItems"
                        item-text="text"
                        item-value="value"
                        label="選擇現有檔案"
                        outlined
                        dense
                        v-model="data.fileInput[label.value_stock]"
                        :disabled="disabled"
                        hide-details
                        :rules="bindVaild(label.valid)"
                        clearable
                      ></v-autocomplete>
                    </div>
                    <div class="fileInput" v-if="data.fileInput[label.option]==='upload'">
                      <v-file-input
                        label="選擇檔案"
                        outlined
                        dense
                        v-model="data.fileInput[label.value]"
                        prepend-icon
                        :disabled="disabled"
                        hide-details
                        :rules="bindVaild(label.valid)"
                      ></v-file-input>
                    </div>
                  </div>
                  <v-file-input
                    v-if="label.type==='file'"
                    label="選擇檔案"
                    outlined
                    dense
                    v-model="data[label.value]"
                    prepend-icon
                    :disabled="disabled"
                    :rules="bindVaild(label.valid)"
                  ></v-file-input>
                  <v-select
                    v-if="label.type==='select'"
                    :items="label.items"
                    :item-text="label.itemsText"
                    :item-value="label.itemsValue"
                    outlined
                    dense
                    v-model="data[label.value]"
                    :disabled="disabled"
                    :rules="bindVaild(label.valid)"
                  ></v-select>
                  <v-select
                    v-if="label.type==='multipleSelect'"
                    v-model="data[label.value]"
                    :items="label.items"
                    :item-text="label.itemsText"
                    :item-value="label.itemsValue"
                    multiple
                    outlined
                    dense
                    :rules="bindVaild(label.valid)"
                  ></v-select>
                  <div v-if="label.type==='editor'" style="width:100%">
                    <v-textarea
                      v-if="disabled"
                      outlined
                      :value="data[label.value]"
                      :disabled="disabled"
                    ></v-textarea>
                    <document-editor
                      v-else
                      @getData="(data)=>handleGetEditorData(index,label.value,data)"
                      :contents="JSON.parse(JSON.stringify(data[label.value]))"
                    ></document-editor>
                  </div>

                  <div v-if="label.type==='textarea'" style="width:100%">
                    <v-textarea outlined v-model="data[label.value]" :disabled="disabled"></v-textarea>
                  </div>

                  <div v-if="label.tips!==undefined" class="ma-2">{{label.tips}}</div>
                </v-col>
              </form-option>
            </v-col>
          </template>
        </v-col>
      </panel-function>
    </template>
    <v-btn
      v-if="enAction"
      class="ma-2"
      outlined
      color="green"
      @click="handleAdd"
      :disabled="disabled"
    >
      <v-icon>playlist_add</v-icon>
      {{addBtnText}}
    </v-btn>
  </div>
</template>

<script>
import Util from "@/util";
export default {
  components: {},
  props: {
    labels: {
      type: Array,
      default: []
    },
    label: {
      type: String,
      default: ""
    },
    dataSourceList: {
      type: Array,
      default: []
    },
    optionClass: {
      type: String,
      default: ""
    },
    enAction: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    stockItems: {
      type: Array,
      default: () => []
    },
    hideHeader: {
      type: Boolean,
      default: true
    },
    enExpand: {
      type: Boolean,
      default: false
    },
    enExpandMainOption: {
      type: String,
      default: ""
    },
    enExpandMainText: {
      type: String,
      default: ""
    },
    addBtnText: {
      type: String,
      default: "新增"
    },
    limitSize: {
      type: Number,
      default: null
    },
    titleBg: {
      type: String,
      default: ""
    },
    enActionDefaultAdd: {
      type: Boolean,
      default: true
    },
    sortRuleParamName: {
      type: String,
      default: "sort"
    }
  },
  data: vm => ({
    menu1: false,
    show: true,
    init: null,
    requiredRules: [v => !!v || "↑不能為空"],
    emailRules: [
      v => !!v || "↑不能為空",
      v => /.+@.+\..+/.test(v) || "E-mail 格式錯誤"
    ],
    rules: {
      required: value => !!value || "↑不能為空.",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "E-mail 格式錯誤";
      },
      isNumber: value => {
        const num = Number(value);
        return Number.isInteger(num) || "必須是數字";
      },
      sort: value => {
        let num = 0;
        let bln = false;
        for (const ele of vm.dataSourceList) {
          if (ele[vm.sortRuleParamName] == value) {
            num++;
            if (num > 1) {
              bln = true;
            }
          }
        }
        if (bln) {
          return false || "↑排序重覆";
        }
        return true;
      }
    }
  }),
  methods: {
    allowedDates(allowDate, val, current) {
      if (allowDate !== undefined) {
        let date = new Date();
        if (allowDate === "next") {
          date.setDate(date.getDate() - 1);
          return (
            Date.parse(val).valueOf() >= date.valueOf() ||
            Date.parse(val).valueOf() == Date.parse(current).valueOf()
          );
        } else if (allowDate === "past") {
          date.setDate(date.getDate() + 1);
          return (
            Date.parse(val).valueOf() <= date.valueOf() ||
            Date.parse(val).valueOf() == Date.parse(current).valueOf()
          );
        } else {
          return true;
        }
      }
      return true;
    },
    handleChange(type, value, val) {
      if (type === "number" && (value === "sort" || value === "seq")) {
        this.$emit("validate");
      }
    },
    handleChildExpand(data) {
      this.dataSourceList[data.index].show = !this.dataSourceList[data.index]
        .show;
    },
    handleAdd() {
      const newObj = JSON.parse(JSON.stringify(this.init));
      if (this.limitSize && this.dataSourceList.length === this.limitSize) {
        this.$store.dispatch("alert", "超過限制數量");
      } else {
        this.dataSourceList.push(newObj);
      }
    },
    handleRemove(index) {
      // if (this.dataSourceList.length === 1) {
      //   this.$store.dispatch("alert", "無法刪除");
      // } else {
      //   this.dataSourceList.splice(index, 1);
      // }
      this.dataSourceList.splice(index, 1);
    },
    handleGetEditorData(index, target, data) {
      this.dataSourceList[index][target] = data;
    },
    handleGetDate(index, targetStart, targetEnd, data) {
      this.dataSourceList[index][targetStart] = data.startDate;
      this.dataSourceList[index][targetEnd] = data.endDate;
    },
    bindVaild(data) {
      let arr = [];
      if (typeof data === "object") {
        data.forEach(str => {
          if (str === "required") {
            arr.push(this.rules.required);
          }
          if (str === "email") {
            arr.push(this.rules.email);
          }
          if (str === "isNumber") {
            arr.push(this.rules.isNumber);
          }
          if (str === "sort") {
            arr.push(this.rules.sort);
          }
        });
      } else if (typeof data === "string") {
        arr.push(this.rules[data]);
      }
      return arr;
    },
    evenColor(index) {
      if ((index + 1) % 2 == 0) {
        return "#B3E5FC";
      }
    }
  },
  watch: {},
  created() {
    // 啟用可新增多筆
    if (this.enAction) {
      let initObj = {};
      if (this.enExpand) {
        initObj.show = true;
      }

      this.labels.forEach(element => {
        if (element.type === "fileInput") {
          if (initObj.fileInput !== undefined) {
            initObj.fileInput[element.value] = [];
            initObj.fileInput[element.value_stock] = "";
            initObj.fileInput[element.option] = "upload";
          } else {
            initObj.fileInput = {
              [element.value]: [],
              [element.value_stock]: "",
              [element.option]: "upload"
            };
          }
        } else if (
          element.type === "date" &&
          element.defaultDate !== undefined
        ) {
          initObj[element.value] = element.defaultDate;
        } else {
          initObj[element.value] =
            element.type === "file" || element.type === "multiple" ? [] : "";
        }
      });
      this.init = initObj;

      if (this.dataSourceList.length === 0 && this.enActionDefaultAdd) {
        this.dataSourceList.push(JSON.parse(JSON.stringify(initObj)));
      }
    }
  },
  mounted() {}
};
</script>

<style lang="css" scoped>
.formGenerate {
  width: 100%;
}

.fileInput {
  width: 200px;
}
</style>





<template>
  <!-- 
 components
 @param enAction : 開啟新增刪除功能
 @param optionClass : 自訂義class

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
  <div class="panelMultiple">
    <template v-for="(data,index) in dataSourceList">
      <panel-function
        :key="index+label"
        hideHeader
        @remove="handleRemove(index)"
        :enAction="enAction"
        :disabled="disabled"
      >
        <v-col cols="12" :class="optionClass" class="ma-0 pa-0">
          <template v-for="(label,labelIndex) in labels">
            <v-col
              :key="labelIndex+label"
              class="mt-2 mb-1 pa-0"
              :sm="label.sm"
              :md="label.md"
              :lg="label.lg"
            >
              <date-picker
                v-if="label.type==='datePicker'"
                @getDate="(data)=>handleGetDate(index,label.startValue,label.endValue,data)"
                :startLabelText="label.startText"
                :endLabelText="label.endText"
                :titleBg="evenColor(index)"
                :titleWidth="label.titleWidth"
                :contentWidth="label.contentWidth"
                :rowHeight="label.rowHeight"
                :disabled="disabled"
              ></date-picker>

              <form-option
                v-else
                :title="label.text"
                :titleBg="evenColor(index)"
                :titleWidth="label.titleWidth"
                :contentWidth="label.contentWidth"
                :rowHeight="label.rowHeight"
              >
                <v-col cols="12" :style="label.contentStyle" class="ma-0 pa-0">
                  <v-text-field
                    v-if="label.type==='text'"
                    outlined
                    dense
                    type="text"
                    placeholder
                    v-model="data[label.value]"
                    :disabled="disabled || label.disabled"
                    :rules="bindVaild(label.valid)"
                  ></v-text-field>

                  <div v-if="label.type==='fileInput'" class="d-flex">
                    <v-radio-group
                      v-model="data[label.option]"
                      :mandatory="false"
                      row
                      :disabled="disabled"
                    >
                      <v-radio value="stock" label="選擇現有檔案"></v-radio>

                      <v-radio value="upload" label="上傳新檔案"></v-radio>
                    </v-radio-group>

                    <div class="fileInput" v-if="data[label.option]==='stock'">
                      <v-autocomplete
                        :items="stockItems"
                        item-text="text"
                        item-value="value"
                        label="選擇現有檔案"
                        outlined
                        dense
                        v-model="data[label.value_stock]"
                        :disabled="disabled"
                        :rules="bindVaild(label.valid)"
                      ></v-autocomplete>
                    </div>
                    <div class="fileInput" v-if="data[label.option]==='upload'">
                      <v-file-input
                        label="選擇檔案"
                        outlined
                        dense
                        v-model="data[label.value]"
                        prepend-icon
                        :disabled="disabled"
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
                  <document-editor
                    v-if="label.type==='editor'"
                    @getData="(data)=>handleGetEditorData(index,label.value,data)"
                    :disabled="disabled"
                  ></document-editor>
                  <v-textarea
                    v-if="label.type==='textarea'"
                    outlined
                    label
                    v-model="data[label.value]"
                  ></v-textarea>
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
      <v-icon>playlist_add</v-icon>新增
    </v-btn>
  </div>
</template>

<script>
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
    }
  },
  data: vm => ({
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
      }
    }
  }),
  methods: {
    handleAdd() {
      const newObj = JSON.parse(JSON.stringify(this.init));
      this.dataSourceList.push(newObj);
    },
    handleRemove(index) {
      if (this.dataSourceList.length === 1) {
        this.$store.dispatch("alert", "無法刪除");
      } else {
        this.dataSourceList.splice(index, 1);
      }
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
  watch: {
    stockItems() {}
  },
  created() {},
  mounted() {
    if (this.enAction) {
      let initObj = {};
      this.labels.forEach(element => {
        initObj[element.value] = element.type === "file" ? [] : "";
      });
      this.init = initObj;

      if (this.dataSourceList.length === 0) {
        this.dataSourceList.push(JSON.parse(JSON.stringify(initObj)));
      }
    }
  }
};
</script>

<style lang="css" scoped>
.panelMultiple {
  width: 100%;
}

.fileInput {
  width: 200px;
}
</style>


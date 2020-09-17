


<template>
  <!-- 
 components
 @param label : label  text
 @param dataSourceList : 目的Array
 @param selectItems : select data
 @param enAction : 新增

  -->
  <div class="panelSingle">
    <form-option
      :title="label"
      @click="handleAdd"
      :enEventButton="enAction"
      :titleWidth="titleWidth"
      :contentWidth="contentWidth"
      :rowHeight="rowHeight"
      :disabled="disabled"
      :buttonText="addButtonText"
      :titleBg="titleBg"
    >
      <template v-for="(item,index) in dataSourceList">
        <panel-function
          :key="index+'-'+label"
          hideHeader
          @remove="handleRemove(index)"
          :index="index"
          :enAction="enAction"
          :disabled="disabled"
          :contentColsPhone="contentColsPhone"
          :contentColsPC="contentColsPC"
        >
          <div v-if="inputType==='fileInput'" class="d-flex">
            <v-radio-group
              v-model="dataSourceList[index].fileType"
              :mandatory="false"
              row
              :disabled="disabled"
            >
              <v-radio value="stock" label="選擇檔案"></v-radio>

              <v-radio v-if="!selectFileOnly" value="upload" label="上傳新檔案"></v-radio>
            </v-radio-group>

            <div class="pdfFileInput" v-if="dataSourceList[index].fileType==='stock'">
              <v-autocomplete
                :items="stockItems"
                item-text="text"
                item-value="value"
                label="選擇現有檔案"
                outlined
                dense
                v-model="dataSourceList[index].fileStock"
                :disabled="disabled"
                :rules="bindVaild(vaildRules)"
                hide-details
              ></v-autocomplete>
            </div>
            <div
              class="pdfFileInput"
              v-if="dataSourceList[index].fileType==='upload' && !selectFileOnly"
            >
              <v-file-input
                class="ma-1 pa-0"
                label="選擇檔案"
                outlined
                dense
                hide-details
                v-model="dataSourceList[index].fileUpload"
                prepend-icon
                :disabled="disabled"
                :rules="bindVaild(vaildRules)"
              ></v-file-input>
            </div>
          </div>

          <v-text-field
            v-if="inputType==='text'"
            outlined
            dense
            type="text"
            hide-details
            v-model="dataSourceList[index]"
            class="ma-1 pa-0"
            :disabled="disabled"
            :rules="bindVaild(vaildRules)"
          ></v-text-field>

          <v-text-field
            v-if="inputType==='text_object'"
            outlined
            dense
            type="text"
            hide-details
            :value="dataSourceList[index][inputText]"
            class="ma-1 pa-0"
            :disabled="disabled"
            :rules="bindVaild(vaildRules)"
            @input="(val)=>handleValueInput(dataSourceList[index],val)"
          ></v-text-field>

          <v-select
            v-if="inputType==='select'"
            :items="selectItems"
            :item-text="selectText"
            :item-value="selectValue"
            :label="label"
            outlined
            dense
            v-model="dataSourceList[index]"
            class="ma-1 pa-0"
            :disabled="disabled"
            hide-details
            :rules="bindVaild(vaildRules)"
          ></v-select>

          <v-select
            v-if="inputType==='select_multiple'"
            :items="selectItems"
            :item-text="selectText"
            :item-value="selectValue"
            :label="label"
            outlined
            dense
            class="ma-1 pa-0"
            :disabled="disabled"
            hide-details
            :rules="bindVaild(vaildRules)"
            multiple
          ></v-select>

          <v-file-input
            v-if="inputType==='file'"
            class="ma-1 pa-0"
            label="選擇檔案"
            outlined
            dense
            hide-details
            v-model="dataSourceList[index]"
            prepend-icon
            :disabled="disabled"
            :rules="bindVaild(vaildRules)"
          ></v-file-input>
        </panel-function>
      </template>
    </form-option>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: ""
    },
    inputType: {
      type: String,
      default: "text"
    },
    inputValue: {
      type: String,
      default: ""
    },
    inputText: {
      type: String,
      default: ""
    },
    dataSourceList: {
      type: Array,
      default: []
    },
    selectItems: {
      type: Array,
      default: null
    },
    enAction: {
      type: Boolean,
      default: false
    },
    titleWidth: {
      type: String,
      default: "20%"
    },
    contentWidth: {
      type: String,
      default: "80%"
    },
    rowHeight: {
      type: String,
      default: "auto"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    stockItems: {
      type: Array,
      default: () => []
    },
    selectText: {
      type: String,
      default: "text"
    },
    selectValue: {
      type: String,
      default: "value"
    },
    vaildRules: {
      type: Array,
      default: () => []
    },
    addButtonText: {
      type: String,
      default: "新增"
    },
    titleBg: {
      type: String,
      default: "#e9ecef"
    },
    selectFileOnly: {
      type: Boolean,
      default: false
    },
    contentColsPhone: {
      type: String,
      default: "10"
    },
    contentColsPC: {
      type: String,
      default: "10"
    }
  },
  data: vm => ({
    init: {
      text: "",
      select: "",
      select_multiple: [],
      text_object: { [vm.inputValue]: "", [vm.inputText]: "" },
      file: [],
      fileInput: {
        fileType: vm.selectFileOnly ? "stock" : "upload",
        fileStock: "",
        fileUpload: []
      }
    },
    rules: {
      required: value => !!value || "↑不能為空.",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "E-mail 格式錯誤";
      }
    }
  }),
  methods: {
    handleValueInput(data, val) {
      data[this.inputText] = val;
      if (data[this.inputValue] === "") {
        delete data[this.inputValue];
      }
    },
    handleAdd() {
      this.dataSourceList.push(
        JSON.parse(JSON.stringify(this.init[this.inputType]))
      );
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
    evenColor(index) {
      if ((index + 1) % 2 == 0) {
        return "#B3E5FC";
      }
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
    }
  },
  computed: {},
  watch: {
    // dataSourceList() {
    //   this.handleAdd();
    // }
  },
  created() {},
  mounted() {
    if (this.enAction && this.dataSourceList.length === 0) {
      this.handleAdd();
    }
  }
};
</script>

<style lang="css" scoped>
.panelSingle {
  width: 100%;
}

.pdfFileInput {
  width: 40%;
}
</style>


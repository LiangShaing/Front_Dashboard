<template>
  <v-card class="cardStyle">
    <div id="dataTableAc">
      <template>
        <v-data-table
          :headers="headers"
          :items="dataArray"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
        >
          <!-- 使用者頁面  註銷使用者-->
          <template v-slot:item.writeOff="props">
            <v-btn
              v-if="props.item.cmActive==='0'"
              color="error"
              :disabled="props.item.cmActive==='0'"
            >{{props.header.text}}</v-btn>

            <profile-dialog profileWidth="400px" v-else>
              <template #open-dialog>
                <v-btn color="error">{{props.header.text}}</v-btn>
              </template>

              <template #dialog-content>
                <div class="text-center">確認{{props.header.text}}?</div>
              </template>

              <template #dialog-close>
                <v-btn color="primary">取消</v-btn>
              </template>

              <template #dialog-save>
                <v-btn color="primary" @click="action('writeOff',props.item)">確認</v-btn>
              </template>
            </profile-dialog>
          </template>
          <!-- 使用者頁面 -->

          <!-- 功能授權 -->
          <template v-slot:item.level="props">
            <div class="justify-center">
              <v-radio-group
                ref="radio"
                v-if="props.item.cmContentFlag==='Y'"
                v-model="props.item.level"
                :mandatory="false"
                row
              >
                <v-radio value="E" label="經辦"></v-radio>
                <v-radio value="R" label="大經辦"></v-radio>
                <v-radio value="A" label="覆核者"></v-radio>
                <v-btn @click="props.item.level=''">取消</v-btn>
              </v-radio-group>

              <v-radio-group v-else v-model="props.item.level" :mandatory="false" row>
                <v-radio value="E" label="啟動"></v-radio>
              </v-radio-group>
            </div>
          </template>
          <!-- 功能授權 -->

          <!-- department -->
          <template v-slot:item.cmDeptName="props">
            <div class="text-center mt-0" style="cursor:pointer">
              <v-text-field
                outlined
                dense
                type="text"
                v-model="props.item.cmDeptName"
                :rules="[rules.required,rules.checkDeptName]"
              ></v-text-field>
            </div>
          </template>

          <template v-slot:item.checkbox="props">
            <div style="cursor:pointer">
              <v-checkbox
                v-if="props.item.checkbox!==undefined"
                color="error"
                v-model="props.item.checkbox"
              ></v-checkbox>
              <v-icon v-else color="error" class="ml-0" @click="handleClick(props.item)">close</v-icon>
            </div>
          </template>
          <!-- department -->

          <template v-slot:item.remove="props">
            <profile-dialog profileWidth="400px">
              <template #open-dialog>
                <v-btn color="error">{{props.header.text}}</v-btn>
              </template>

              <template #dialog-content>
                <div class="text-center">確認{{props.header.text}}?</div>
              </template>

              <template #dialog-close>
                <v-btn color="primary">取消</v-btn>
              </template>

              <template #dialog-save>
                <v-btn color="primary" @click="action('remove',props.item)">確認</v-btn>
              </template>
            </profile-dialog>
          </template>

          <template v-slot:item.edit="props">
            <div class="text-center">
              <v-btn dark color="cyan" @click="action('edit',props.item)">編輯</v-btn>
            </div>
          </template>

          <template v-slot:item.stop="props">
            <div class="text-center">
              <v-btn color="error" @click="action('stop',props.item)">停用</v-btn>
            </div>
          </template>

          <!-- <template v-slot:item.roleName="props">
            <div class="text-center" style="cursor:pointer">
              <div @click="action('forward',props.item)">{{props.item.roleName}}</div>
            </div>
          </template>-->
        </v-data-table>
      </template>
    </div>
  </v-card>
</template>

<script>
import profileDialog from "@/components/common-widgets/ProfileDialog";
export default {
  components: {
    profileDialog
  },
  props: {
    headers: {
      type: Array,
      default: null
    },
    dataArray: {
      type: Array,
      default: []
    }
  },

  data: vm => ({
    expanded: [],
    singleExpand: false,
    radios: "",
    rules: {
      required: value => !!value || "↑不能為空.",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "E-mail 格式錯誤";
      },
      checkDeptName: v => {
        const arr = vm.dataArray.filter(e => e.cmDeptName === v);
        if (arr.length > 1) {
          return false || "部門名稱重複";
        } else {
          return true;
        }
      }
    }
  }),
  computed: {},
  methods: {
    action(type, data) {
      this.$emit(type, data);
    },
    handleClick(item) {
      this.$emit("delete", item);
    }
  }
};
</script>
<style >
#dataTableAc .v-data-table td {
  padding: 10px !important;
}

#dataTableAc th {
  /* border-left: 1px solid #dddddd; */
  background-color: beige;
}
</style>
<template>
  <v-card class="cardStyle">
    <div id="dataTable">
      <template>
        <v-data-table
          :headers="headers"
          :items="dataArray"
          item-key="index"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          :hide-default-footer="hideFooter"
          :sort-by="sort"
          :sort-desc="sortAsc?false:true"
          :sort-asc="sortAsc"
          must-sort
        >
          <template v-slot:item.remove="props">
            <v-btn
              v-if="(props.item.status!==caseEnum.d&& props.item.status!==caseEnum.p) || props.item.isDelete===caseEnum.y"
              color="error"
              :disabled="(props.item.status!==caseEnum.d&& props.item.status!==caseEnum.p) || props.item.isDelete===caseEnum.y"
            >{{props.header.text}}</v-btn>

            <profile-dialog profileWidth="400px" v-else>
              <template #open-dialog>
                <v-btn
                  color="error"
                  :disabled="(props.item.status!==caseEnum.d&& props.item.status!==caseEnum.p) || props.item.isDelete===caseEnum.y"
                >{{props.header.text}}</v-btn>
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

          <!-- <template v-slot:item.edit="props">
            <div class="text-center">
              <v-btn
                color="primary"
                @click="action('edit',props.item)"
                :disabled="(props.item.status!==caseEnum.d&& props.item.status!==caseEnum.p && currentPageAuth.indexOf(caseEnum.e)===-1) || props.item.isDelete===caseEnum.y "
              >
                <div
                  :style="(props.item.status!==caseEnum.d&& props.item.status!==caseEnum.p && currentPageAuth.indexOf(caseEnum.e)===-1) || props.item.isDelete===caseEnum.y?'':'color:white'"
                >編輯&檢閱</div>
              </v-btn>
            </div>
          </template>-->

          <template v-slot:item.edit="props">
            <div class="text-center">
              <v-btn color="primary" @click="action('edit',props.item)">
                <div :style="'color:white'">編輯&檢閱</div>
              </v-btn>
            </div>
          </template>

          <template v-slot:item.preview="props">
            <div
              class="text-center"
              v-if="props.item.isDelete!==null && props.item.isDelete!==undefined && props.item.isDelete===caseEnum.n"
            >
              <v-btn @click="action('preview',props.item)" color="primary">預覽</v-btn>
            </div>
          </template>

          <template v-slot:item.details="props">
            <div class="text-center">
              <v-btn color="#E3F2FD" @click="action('details',props.item)">{{props.header.text}}</v-btn>
            </div>
          </template>

          <template v-slot:item.stop="props">
            <div class="text-center">
              <v-btn color="error" @click="action('stop',props.item)">停用</v-btn>
            </div>
          </template>

          <!-- 建議搭配主附約 -->
          <template v-slot:item.send="props">
            <div class="text-center">
              <v-btn
                color="primary"
                @click="action('send',props.item)"
                :disabled=" props.item.status!==caseEnum.d"
              >
                <div :style=" props.item.status!==caseEnum.d?'':'color:white'">送審</div>
              </v-btn>
            </div>
          </template>
          <!-- 建議搭配主附約 -->

          <template v-slot:item.auditR="props">
            <div class="text-center">
              <v-btn
                color="primary"
                @click="action('audit',props.item)"
                :disabled=" props.item.status!==caseEnum.r"
              >審核通過</v-btn>
            </div>
          </template>

          <template v-slot:item.auditA="props">
            <div class="text-center">
              <v-btn
                color="primary"
                @click="action('audit',props.item)"
                :disabled=" props.item.status!==caseEnum.a"
              >審核通過</v-btn>
            </div>
          </template>

          <template v-slot:item.reject="props">
            <div class="text-center">
              <v-btn
                color="error"
                @click="action('reject',props.item)"
                :disabled="currentPageAuth.indexOf(props.item.status)===-1  || props.item.status===caseEnum.d|| props.item.status===caseEnum.p"
              >退回</v-btn>
            </div>
          </template>

          <template v-slot:item.roleName="props">
            <div class="text-center" style="cursor:pointer">
              <div @click="action('forward',props.item)">{{props.item.roleName}}</div>
            </div>
          </template>
          <!-- 共用 -->
          <template v-slot:item.status="props">
            <div class="text-center mt-2">
              <p v-if="props.item.status===caseEnum.d">草稿</p>
              <p v-if="props.item.status===caseEnum.r && props.item.isDelete===caseEnum.n">待審核</p>
              <p v-if="props.item.status===caseEnum.a && props.item.isDelete===caseEnum.n">待覆核</p>
              <p v-if="props.item.status===caseEnum.p && props.item.isDelete===caseEnum.n">已上架</p>
              <p v-if="props.item.status===caseEnum.r && props.item.isDelete===caseEnum.y">刪除審核</p>
              <p v-if="props.item.status===caseEnum.a && props.item.isDelete===caseEnum.y">刪除覆核</p>
              <p v-if="props.item.status===caseEnum.p && props.item.isDelete===caseEnum.y">已下架</p>
            </div>
          </template>

          <template v-slot:item.audit_r="props">
            <div class="text-center">
              <v-btn
                color="primary"
                @click="action('audit',props.item)"
                :disabled="props.item.status!==caseEnum.r"
              >檢閱</v-btn>
            </div>
          </template>
          <template v-slot:item.audit_a="props">
            <div class="text-center">
              <v-btn
                color="primary"
                @click="action('audit',props.item)"
                :disabled="props.item.status!==caseEnum.a"
              >檢閱</v-btn>
            </div>
          </template>
          <!-- 共用 -->
        </v-data-table>
      </template>
    </div>
  </v-card>
</template>

<script>
import profileDialog from "@/components/common-widgets/ProfileDialog";
import { caseEnum } from "@/api/enum";

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
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    currentPageAuth: {
      type: Array,
      default: () => []
    },
    sort: {
      type: String,
      default: ""
    },
    sortAsc: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    caseEnum: JSON.parse(JSON.stringify(caseEnum)),
    expanded: [],
    singleExpand: false,
    radios: "",
    rules: {
      required: value => !!value || "↑不能為空.",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "E-mail 格式錯誤";
      }
    }
  }),
  computed: {},
  methods: {
    action(type, data) {
      this.$emit(type, data);
    }
  }
};
</script>
<style >
#dataTable .v-data-table th {
  padding: 0px !important;
}
#dataTable .v-data-table td {
  padding: 1px !important;
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#dataTable th {
  background-color: beige;
}
</style>
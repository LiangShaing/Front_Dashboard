<template>
  <div id="levelThr">
    <v-col cols="12" sm="12" class="d-lg-flex d-md-flex pa-0 ma-0 marginLeft" md="12">
      <v-col sm="10" class="pa-0 ma-0" md="10" lg="10">
        <v-col cols="12" sm="12" class="d-lg-flex d-md-flex pa-0 ma-0" md="12">
          <v-col sm="10" class="pa-0 ma-0" md="9" lg="9">
            <form-option title="第三階功能名稱*" titleBg="#E6EE9C">
              <v-select
                v-if="dataSource.type===officialPageHeaderLinkEnum.b"
                :items="bigCoverageList"
                item-text="title"
                item-value="uid"
                outlined
                dense
                v-model="dataSource.bigCoverageUid"
                :rules="requiredRules"
                :disabled="disabled"
                @change="handleChange"
              ></v-select>
              <v-text-field
                v-else
                outlined
                dense
                type="text"
                placeholder
                v-model="dataSource.name"
                hide-details
                :rules="requiredRules"
                :disabled="disabled"
              ></v-text-field>
            </form-option>
          </v-col>

          <v-col sm="2" class="pa-0 ma-0" md="3" lg="3">
            <form-option title="順序" titleBg="#E6EE9C">
              <v-text-field
                outlined
                dense
                type="number"
                placeholder
                v-model="dataSource.seq"
                hide-details
                min="1"
                max="12"
                :disabled="disabled"
              ></v-text-field>
            </form-option>
          </v-col>
        </v-col>

        <v-col sm="12" class="pa-0 ma-0 d-flex" md="12" lg="12">
          <v-col sm="10" class="pa-0 ma-0" md="10" lg="10">
            <form-option title="第三階功能連結" titleBg="#E6EE9C">
              <v-text-field
                outlined
                dense
                type="text"
                placeholder
                v-model="dataSource.link"
                hide-details
                :disabled="disabled"
              ></v-text-field>
            </form-option>
          </v-col>
          <v-col class="pa-0 ma-0" sm="2" md="2" lg="2">
            <v-checkbox
              v-model="dataSource.type"
              class="ma-2"
              label="主約險別"
              :value="officialPageHeaderLinkEnum.b"
              hide-details
              :disabled="disabled"
            ></v-checkbox>
          </v-col>
        </v-col>
      </v-col>

      <v-col sm="1" md="1" class="d-lg-flex d-md-flex pa-0 pr-0">
        <v-btn dark color="green" class="ma-1" @click="add" small :disabled="disabled">
          <v-icon>add</v-icon>
        </v-btn>

        <profile-dialog profileWidth="400px" ref="confirmDialog" v-if="!disabled">
          <template #open-dialog>
            <v-btn dark color="error" class="ma-1" small>
              <v-icon>close</v-icon>
            </v-btn>
          </template>

          <template #dialog-content>
            <div class="text-center">確認刪除?</div>
          </template>

          <template #dialog-close>
            <v-btn color="primary">取消</v-btn>
          </template>

          <template #dialog-save>
            <v-btn color="primary" @click="remove">確認</v-btn>
          </template>
        </profile-dialog>
      </v-col>
    </v-col>
  </div>
</template>

<script>
import { officialPageHeaderLinkEnum } from "@/api/enum";
export default {
  components: {},
  props: {
    levelOneIndex: {
      type: Number,
      default: 0
    },
    levelTwoIndex: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    dataSource: {
      type: Object,
      default: {
        name: "",
        seq: "",
        link: "",
        type: officialPageHeaderLinkEnum.b
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    bigCoverageList: {
      type: Array,
      default: []
    }
  },
  data: () => ({
    requiredRules: [v => !!v || "↑不能為空"],
    officialPageHeaderLinkEnum: officialPageHeaderLinkEnum
  }),
  methods: {
    handleChange(data) {
      const b = this.bigCoverageList.filter(ele => ele.uid === data);
      this.dataSource.name = b.length !== 0 ? b[0].title : "";
    },
    add() {
      this.$emit("add", this.levelOneIndex, this.levelTwoIndex);
    },
    remove() {
      this.$emit("remove", this.levelOneIndex, this.levelTwoIndex, this.index);
    }
  },
  created() {},
  watch: {
    "dataSource.type": function(val, oldVal) {
      if (val !== oldVal) {
        this.dataSource.name = null;
        this.dataSource.bigCoverageUid = null;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="css" scoped>
.marginLeft {
  margin-left: 35px !important;
}
</style>


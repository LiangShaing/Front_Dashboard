<template>
  <div id="levelTwo">
    <v-col cols="12" sm="12" class="d-lg-flex d-md-flex pa-0 ma-0" md="12">
      <div>
        <v-btn icon @click="expand">
          <v-icon v-if="dataSource.childExpand">keyboard_arrow_down</v-icon>
          <v-icon v-else>keyboard_arrow_right</v-icon>
        </v-btn>
      </div>
      <v-col sm="10" class="pa-0 ma-0" md="10" lg="10">
        <v-col sm="12" class="d-lg-flex d-md-flex pa-0 ma-0" md="12">
          <v-col sm="10" class="pa-0 ma-0" md="9" lg="9">
            <form-option title="第二階功能名稱*" titleBg="#80DEEA">
              <v-text-field
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
            <form-option title="順序" titleBg="#80DEEA">
              <v-text-field
                outlined
                dense
                type="number"
                placeholder
                v-model="dataSource.seq"
                hide-details
                min="1"
                max="6"
                :disabled="disabled"
              ></v-text-field>
            </form-option>
          </v-col>
        </v-col>

        <v-col sm="12" class="pa-0 ma-0" md="12" v-show="dataSource.childExpand">
          <form-option title="第二階功能連結" titleBg="#80DEEA">
            <v-text-field
              v-if="dataSource.levelThr.length!==0"
              outlined
              dense
              type="text"
              placeholder
              value="如欲設定連結，請先把第三階功能清空"
              hide-details
              :disabled="disabled || dataSource.levelThr.length!==0"
            ></v-text-field>
            <v-text-field
              v-else
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
      </v-col>
      <v-col sm="1" md="1" lg="1" class="d-lg-flex d-md-flex pa-0">
        <v-btn dark color="green" class="ma-1" @click="add" small :disabled="disabled">
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn dark color="error" class="ma-1" @click="confirmRemove" small :disabled="disabled">
          <v-icon>close</v-icon>
        </v-btn>
      </v-col>

      <profile-dialog profileWidth="400px" ref="confirmDialog">
        <template #open-dialog></template>

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

      <profile-dialog profileWidth="400px" ref="tipDialog">
        <template #open-dialog></template>

        <template #dialog-content>
          <div class="text-center">如欲設定連結，請先把第三階功能清空</div>
        </template>

        <template #dialog-close>
          <v-btn color="primary">取消</v-btn>
        </template>

        <template #dialog-save>
          <v-btn color="primary" @click="clearLink">確認</v-btn>
        </template>
      </profile-dialog>
    </v-col>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    levelOneIndex: {
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
        levelThr: []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    requiredRules: [v => !!v || "↑不能為空"]
  }),
  methods: {
    clearLink() {
      // this.dataSource.link = "";
    },
    add() {
      this.$emit("add", this.levelOneIndex);
    },
    confirmRemove() {
      if (this.dataSource.levelThr.length !== 0) {
        this.$store.dispatch("alert", "沒有子項時才可以刪除");
      } else {
        this.$refs.confirmDialog.toggle(true);
      }
    },
    remove() {
      this.$emit("remove", this.levelOneIndex, this.index);
    },
    expand() {
      this.dataSource.childExpand = !this.dataSource.childExpand;
    }
  },
  watch: {},
  mounted() {}
};
</script>

<style lang="css" scoped>
</style>


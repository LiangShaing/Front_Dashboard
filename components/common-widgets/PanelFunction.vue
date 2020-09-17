<template>
  <div id="panelFunction">
    <v-col cols="12" class="d-flex pa-0 ma-0">
      <v-col
        cols="12"
        class="pa-0 ma-0 d-flex"
        :sm="enAction?contentColsPhone:'12'"
        :md="enAction?contentColsPC:'12'"
        :lg="enAction?contentColsPC:'12'"
      >
        <v-col sm="1" md="1" lg="1" class="pa-0" v-if="!hideHeader">
          <v-btn icon @click="childExpandAction" class="ma-2" v-if="enExpand">
            <v-icon v-if="expand">keyboard_arrow_down</v-icon>
            <v-icon v-else>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-col>

        <v-col
          :sm="hideHeader?12:11"
          :md="hideHeader?12:11"
          :lg="hideHeader?12:11"
          class="pa-0 ma-0"
        >
          <slot></slot>
        </v-col>
      </v-col>

      <v-col
        :sm="actionsColsPhone"
        :md="actionsColsPC"
        :lg="actionsColsPC"
        class="d-lg-flex d-md-flex pa-0"
        v-if="enAction"
      >
        <v-btn
          v-if="enAddButton"
          dark
          color="green"
          class="ma-1 mt-2"
          @click="add"
          small
          icon
          :disabled="disabled"
        >
          <v-icon>add</v-icon>
        </v-btn>

        <profile-dialog profileWidth="400px" ref="confirmDialog">
          <template #open-dialog>
            <v-btn dark color="error" class="ma-1 mt-2" small icon :disabled="disabled">
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
import profileDialog from "@/components/common-widgets/ProfileDialog";
export default {
  components: {
    profileDialog
  },
  props: {
    hideHeader: {
      type: Boolean,
      default: false
    },
    contentColsPC: {
      type: String,
      default: "10"
    },
    actionsColsPC: {
      type: String,
      default: "1"
    },
    contentColsPhone: {
      type: String,
      default: "10"
    },
    actionsColsPhone: {
      type: String,
      default: "1"
    },
    enExpand: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    },
    enAction: {
      type: Boolean,
      default: false
    },
    enAddButton: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data: vm => ({
    childExpand: vm.expand
  }),
  methods: {
    add() {
      this.$emit("add");
    },
    remove() {
      this.$emit("remove");
    },
    childExpandAction() {
      this.childExpand = !this.childExpand;
      this.$emit("childExpand", { index: this.index, data: this.childExpand });
    }
  },
  watch: {},
  mounted() {}
};
</script>

<style lang="css" scoped>
</style>


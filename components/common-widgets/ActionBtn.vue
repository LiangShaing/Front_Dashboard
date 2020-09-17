<template>
  <div>
    <div class="font-weight-black">案件狀態 : {{currentCaseStatusText}}{{caseAction==='add'?'-未儲存':''}}</div>
    <v-col class="d-lg-flex d-md-flex pa-5" cols="12">
      <v-btn
        v-if="btn.indexOf('back')!==-1"
        @click="action('back')"
        class="ma-1"
        color="#78909C"
        dark
      >回上一頁</v-btn>
      <v-btn
        v-if="btn.indexOf('preview')!==-1 && caseAction!=='add'"
        dark
        color="primary"
        @click="action('preview')"
        class="ma-1"
      >預覽</v-btn>
      <v-btn
        color="warning"
        @click="checkSave(caseEnum.d)"
        class="ma-1"
        v-if="btn.indexOf('save')!==-1&& currentPageAuth.indexOf(caseEnum.a)===-1  &&  (currentCaseStatus===caseEnum.d || currentCaseStatus===caseEnum.p)"
      >暫存</v-btn>
      <v-btn
        color="success"
        @click="checkSave(caseEnum.r)"
        class="ma-1"
        v-if="btn.indexOf('save')!==-1&& currentPageAuth.indexOf(caseEnum.a)===-1 && (currentCaseStatus===caseEnum.d || currentCaseStatus===caseEnum.p)"
      >送審</v-btn>
      <v-btn
        dark
        color="cyan"
        @click="action('auditSuccess')"
        class="ma-1"
        v-if="btn.indexOf('audit')!==-1 && currentPageAuth.indexOf(currentCaseStatus)!==-1&& (currentCaseStatus===caseEnum.r || currentCaseStatus===caseEnum.a)"
      >審核通過</v-btn>
      <v-btn
        dark
        color="error"
        @click="action('inputRejectMessage')"
        class="ma-1"
        v-if="btn.indexOf('reject')!==-1 && currentPageAuth.indexOf(currentCaseStatus)!==-1&& (currentCaseStatus===caseEnum.r || currentCaseStatus===caseEnum.a)"
      >退件</v-btn>
    </v-col>
  </div>
</template>

<script>
import { caseEnum, currentCaseStatusEnum } from "@/api/enum";
export default {
  components: {},
  props: {
    caseAction: {
      type: String,
      default: "edit"
    },
    currentCaseStatus: {
      type: String,
      default: ""
    },
    currentPageAuth: {
      type: Array,
      default: []
    },
    currentCaseIsDelete: {
      type: String,
      default: ""
    },
    valid: {
      type: Boolean,
      default: true
    },
    btn: {
      type: Array,
      default: () => ["back", "save", "audit", "reject"]
    }
  },
  data: vm => ({
    caseEnum: JSON.parse(JSON.stringify(caseEnum))
  }),
  computed: {
    currentCaseStatusText() {
      return currentCaseStatusEnum(
        this.currentCaseStatus,
        this.currentCaseIsDelete
      );
    }
  },
  methods: {
    action(action) {
      this.$emit(action);
    },
    checkSave(status) {
      this.$emit("checkSave", status);
    }
  },
  watch: {},
  created() {},
  mounted() {}
};
</script>

<style scoped>
</style>

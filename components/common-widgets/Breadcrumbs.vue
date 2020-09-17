<template>
  <v-breadcrumbs :items="current" class="ma-0 pa-0">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :disabled="item.disabled" @click="item.click" class="ma-0 pa-0">
        <v-card-title
          class="font-weight-black pa-0 ma-0"
          :class="item.disabled ?'black--text': 'blue--text text--darken-2  cursor-point'"
        >{{item.text}}</v-card-title>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
import { caseEnum, currentCaseStatusEnum } from "@/api/enum";
export default {
  components: {},
  props: {
    items: {
      type: Array,
      default: []
    },
    currentCompontent: {
      type: String,
      default: ""
    }
  },
  data: vm => ({
    current: []
  }),
  methods: {
    process() {
      this.current = [];
      let index = 0;
      for (const ele of this.items) {
        let bln = ele.compontent === this.currentCompontent;
        ele.disabled = bln;
        this.current.push(ele);
        if (bln) {
          break;
        }
      }
    }
  },
  watch: {
    currentCompontent(val) {
      this.process();
    }
  },
  mounted() {
    this.process();
  }
};
</script>

<style scoped>
</style>

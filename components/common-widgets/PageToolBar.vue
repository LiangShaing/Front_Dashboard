<template>
  <v-toolbar class="appToobar ma-0 pa-0" :class="headerWidth">
    <breadcrumbs :items="breadcrumbs" :currentCompontent="currentCompontent"></breadcrumbs>
    <v-spacer></v-spacer>
    <div class="d-none d-lg-flex d-xl-flex">
      <div class="font-weight-black ma-2 pa-3">案件狀態 : {{currentCaseStatusText}}</div>
      <v-btn icon class="ma-2">
        <v-icon color="primary">pageview</v-icon>預覽
      </v-btn>

      <v-btn icon class="ma-2">
        <v-icon color="warning">save</v-icon>暫存
      </v-btn>

      <v-btn icon class="ma-2">
        <v-icon color="#4CAF50">send</v-icon>送審
      </v-btn>

      <v-btn icon class="ma-2">
        <v-icon color="#673AB7">check_box</v-icon>審核
      </v-btn>

      <v-btn icon class="ma-2">
        <v-icon color="error">undo</v-icon>退件
      </v-btn>
    </div>
    <v-menu bottom left class="pa-0 ma-0 d-lg-none d-xl-none">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="d-lg-none d-xl-none">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list class="pa-0">
        <v-list-item
          v-for="(item,index) in items"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
          :key="index"
          @click="item.click"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { caseEnum, currentCaseStatusEnum } from "@/api/enum";
export default {
  props: {
    currentStatus: {
      type: String,
      default: ""
    },
    currentIsDelete: {
      type: String,
      default: ""
    },
    currentCompontent: {
      type: String,
      default: ""
    },
    breadcrumbs: {
      type: Array,
      default: []
    }
  },
  data: vm => ({
    items: [
      {
        icon: "pageview",
        title: "預覽",
        click: e => vm.$emit("action", "preview")
      },
      {
        icon: "save",
        title: "暫存",
        click: e => vm.$emit("action", "save")
      },
      {
        icon: "send",
        title: "送審",
        click: e => vm.$emit("action", "send")
      },

      {
        icon: "check_box",
        title: "審核",
        click: e => vm.$emit("action", "audit")
      },
      {
        icon: "undo",
        title: "退件",
        click: e => vm.$emit("action", "reject")
      }
    ]
  }),
  computed: {
    currentCaseStatusText() {
      return currentCaseStatusEnum(this.currentStatus, this.currentIsDelete);
    },
    headerWidth() {
      if (
        (this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.xl) &&
        this.$store.state.drawer
      ) {
        return "headerWidth2";
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.appToobar {
  position: fixed;
  background-color: beige !important;
  z-index: 5;
  top: 64px;
  width: 100%;
}

.headerWidth2 {
  width: calc(100% - 280px);
}

@media (max-width: 376px) {
  .appToobar {
    position: fixed;
    background-color: beige !important;
    z-index: 5;
    top: 56px;
  }
}

@media (min-width: 1024px) {
  .appToobar {
    position: fixed;
    background-color: beige !important;
    z-index: 5;
    top: 64px;
  }
}
</style>


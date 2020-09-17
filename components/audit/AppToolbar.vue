<template>
  <v-toolbar fixed dark class="appToobarStyle">
    <v-toolbar-title class="ml-0 pl-3">
      <v-btn icon @click.stop="toggleDrawer()">
        <v-icon v-if="drawer">mdi-sort-variant</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar-title>
    <h3>奧米科技官網後台系統</h3>
    <v-spacer></v-spacer>
    <div>
      {{member&&member.cmUserName}}
      <div style="font-size:10px" v-if="storeAgent">被 {{storeAgent.cmAgentName}} 代理中</div>
      <div style="font-size:10px" v-if="storeAgentUser">代理 {{storeAgentUser.cmUserName}} 中</div>
    </div>
    <v-menu bottom left>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="mr-10">
          <!-- <v-avatar size="30px">
            <img src="@/static/avatar/man_2.jpg" alt="Michael Wang" />
          </v-avatar>-->
          <v-icon>person_pin</v-icon>
        </v-btn>
      </template>

      <v-list class="pa-0">
        <v-list-item
          v-for="(item,index) in items"
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
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

    <profile-dialog ref="agentDialog" title="基本資料/代理人" profileWidth="1000px" enableTitle>
      <template #dialog-content>
        <agent></agent>
      </template>
    </profile-dialog>
  </v-toolbar>
</template>


<script>
import Util from "@/util";
import agent from "@/containers/account/agent";

export default {
  name: "app-toolbar",
  components: {
    agent
  },
  data: vm => ({
    member: JSON.parse(window.sessionStorage.getItem("userInfo")),
    // agent: JSON.parse(window.sessionStorage.getItem("agent")),
    on: false,
    items: [
      {
        icon: "settings",
        title: "基本資料/代理人",
        click: e => {
          vm.$refs.agentDialog.toggle(true);
        }
      },
      {
        icon: "undo",
        title: "登出",
        click: e => {
          vm.logout();
        }
      }
    ]
  }),
  computed: {
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav;
    },
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("drawer", val);
      }
    },
    // 代理別人中
    storeAgentUser() {
      if (
        this.$store.state.currentUser &&
        this.$store.state.currentUser.cmUserId !== this.member.cmUserId
      ) {
        return this.$store.state.currentUser;
      } else {
        return null;
      }
    },
    // 被代理別人中
    storeAgent() {
      return this.$store.state.agent;
    }
  },
  methods: {
    logout() {
      $nuxt._router.push("/audit/logout");
    },
    toggleDrawer() {
      this.$store.commit("toggleDrawer");
    }
  },
  mounted() {}
};
</script>
<style scoped>
.appToobarStyle {
  width: 100%;
  position: fixed;
  z-index: 6;
  background: linear-gradient(120deg, #08A57F, #0B684D);
}

div.v-list-item__title {
  font-family: "Microsoft JhengHei", sans-serif !important;
  font-weight: initial;
  line-height: normal;
  -webkit-font-smoothing: antialiased;
}
</style>

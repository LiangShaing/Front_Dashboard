<template>
  <div id="appRoot">
    <template>
      <v-app id="inspire" class="app">
        <app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>

        <v-main class="v_content_style">
            <nuxt />
        </v-main>


        <div v-if="loading" class="loading">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
            class="loadingIcon"
          ></v-progress-circular>
        </div>
      </v-app>
    </template>

    <v-snackbar :timeout="3000" bottom right :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn dark @click.native="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import AppDrawer from "@/components/audit/AppDrawer";
import AppToolbar from "@/components/audit/AppToolbar";

export default {
  components: {
    AppDrawer,
    AppToolbar
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    snackbar: {
      show: false,
      text: "",
      color: ""
    }
  }),
  computed: {
    snackbarStore() {
      return this.$store.state.snackbar;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {},
  watch: {
    snackbarStore() {
      if (this.$store.state.snackbar.show) {
        this.snackbar.show = this.$store.state.snackbar.show;
        this.snackbar.text = this.$store.state.snackbar.text;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="css" >
.setting-fab {
  top: 50% !important;
  right: 0;
  border-radius: 0;
}

.page-wrapper {
  margin-bottom: 50px;
}

.app--footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.centet {
  min-height: 80vh;
}

.v_content_style {
  margin-top: 64px;
  width: 100%;
  /* padding: 0px 0px 0px 0px !important; */
}

@media (max-width: 376px) {
  .v_content_style {
    margin-top: 56px;
    width: 100%;
    padding: 0px 0px 0px 0px !important;
  }
}

@media (min-width: 1024px) {
  .v_content_style {
    margin-top: 64px;
    /* margin: 64px 0px 0px 280px !important; */
    /* width: calc(100% - 280px); */
    width: calc(100%);
    /* padding: 0px 0px 0px 0px !important; */
  }
}

.v_main_style {
  background: #f2f8f9 !important;
  height: 100%;
}

.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  top: 0px;
  opacity: 0.46;
  background-color: rgb(33, 33, 33);
  border-color: rgb(33, 33, 33);
}

.loadingIcon {
  top: 250px;
  left: 50%;
}
</style>

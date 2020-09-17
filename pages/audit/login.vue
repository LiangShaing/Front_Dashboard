<template>
  <v-app id="login">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="12" md="12" class="d-flex">
            <img alt height="100" width="120" src="@/assets/logo.png" />
            <v-card-text class="font-weight-black pt-8 ma-0 grey--text" style="font-size: 30px">奧米科技官網上稿系統</v-card-text>
          </v-col>
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <img alt height="65" width="78" src="@/static/icon_login_member-3.png" />
                <div style="color:white">會員登入</div>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="username"
                    prepend-icon="person"
                    type="text"
                    v-model="model.username"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="model.password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="login" :loading="loading">Login</v-btn>
                <!-- <v-btn color="primary" @click="callLogin" :loading="loading">Login</v-btn> -->
                <!-- {{formError}} -->
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar :timeout="2000" bottom right :color="snackbar.color" v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn dark @click.native="snackbar.show = false" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import uri from "@/api/uri";

export default {
  layout: "default",
  data: () => ({
    loading: false,
    model: {
      username: "",
      password: "",
      stats: ""
    },
    formError: "",
    snackbar: {
      show: false,
      text: "",
      color: ""
    }
  }),
  methods: {
    async login() {
      this.loading = true;
      // try {
      //   const data = await this.$store.dispatch("login", {
      //     username: this.model.username,
      //     password: this.model.password
      //   });
      //   if (window.sessionStorage.getItem("userInfo")) {
      //     this.$router.push("/audit/indexPage");
      //   }
      // } catch (e) {
      //   console.log(e.message);
      // }
      this.$router.push("/audit/indexPage");
      this.loading = false;
    }
  },
  computed: {
    snackbarStore() {
      return this.$store.state.snackbar;
    }
  },
  watch: {
    snackbarStore() {
      if (this.$store.state.snackbar.show) {
        this.snackbar.show = this.$store.state.snackbar.show;
        this.snackbar.text = this.$store.state.snackbar.text;
      }
    }
  }
};
</script>

<style scoped>
#login {
  width: 100%;
  position: absolute;
  /* background-image: url("../../static/6e48f04.jpg"); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #393d46;
}
</style>

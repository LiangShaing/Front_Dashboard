<template>
  <div id="info">
    <v-card-text>
      <v-col cols="12" class="d-lg-flex d-md-flex pa-1">
        <form-option title="切換使用者">
          <v-select
            :items="userAgents"
            v-model="cmUserId"
            item-text="cmUserName"
            item-value="cmUserId"
            label="請選擇"
            outlined
            dense
          ></v-select>
        </form-option>
        <v-btn dark color="primary" @click="changeUser" class="ma-1">確定</v-btn>
      </v-col>

      <v-divider :inset="false" class="ma-5"></v-divider>
      <v-card-title>基本資料</v-card-title>
      <v-col cols="12" class="d-lg-flex d-md-flex pa-1">
        <v-col sm="12" md="6" lg="6" class="pa-1">
          <form-option title="AD帳號">
            <div v-if="member" class="info-text">{{member.cmUserId}}</div>
          </form-option>

          <form-option title="中文姓名">
            <div v-if="member" class="info-text">{{member.cmUserName}}</div>
          </form-option>

          <form-option title="所屬單位">
            <div v-if="member" class="info-text">{{member.cmDeptDTO.cmDeptName}}</div>
          </form-option>

          <form-option title="角色">
            <div v-if="member" class="info-text">{{roleListToString(member.cmRoleDTOSet)}}</div>
          </form-option>
        </v-col>

        <v-col sm="12" md="6" lg="6" class="pa-1">
          <v-form v-model="valid" ref="form">
            <form-option title="代理人" class="mb-3">
              <v-select
                :items="agents"
                v-model="agent"
                item-text="cmUserName"
                item-value="cmUserId"
                label="請選擇"
                outlined
                dense
                :disabled="isAgent"
                :rules="requiredRules"
              ></v-select>
            </form-option>

            <date-picker
              @getDate="handleGetDate"
              startLabelText="代理起日"
              endLabelText="代理迄日"
              :disabled="isAgent"
              :defaultStartDate="date.startDate"
              :defaultEndDate="date.endDate"
              enableClear
              :limitStartDateMin="currentDate"
              :limitEndDateMin="currentDate"
              titleClass="mb-2"
              required
            ></date-picker>
          </v-form>
        </v-col>
      </v-col>

      <v-col class="d-lg-flex d-md-flex pa-5" cols="12">
        <v-btn color="primary" @click="save()" class="ma-1" :disabled="hideSettingAgentBtn">設定代理資訊</v-btn>
        <v-btn dark color="error" @click="remove()" class="ma-1" :disabled="removeAgentBtn">結束代理</v-btn>
      </v-col>
    </v-card-text>
  </div>
</template>

<script>
import dateUtil from "@/util/dateUtil";
export default {
  data: () => ({
    currentDate: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
    member: JSON.parse(window.sessionStorage.getItem("userInfo")),
    cmUserId: "",
    agent: "",
    isAgent: false,
    valid: true,
    requiredRules: [v => !!v || "↑不能為空"],
    agents: [],
    date: {
      startDate: "",
      endDate: ""
    },
    removeAgentBtn: true
  }),
  computed: {
    userAgents() {
      let arr = [];
      if (this.member) {
        arr = JSON.parse(
          JSON.stringify(this.member.cmAgentDTO.cmUserAgentDTOSet)
        );
        //自己塞入選項
        arr.splice(0, 0, {
          cmUserId: this.member.cmUserId,
          cmUserName: this.member.cmUserName
        });
      }

      return arr;
    },
    hideSettingAgentBtn() {
      let arr = [];
      if (this.member) {
        arr = JSON.parse(
          JSON.stringify(this.member.cmAgentDTO.cmUserAgentDTOSet)
        );
        if (arr.length > 0) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    async save() {
      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.dispatch("alert", "請檢查必填欄位");
        return;
      }
      const res = await this.$store.dispatch("actionApi", {
        method: "post",
        url: "api_agent",
        params: {
          cmUserId: this.cmUserId,
          cmAgentId: this.agent,
          cmAgentStart: dateUtil.formatDate2(this.date.startDate),
          cmAgentEnd: dateUtil.formatDate2(this.date.endDate)
        }
      });

      if (res !== null && res !== undefined) {
        this.$store.dispatch("alert", "設定代理人成功");
        this.isAgent = true;
        this.removeAgentBtn = false;

        const res2 = await this.$store.dispatch("actionApi", {
          method: "get",
          url: "api_menu_user"
        });

        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.setItem("userInfo", JSON.stringify(res2));
      } else {
        this.$store.dispatch("alert", "操作失敗");
      }
    },
    async remove() {
      if (this.member) {
        const res = await this.$store.dispatch("actionApi", {
          method: "put",
          url: "api_agent",
          params: {
            cmUserId: this.member.cmAgentDTO.cmUserId,
            cmAgentId: this.member.cmAgentDTO.cmAgentId,
            cmAgentStart: dateUtil.formatDate2(this.date.startDate),
            cmAgentEnd: dateUtil.formatDate2(this.date.endDate)
          }
        });

        if (res !== null && res !== undefined) {
          this.$store.dispatch("alert", "結束代理成功");
          this.$store.dispatch("setAgent", null);
          this.removeAgentBtn = true;
          this.isAgent = false;
          this.date.startDate = dateUtil.formatDateFun(
            "yyyy-MM-dd",
            new Date()
          );
          this.date.endDate = dateUtil.formatDateFun("yyyy-MM-dd", new Date());
          this.agent = "";

          window.sessionStorage.removeItem("agent");

          const res2 = await this.$store.dispatch("actionApi", {
            method: "get",
            url: "api_menu_user"
          });

          window.sessionStorage.removeItem("userInfo");
          window.sessionStorage.setItem("userInfo", JSON.stringify(res2));
          window.sessionStorage.removeItem("menu");
          window.sessionStorage.setItem(
            "menu",
            JSON.stringify(res2.cmMenuDTOMap)
          );
          await this.$store.dispatch("setMenu", res2.cmMenuDTOMap);
        }
      } else {
        this.$store.dispatch("alert", "操作失敗");
      }
    },
    handleGetDate(data) {
      this.date = data;
    },
    roleListToString(data) {
      let roles = "";
      data.forEach(role => {
        if (roles !== "") {
          roles = roles + ",";
        }
        roles = roles + role.cmRoleName;
      });

      return roles;
    },
    async getUser(deptId, roleId) {
      const res = await this.$store.dispatch("actionApi", {
        method: "get",
        url: "api_user",
        params: { cmDeptId: deptId, cmRoleId: roleId }
      });
      this.agents = [];

      if (res !== null && res !== undefined && this.member) {
        // 過濾自己
        res.forEach(ele => {
          if (ele.cmUserId !== this.member.cmUserId) {
            this.agents.push(ele);
          }
        });
      }
    },
    async changeUser() {
      if (this.cmUserId !== "") {
        const res = await this.$store.dispatch("actionApi", {
          method: "get",
          url: "api_agentPrivilege",
          params: { agentUserId: this.cmUserId }
        });
        if (res !== null && res !== undefined) {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.setItem("token", JSON.stringify(res.token));
          window.sessionStorage.removeItem("menu");
          window.sessionStorage.setItem(
            "menu",
            JSON.stringify(res.cmMenuDTOMap)
          );
          this.$store.dispatch("setMenu", res.cmMenuDTOMap);
          window.sessionStorage.removeItem("currentUser");
          let currentUser = null;
          // //切換回自己
          this.userAgents.forEach(ele => {
            if (ele.cmUserId === this.cmUserId) {
              currentUser = ele;
            }
          });
          window.sessionStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
          );
          this.$store.dispatch("currentUser", currentUser);
          this.$router.push("/audit/indexPage");
          // window.sessionStorage.setItem("agent", JSON.stringify(agent));
          // this.$store.dispatch("setAgent", agent);
        }
      }
    }
  },
  watch: {
    member() {
      if (this.member && this.member.cmAgentDTO.cmInAgent) {
        this.agent = this.member.cmAgentDTO.cmAgentId;
        this.isAgent = true;
      }
    }
  },
  created() {
    if (this.member) {
      this.getUser(this.member.cmDeptDTO.cmDeptId, "");
      //設定使用者為自己
      this.cmUserId = this.member.cmUserId;

      //正在代理別人
      if (this.member.cmAgentDTO.cmUserAgentDTOSet.length !== 0) {
        this.removeAgentBtn = true;
        this.isAgent = true;
      }

      // 正在被人代理
      if (this.member.cmAgentDTO.cmInAgent) {
        this.removeAgentBtn = false;
        this.isAgent = true;
        this.agent = this.member.cmAgentDTO.cmAgentId;
        this.date.startDate = dateUtil.parseDate2(
          this.member.cmAgentDTO.cmAgentStart
        );
        this.date.endDate = dateUtil.parseDate2(
          this.member.cmAgentDTO.cmAgentEnd
        );
      }
    }
  },
  mounted() {
    const current = JSON.parse(window.sessionStorage.getItem("currentUser"));
    if (current) {
      this.cmUserId = current.cmUserId;
    }
  }
};
</script>

<style lang="css" scoped>
.info-text {
  line-height: 50px;
}
</style>


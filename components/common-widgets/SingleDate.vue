
<template>
  <v-menu
    ref="menu1"
    :close-on-content-click="false"
    transition="scale-transition"
    maxWidth="290px"
    v-model="menu1"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :value="value"
        label="請選擇日期"
        v-on="on"
        :disabled="disabled"
        outlined
        dense
        :rules="dateRules"
        hint="格式 : YYYY-MM-DD"
        persistent-hint
        @keyup="handle($event.target.value)"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      scrollable
      @input="handle"
      :allowed-dates="(val)=>allowedDates(val)"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import dateUtil from "@/util/dateUtil";
import Util from "@/util/";
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowDate: {
      type: String,
      default: ""
    }
  },
  data: vm => ({
    menu1: false,
    date: dateUtil.formatDateFun("yyyy-MM-dd", new Date()),
    dateRules: [
      v => !!v || "↑不能為空",
      v => vm.valid(v) || "格式錯誤 : YYYY-MM-DD"
      //   v => vm.allowedDates(v) || "日期錯誤"
    ]
  }),
  methods: {
    valid(v) {
      if (!Util.isBlank(v)) {
        return /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(v);
      }
      return true;
    },
    handle(val) {
      if (this.valid(val)) {
        this.date = val;
        this.$emit("input", val);
      }
      this.menu1 = false;
    },
    allowedDates(val) {
      if (this.allowDate !== "") {
        let date = new Date();
        if (this.allowDate === "next") {
          date.setDate(date.getDate() - 1);
          return (
            Date.parse(val).valueOf() >= date.valueOf() ||
            Date.parse(val).valueOf() == Date.parse(this.value).valueOf()
          );
        } else if (this.allowDate === "past") {
          date.setDate(date.getDate() + 1);
          return (
            Date.parse(val).valueOf() <= date.valueOf() ||
            Date.parse(val).valueOf() == Date.parse(this.value).valueOf()
          );
        } else {
          return true;
        }
      }
      return true;
    }
  },
  watch: {
    value(val) {
      this.handle(val);
    }
  }
};
</script>

<style scoped>
</style>

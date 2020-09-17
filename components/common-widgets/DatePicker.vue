<template>
  <div id="datePicker" :class="flex?'d-flex':''">
    <form-option
      :title="startLabelText"
      :titleBg="titleBg"
      :titleWidth="titleWidth"
      :contentWidth="contentWidth"
      :rowHeight="rowHeight"
      :titleClass="titleClass"
    >
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        :max-width="maxWidth"
        :min-width="minWidth"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="startDate"
            :label="startLabelText"
            readonly
            v-on="on"
            :disabled="disabled"
            outlined
            dense
            :clearable="enableClear"
            @click:clear="handleClearStart"
            :rules="required?[ruleRequired]:[]"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="startDate"
          no-title
          scrollable
          :allowed-dates="allowedStartDates"
          :max="limitStartDateMax"
          :min="limitStartDateMin"
          @input="menu1 = false"
        ></v-date-picker>
      </v-menu>
    </form-option>
    <v-text-field
      v-if="enableTime"
      type="number"
      v-model="startTimeH"
      label="時"
      :disabled="disabled"
      outlined
      dense
      style="width:60px;padding-top:2px"
      class="ma-0"
      max="23"
      min="0"
    ></v-text-field>
    <v-text-field
      v-if="enableTime"
      type="number"
      v-model="startTimeM"
      label="分"
      :disabled="disabled"
      outlined
      dense
      style="width:60px;padding-top:2px"
      class="ma-0"
      max="59"
      min="0"
    ></v-text-field>

    <form-option
      :title="endLabelText"
      :titleBg="titleBg"
      :titleWidth="titleWidth"
      :contentWidth="contentWidth"
      :rowHeight="rowHeight"
      :titleClass="titleClass"
    >
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        :max-width="maxWidth"
        :min-width="minWidth"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="endDate"
            :label="endLabelText"
            readonly
            v-on="on"
            :disabled="disabled"
            outlined
            dense
            :clearable="enableClear"
            @click:clear="handleClearEnd"
            :rules="required?[ruleRequired]:[]"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="endDate"
          no-title
          scrollable
          :allowed-dates="allowedEndDates"
          :max="limitEndDateMax"
          :min="limitEndDateMin"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
    </form-option>
    <v-text-field
      v-if="enableTime"
      type="number"
      v-model="endTimeH"
      label="時"
      :disabled="disabled"
      outlined
      dense
      style="width:60px;padding-top:2px"
      class="ma-0"
      max="23"
      min="0"
    ></v-text-field>
    <v-text-field
      v-if="enableTime"
      type="number"
      v-model="endTimeM"
      label="分"
      :disabled="disabled"
      outlined
      dense
      style="width:60px;padding-top:2px"
      class="ma-0"
      max="59"
      min="0"
    ></v-text-field>
  </div>
</template>

<script>
import dateUtil from "@/util/dateUtil";
import Util from "@/util";
export default {
  components: {},
  props: {
    defaultStartDate: {
      type: String,
      default: ""
    },
    defaultEndDate: {
      type: String,
      default: ""
    },
    defaultStartTimeH: {
      type: String,
      default: "00"
    },
    defaultStartTimeM: {
      type: String,
      default: "00"
    },
    defaultEndTimeH: {
      type: String,
      default: "23"
    },
    defaultEndTimeM: {
      type: String,
      default: "59"
    },
    flex: {
      type: Boolean,
      default: false
    },
    dateType: {
      type: String,
      default: "AD"
    },
    minWidth: {
      type: String,
      default: "290px"
    },
    maxWidth: {
      type: String,
      default: "290px"
    },
    iconStyle: {
      type: String,
      default: "event"
    },
    startLabelText: {
      type: String,
      default: ""
    },
    endLabelText: {
      type: String,
      default: ""
    },
    titleBg: {
      type: String,
      default: "#e9ecef"
    },
    rowHeight: {
      ype: String,
      default: "50px"
    },
    titleWidth: {
      type: String,
      default: "20%"
    },
    contentWidth: {
      type: String,
      default: "80%"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    enableTime: {
      type: Boolean,
      default: false
    },
    enableClear: {
      type: Boolean,
      default: true
    },
    limitStartDateMax: {
      type: String,
      default: ""
    },
    limitStartDateMin: {
      type: String,
      default: ""
    },
    limitEndDateMax: {
      type: String,
      default: ""
    },
    limitEndDateMin: {
      type: String,
      default: ""
    },
    titleClass: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data: vm => ({
    ruleRequired: value => !!value || "↑不能為空.",
    menu1: false,
    menu2: false,
    startDate: Util.isEmpty(vm.defaultStartDate)
      ? ""
      : JSON.parse(JSON.stringify(vm.defaultStartDate)),
    endDate: Util.isEmpty(vm.defaultEndDate)
      ? ""
      : JSON.parse(JSON.stringify(vm.defaultEndDate)),
    startDateFormatted: "",
    endDateFormatted: "",
    startTimeHFormatted: JSON.parse(JSON.stringify(vm.defaultStartTimeH)),
    startTimeMFormatted: JSON.parse(JSON.stringify(vm.defaultStartTimeM)),
    endTimeHFormatted: JSON.parse(JSON.stringify(vm.defaultEndTimeH)),
    endTimeMFormatted: JSON.parse(JSON.stringify(vm.defaultEndTimeM))
  }),
  methods: {
    getData() {
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime:
          this.startTimeHFormatted + ":" + this.startTimeMFormatted + ":00",
        endTime: this.endTimeHFormatted + ":" + this.endTimeMFormatted + ":00"
      });
    },
    handleClearStart() {
      this.startDate = "";
      this.startTimeHFormatted = "00";
      this.startTimeMFormatted = "00";
    },
    handleClearEnd() {
      this.endDate = "";
      this.endTimeHFormatted = "00";
      this.endTimeMFormatted = "00";
    },
    formatDate(date) {
      if (this.dateType === "ERA") {
        return dateUtil.formatDate(date);
      } else {
        return date;
      }
    },
    allowedStartDates(val) {
      if (this.endDate !== null && this.endDate !== "") {
        return Date.parse(val).valueOf() <= Date.parse(this.endDate).valueOf();
      }
      return true;
    },
    allowedEndDates(val) {
      if (this.startDate !== null && this.startDate !== "") {
        return (
          Date.parse(val).valueOf() >= Date.parse(this.startDate).valueOf()
        );
      }
      return true;
    },
    clearCondition() {
      this.startDate = "";
      this.startTimeHFormatted = "00";
      this.startTimeMFormatted = "00";
      this.endDate = "";
      this.endTimeHFormatted = "23";
      this.endTimeMFormatted = "59";
    }
  },
  watch: {
    startDate(val) {
      this.startDateFormatted = this.formatDate(this.startDate);
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime:
          this.startTimeHFormatted + ":" + this.startTimeMFormatted + ":00",
        endTime: this.endTimeHFormatted + ":" + this.endTimeMFormatted + ":00"
      });
    },
    endDate(val) {
      this.endDateFormatted = this.formatDate(this.endDate);
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime:
          this.startTimeHFormatted + ":" + this.startTimeMFormatted + ":00",
        endTime: this.endTimeHFormatted + ":" + this.endTimeMFormatted + ":00"
      });
    },
    startTimeHFormatted() {
      let hour = Number(this.startTimeHFormatted);
      if (hour < 10) {
        hour = "0" + hour;
        this.startTimeHFormatted = hour;
      }
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime: hour + ":" + this.startTimeMFormatted + ":00",
        endTime: this.endTimeHFormatted + ":" + this.endTimeMFormatted + ":00"
      });
    },
    startTimeMFormatted() {
      let min = Number(this.startTimeMFormatted);
      if (min < 10) {
        min = "0" + min;
        this.startTimeMFormatted = min;
      }
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime: this.startTimeHFormatted + ":" + min + ":00",
        endTime: this.endTimeHFormatted + ":" + this.endTimeMFormatted + ":00"
      });
    },
    endTimeHFormatted() {
      let hour = Number(this.endTimeHFormatted);
      if (hour < 10) {
        hour = "0" + hour;
        this.endTimeHFormatted = hour;
      }
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime:
          this.startTimeHFormatted + ":" + this.startTimeMFormatted + ":00",
        endTime: hour + ":" + this.endTimeMFormatted + ":00"
      });
    },
    endTimeMFormatted() {
      let min = Number(this.endTimeMFormatted);
      if (min < 10) {
        min = "0" + min;
        this.endTimeMFormatted = min;
      }
      this.$emit("getDate", {
        startDate: this.startDate,
        endDate: this.endDate,
        startTime:
          this.startTimeHFormatted + ":" + this.startTimeMFormatted + ":00",
        endTime: this.endTimeHFormatted + ":" + min + ":00"
      });
    },
    defaultStartDate() {
      this.startDate = Util.isEmpty(this.defaultStartDate)
        ? ""
        : JSON.parse(JSON.stringify(this.defaultStartDate));
    },
    defaultEndDate() {
      this.endDate = Util.isEmpty(this.defaultEndDate)
        ? ""
        : JSON.parse(JSON.stringify(this.defaultEndDate));
    },

    defaultStartTimeH() {
      this.startTimeHFormatted = Util.isEmpty(this.defaultStartTimeH)
        ? ""
        : JSON.parse(JSON.stringify(this.defaultStartTimeH));
    },
    defaultStartTimeM() {
      this.startTimeMFormatted = Util.isEmpty(this.defaultStartTimeM)
        ? ""
        : JSON.parse(JSON.stringify(this.defaultStartTimeM));
    },
    defaultEndTimeH() {
      this.endTimeHFormatted = Util.isEmpty(this.defaultEndTimeH)
        ? ""
        : JSON.parse(JSON.stringify(this.defaultEndTimeH));
    },
    defaultEndTimeM() {
      this.endTimeMFormatted = Util.isEmpty(this.endTimeMFormatted)
        ? ""
        : JSON.parse(JSON.stringify(this.defaultEndTimeM));
    }
  },
  computed: {
    startTimeH: {
      get: function() {
        return this.startTimeHFormatted;
      },
      set: function(newValue) {
        let hour = Number(newValue);
        if (hour > 23) {
          this.$store.dispatch("alert", "限制最高設置23");
          this.startTimeHFormatted = "00";
        } else {
          this.startTimeHFormatted = hour;
        }
      }
    },
    startTimeM: {
      get: function() {
        return this.startTimeMFormatted;
      },
      set: function(newValue) {
        let min = Number(newValue);
        if (min > 59) {
          this.$store.dispatch("alert", "限制最高設置59");
          this.startTimeMFormatted = "00";
        } else {
          this.startTimeMFormatted = min;
        }
      }
    },
    endTimeH: {
      get: function() {
        return this.endTimeHFormatted;
      },
      set: function(newValue) {
        let hour = Number(newValue);
        if (hour > 23) {
          this.$store.dispatch("alert", "限制最高設置23");
          this.endTimeHFormatted = "00";
        } else {
          this.endTimeHFormatted = hour;
        }
      }
    },
    endTimeM: {
      get: function() {
        return this.endTimeMFormatted;
      },
      set: function(newValue) {
        let min = Number(newValue);
        if (min > 59) {
          this.$store.dispatch("alert", "限制最高設置59");
          this.endTimeMFormatted = "00";
        } else {
          this.endTimeMFormatted = min;
        }
      }
    }
  }
};
</script>
<style scoped>
.textCenter {
  line-height: 50px;
}
</style>
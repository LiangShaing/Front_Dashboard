<template>
  <div id="docReview" class="d-flex">
    <v-radio-group
      v-model="form.docReview"
      :mandatory="false"
      row
      class="pa-1 ma-1"
      :disabled="disabled"
    >
      <v-radio :value="caseEnum.docReview_y" label="須文審"></v-radio>
      <v-radio :value="caseEnum.docReview_n" label="不須文審"></v-radio>
    </v-radio-group>
    <div v-if="form.docReview===caseEnum.docReview_y" style="width:200px">
      <v-text-field
        outlined
        dense
        type="text"
        v-model="form.docReviewNo"
        placeholder
        :disabled="disabled"
        label="請填文宣審核字號"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import { caseEnum } from "@/api/enum";
export default {
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: {}
    }
  },
  data: vm => ({
    caseEnum: JSON.parse(JSON.stringify(caseEnum))
  }),
  methods: {},
  watch: {},
  created() {},
  mounted() {}
};
</script>

<style >
#docReview .v-input--radio-group__input {
  height: 50px;
}
</style>>


<template>
  <div id="profileDialog">
    <v-dialog v-model="dialog" :max-width="profileWidth">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <slot name="open-dialog"></slot>
        </div>
      </template>

      <v-card>
        <v-card-title v-if="enableTitle" class="titleStyle">{{title}}</v-card-title>

        <v-container v-if="dialog" class="justify-center">
          <slot name="dialog-content"></slot>
        </v-container>

        <v-card-actions class="justify-center">
          <div class="actionStyle" @click="dialog = false">
            <slot name="dialog-close"></slot>
          </div>
          <div class="actionStyle" @click="dialog = false">
            <slot name="dialog-save"></slot>
          </div>
          <div class="actionStyle" @click="dialog = false">
            <slot name="dialog-audit"></slot>
          </div>
          <div class="actionStyle" @click="dialog = false">
            <slot name="dialog-reject"></slot>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    profileWidth: {
      type: String,
      default: "auto"
    },
    enableTitle: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    toggle(value) {
      this.dialog = value;
    }
  },
  computed: {}
};
</script>
<style >
.titleStyle {
  border-bottom: 1px solid #e3e3e3 !important;
}
.cardStyle {
  margin: 5px;
}
.actionStyle {
  margin: 5px;
}

.v-dialog__container {
  display: initial !important;
  vertical-align: middle;
}
</style>
<template>
  <div :class="titleClass" class="pa-0 ma-0">
    <v-layout class="rowHeight" :style="{width:rowWidth,height:rowHeight}">
      <div class="titleStyle"  :style="{width:titleWidth,backgroundColor:titleBg}">
        <v-icon v-if="icon!=''">{{icon}}</v-icon>
        {{title}}
      </div>
      <div :style="{width:contentWidth}" :class="contentClass">
        <slot></slot>
      </div>
    </v-layout>


    <v-btn v-if="enEventButton" class="ma-2" outlined color="green" @click="handleClick" :disabled="disabled">
      <v-icon>{{buttonIcon}}</v-icon>
      {{buttonText}}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    enEventButton: {
      type: Boolean,
      default: false
    },
    buttonIcon: {
      type: String,
      default: "playlist_add"
    },
    buttonText: {
      type: String,
      default: "新增"
    },
    title: {
      type: String
    },
    rowWidth: {
      type: String,
      default: "auto"
    },
    titleWidth: {
      type: String,
      default: "20%"
    },
    contentWidth: {
      type: String,
      default: "80%"
    },
    titleBg: {
      type: String,
      default: "#e9ecef"
    },
    icon: {
      type: String
    },
    rowHeight: {
      ype: String,
      default: "50px"
    },
    titleClass: {
      type: String,
      default: ""
    },
    contentClass: {
      type: String,
      default: ""
    },
    disabled:{
      type: Boolean,
      default: false
    }
  },

  data: vm => ({}),
  methods: {
    handleClick() {
      this.$emit("click");
    }
  },
  computed: {}
};
</script>
<style scoped>
.titleStyle {
  min-width: 80px;
  /* width: ; */
  color: #495057;
  /* background-color: #e9ecef; */
  border-radius: 2px;
  margin: 0px 5px 0px 5px;
  text-align: center;
  line-height: 50px;
  max-height: 50px;
  /* font-size: 1.2em; */
}
.rowHeight {
  /* max-height: 50px; */
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}

.container.grid-list-lg .layout:only-child {
  margin: 0px !important;
}
</style>

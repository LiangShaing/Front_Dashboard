<template>
  <div id="tab">
    <v-toolbar tabs flat>
      <template>
        <v-tabs v-model="tab">
          <v-tab v-for="item in tabItems" :key="item.id" :href="'#tab-' + item.id">
            <div>{{ item.name }}</div>
            <v-btn v-if="item.click" icon @click="action('remove',item.id)">
              <v-icon color="error">close</v-icon>
            </v-btn>
          </v-tab>
          <v-btn v-if="add" icon @click="action('add','')" class="mt-2">
            <v-icon color="green">add</v-icon>
          </v-btn>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, index) in tabItems" :key="index" :value="'tab-' + item.id">
        <slot ></slot>
        <!-- <slot :name="item.id"></slot> -->
        <!-- <slot ></slot> -->
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    defaultTabNumber: {
      type: Number,
      default: 0
    },
    tabColor: {
      type: String,
      default: "#f3f3f3"
    },
    sliderColor: {
      type: String,
      default: "blue"
    },
    tabItems: {
      type: Array,
      default: null
    },
    add: {
      type: Boolean,
      default: false
    }
  },

  data: vm => ({
    // tab: vm.defaultTabNumber
    tab: 'tab-tab0'
  }),
  computed: {},
  methods: {
    action(action,data) {
      this.$emit(action, data);
    }
  },
  watch:{
    tab(){
      this.$emit('changeTab', this.tab);
    }
  }
};
</script>
<style scoped>

.theme--light.v-toolbar.v-sheet {
  background-color: #f2f8f9;
}

.theme--light.v-tabs-items {
  background-color: #f2f8f9;
}
/* .cardStyle {
  padding: 5px;
} */
</style>
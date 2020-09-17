<template>
  <v-navigation-drawer
    id="appDrawer"
    :mini-variant.sync="mini"
    fixed
    :dark="$vuetify.dark"
    app
    v-model="drawer"
    width="280"
  >
    <v-toolbar color="#fff" flat dark>
      <v-toolbar-title class="ml-0 pl-3"></v-toolbar-title>
    </v-toolbar>

    <v-list class="menuStyle itemStyle">
      <template v-for="(item) in menus">
        <v-list-group v-if="item.items" :key="item.title" v-model="item.active" no-action>
          <template v-slot:activator>
            <v-list-item :to="item.href? item.href : null" class="gropStyle">
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(subItem,index) in item.items"
            :key="subItem.title"
            :to="subItem.href? subItem.href : null"
            :title="subItem.title"
          >
            <v-list-item-content :key="subItem+index">
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :to="item.href ? item.href : null" :key="item.title">
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import menu from "@/api/mock/menu";

export default {
  name: "app-drawer",
  components: {},
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    mini: false,
    menus: menu,
    menuData: window.sessionStorage.getItem("menu"),
    // menus: [],
    scrollSettings: {
      maxScrollbarLength: 160
    }
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("drawer", val);
      }
    },
    computeGroupActive() {
      return true;
    },
    sideToolbarColor() {
      return this.$vuetify.options.extra.sideNav;
    },
    storeMenuData() {
      return this.$store.state.menus;
    }
  },
  methods: {
    genChildTarget(item, subItem) {
      if (subItem.href) return;
      if (subItem.component) {
        return {
          name: subItem.component
        };
      }
      return { name: `${item.group}/${subItem.name}` };
    },
    binarySearch(ar, el, compare_fn) {
      if (el.cmMenuOrder < ar[0].cmMenuOrder) return 0;
      if (el.cmMenuOrder > ar[ar.length - 1].cmMenuOrder) return ar.length;
      var m = 0;
      var n = ar.length - 1;
      // while (m <= n) {
      //   var k = (n + m) >> 1;
      //   var cmp = compare_fn(el, ar[k]);
      //   if (cmp > 0) {
      //     m = k + 1;
      //   } else if (cmp < 0) {
      //     n = k - 1;
      //   } else {
      //     return k;
      //   }
      // }
      // return -m - 1;
      while (m <= n) {
        var cmp = compare_fn(el, ar[m]);
        if (cmp) {
          m = m + 1;
        } else {
          return m;
        }
      }
    },
    comp(a, b) {
      return a["cmMenuOrder"] > b["cmMenuOrder"];
    },
    updateMenu(data) {
      if (data) {
        let result = [];
        const menuObj = {
          title: "",
          group: "apps",
          icon: "",
          href: "",
          cmMenuOrder: ""
        };
        Object.keys(data).forEach(key => {
          const obj = data[key];
          let newObj = JSON.parse(JSON.stringify(menuObj));
          newObj.title = obj.cmMenuName;
          newObj.icon = obj.cmMenuIcon;
          newObj.href = obj.cmMenuUrl;
          newObj.cmMenuOrder = obj.cmMenuOrder;

          if (obj.cmMenuDTOMap) {
            let subResult = [];
            let newSubObj = JSON.parse(JSON.stringify(menuObj));
            Object.keys(obj.cmMenuDTOMap).forEach(subKey => {
              const subObj = obj.cmMenuDTOMap[subKey];
              let newSubObj = JSON.parse(JSON.stringify(menuObj));
              newSubObj.title = subObj.cmMenuName;
              newSubObj.icon = subObj.cmMenuIcon;
              newSubObj.href = subObj.cmMenuUrl;
              newSubObj.cmMenuOrder = subObj.cmMenuOrder;

              if (subResult.length === 0) {
                subResult.push(newSubObj);
              } else {
                subResult.splice(
                  this.binarySearch(subResult, newSubObj, this.comp),
                  0,
                  newSubObj
                );
              }
            });

            if (subResult.length !== 0) {
              newObj.items = subResult;
            }
          }

          if (result.length === 0) {
            result.push(newObj);
          } else {
            result.splice(
              this.binarySearch(result, newObj, this.comp),
              0,
              newObj
            );
          }
        });

        this.menus = result;
      }
    }
  },
  watch: {
    storeMenuData() {
      // this.updateMenu(this.storeMenuData);
    }
  },
  mounted() {
    // this.updateMenu(this.storeMenuData);
  }
};
</script>


<style lang="stylus">
#appDrawer {
  font-family: 'Microsoft JhengHei', sans-serif !important;
  overflow: hidden;
  background-color: #393d46;

  .drawer-menu--scroll {
    height: calc(100vh - 48px);
    overflow: auto;
  }

  .v-list-item__title,.v-list-item__icon i {
    color: #ffffff;
  }
}

.itemStyle {
  padding: 0px !important;
  position: initial;
}

.gropStyle {
  padding: 0px !important;
  position: initial !important;
}

.v-application a {
  color: #1976d2 !important;
}
</style>
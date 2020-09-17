export default async function ({ store, route, error, redirect }) {
  // const userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
  // const currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
  // const token = JSON.parse(window.sessionStorage.getItem("token"));
  // const menu = JSON.parse(window.sessionStorage.getItem("menu"));
  // const agent = JSON.parse(window.sessionStorage.getItem("agent"));

  // //登出 清除seesion 導向登入頁
  if (route.path.indexOf("/audit/logout") !== -1) {
    window.sessionStorage.removeItem("userInfo");
    window.sessionStorage.removeItem("currentUser");
    window.sessionStorage.removeItem("token");
    // window.sessionStorage.removeItem("refresh_token");
    window.sessionStorage.removeItem("menu");
    window.sessionStorage.removeItem("agent");
    store.commit("LOADING", false);
    store.commit("SET_AGENT", null);
    store.commit("SET_USER", null);
    store.commit("SET_CURRENT_USER", null);
    store.commit("SET_MENU", []);
    return redirect('/audit/login')
  }

  // if (userInfo === null && route.path.indexOf("/audit/login") === -1) {
  //   alert("您已登出，請重新登入")
  //   return redirect('/audit/login')

  // }

  // else if (userInfo === null && route.path.indexOf("/audit/login") !== -1) {
  //   return
  // }
  // else if (route.path.indexOf("/audit/login") !== -1 && userInfo) {
  //   return redirect('/audit/indexPage')
  // }


  // if (userInfo && !store.state.userInfo) {
  //   await store.dispatch('userInfo', userInfo);
  // }

  // if (currentUser) {
  //   await store.dispatch('currentUser', currentUser);
  // }


  // if (token) {
  //   await store.dispatch('token', token);
  // }

  // if (agent) {
  //   await store.dispatch('setAgent', agent);
  //   //目前有代理人代理 將menu拿除
  //   await store.dispatch('setMenu', []);
  //   // 被代理中如果只有其他功能網址一律導回indexpage
  //   if (route.path.indexOf("/audit/indexPage") === -1) {
  //     alert("目前被代理中，無法使用其他功能")
  //     return redirect('/audit/indexPage')
  //   }
  // }

  // if (menu && !agent) {
  //   if(!store.state.menus || store.state.menus.length===0){
  //     await store.dispatch('setMenu', menu);
  //   }
  //   let bln = false
  //   Object.keys(menu).forEach(async (key) => {
  //     let obj1 = menu[key];
  //     if (obj1.cmMenuUrl !== "" && route.path.indexOf(obj1.cmMenuUrl) !== -1) {
  //       bln = true;
  //       await store.dispatch('setCurrentPageAuth', obj1.levelSet);
  //       return
  //     } else if (obj1.cmMenuDTOMap) {
  //       Object.keys(obj1.cmMenuDTOMap).forEach(async (subKey) => {
  //         let obj2 = obj1.cmMenuDTOMap[subKey];

  //         if (obj2.cmMenuUrl !== "" && route.path.indexOf(obj2.cmMenuUrl) !== -1) {
  //           bln = true;
  //           await store.dispatch('setCurrentPageAuth', obj2.levelSet);
  //           return

  //         } else if (obj2.cmMenuDTOMap) {
  //           Object.keys(obj2.cmMenuDTOMap).forEach(async (sub2Key) => {
  //             let obj3 = obj2.cmMenuDTOMap[sub2Key];
  //             if (obj3.cmMenuUrl !== "" && route.path.indexOf(obj3.cmMenuUrl) !== -1) {
  //               bln = true;
  //               await store.dispatch('setCurrentPageAuth', obj3.levelSet);
  //               return

  //             }

  //           })

  //         }

  //       })

  //     }

  //   })
  //   // 不須權限路徑
  //   let passUrl = ["/audit/login", "/audit/logout", "/audit/indexPage","/audit/ckeditorFile"]
  //   passUrl.forEach(ele => {
  //     if (route.path.indexOf(ele) !== -1) {
  //       bln = true
  //     }
  //   })
  //   //請求路徑不在menu中
  //   if (!bln) {
  //     alert("權限不足，無法使用此功能")
  //     return redirect('/audit/indexPage')
  //   }
  // }


}
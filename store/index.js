import axios from "@/util/axios"
import uri from "@/api/uri"


export const state = () => ({
  currentPageAuth: [],
  currentUser: null,
  userInfo: null,
  token: "",
  drawer: true,
  authUser: null,
  snackbar: {
    show: false,
    text: "",
    color: ""
  },
  loading: false,
  dept: [],
  currency: null,
  menus: [],
  agent: null
})

export const mutations = {
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  drawer(state, val) {
    state.drawer = val
  },
  SET_CURRENCY(state, currency) {
    state.currency = currency
  },
  SET_CURRENT_PAGE_AUTH(state, auths) {
    state.currentPageAuth = auths
  },
  SET_USER(state, data) {
    state.userInfo = data
  },
  SET_CURRENT_USER(state, data) {
    state.currentUser = data
  },
  SET_TOKEN(state, data) {
    state.token = data
  },
  SET_MENU(state, data) {
    state.menus = data
  },
  SET_DEPT(state, dept) {
    state.dept = dept
  },
  SET_AGENT(state, agent) {
    state.agent = agent
  },
  LOADING(state, loading) {
    state.loading = loading
  },
  ALERT(state, text) {
    state.snackbar = {
      show: true,
      text: text
    }
  }
}

export const actions = {
  async userInfo({ commit }, data) {
    if (data) {
      commit('SET_USER', data)
    }
  },
  async currentUser({ commit }, data) {
    if (data) {
      commit('SET_CURRENT_USER', data)
    }
  },
  async token({ commit }, data) {
    if (data) {
      commit('SET_TOKEN', data)
    }
  },

  async loading({ commit }, { bln }) {
    commit('LOADING', bln)
  },

  async alert({ commit }, text) {
    commit('ALERT', text)
  },

  async setMenu({ commit }, menus) {
    commit('SET_MENU', menus)
  },

  async setAgent({ commit }, agent) {
    commit('SET_AGENT', agent)
  },
  async setCurrentPageAuth({ commit }, auths) {
    commit('SET_CURRENT_PAGE_AUTH', auths)
  },


  async login({ commit }, { username, password }) {
    commit('LOADING', true)
    try {

      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      //oauth login
      // formData.append('grant_type', 'password')
      // const res = await axios.post(uri.login, formData, {
      //   auth: {
      //     username: 'yuantalife',
      //     password: 'mySecret'
      //   }
      // })
      // if (res.status === 200 && res.data.access_token) {
      //   window.sessionStorage.setItem('token', JSON.stringify(res.data.access_token))
      //   window.sessionStorage.setItem('refresh_token', JSON.stringify(res.data.refresh_token))
      //   const resUserInfo = await axios.get(uri.menu_user, { headers: { "Authorization": "Bearer " + res.data.access_token } })
      //   if (resUserInfo !== null && resUserInfo.status === 200) {
      //     const userInfo = resUserInfo.data;
      //     window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

      //     window.sessionStorage.setItem('menu', JSON.stringify(resUserInfo.data.cmMenuDTOMap))
      //     if (resUserInfo.data.cmAgentDTO.cmInAgent) {
      //       window.sessionStorage.setItem('agent', JSON.stringify(resUserInfo.data.cmAgentDTO))
      //     }

      //    window.sessionStorage.setItem('currentUser', JSON.stringify({ cmUserId: userInfo.cmUserId, cmUserName: userInfo.cmUserName }))
      //   }

      // }

      //general login
      const res = await axios.post(uri.login, formData)
      if (res.status === 200 && res.data.success) {
        const userInfo = res.data.data;
        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        window.sessionStorage.setItem('token', JSON.stringify(res.data.accessToken))
        window.sessionStorage.setItem('menu', JSON.stringify(res.data.data.cmMenuDTOMap))
        // 正在被別人代理
        if (res.data.data.cmAgentDTO.cmInAgent) {
          window.sessionStorage.setItem('agent', JSON.stringify(res.data.data.cmAgentDTO))
        }
        window.sessionStorage.setItem('currentUser', JSON.stringify({ cmUserId: userInfo.cmUserId, cmUserName: userInfo.cmUserName }))
      }
      commit('LOADING', false)
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.status === 401) {
        // throw new Error('Bad credentials')
        window.sessionStorage.removeItem('userInfo')
        window.sessionStorage.removeItem('currentUser')
        window.sessionStorage.removeItem('agent')
        commit('ALERT', "帳號密碼錯誤")
      } else {
        commit('ALERT', "連線逾時")
      }
      commit('LOADING', false)
    }
  },

  // async logout({ commit }) {
  //   await axios.post('/api/logout')
  //   commit('SET_USER', null)
  // },

  async getCheckFileName({ commit }, { fileNameList }) {
    commit('LOADING', true)
    try {
      let res = null
      let value = ""
      fileNameList.forEach((str, index) => {
        if (value !== "" && (fileNameList.length) > index) {
          value = value + ','
        }
        value = value + str
      })
      if (value !== "") {
        res = await axios.get(uri.api_resources_temp_rest_findByFileNameIn, {
          params: { filesNames: value },
        })
      }
      if (res && res.status === 200) {
        return res.data
      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getCheckReservaionFileName({ commit }, fileNameList) {
    commit('LOADING', true)
    try {
      let res = null
      if (fileNameList.fileNameList.length !== 0) {
        res = await axios.post(uri.api_reservation_resources_temp, fileNameList)
      }
      if (res && res.status === 200) {
        return res.data
      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getCheckFormFileName({ commit }, fileNameList) {
    commit('LOADING', true)
    try {
      let res = null
      if (fileNameList.fileNameList.length !== 0) {
        res = await axios.post(uri.api_form_resources_temp, fileNameList)
      }
      if (res && res.status === 200) {
        return res.data
      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getCurrency({ commit }, { params }) {
    commit('LOADING', true)
    try {
      const res = await axios.get(uri.api_currency_rest,
        { params: params })
      if (res.status === 200) {
        return res.data._embedded.aboutCurrencyTemps
      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }

  },

  async getResource({ commit }) {
    commit('LOADING', true)
    try {
      const res = await axios.get(uri.api_resources_temp_rest)
      if (res.status === 200) {
        let arr = [];
        res.data._embedded.resourcesTemps.forEach(ele => {
          arr.push({ text: ele.fileName, value: ele.fileName });
        });
        return arr;

      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getReservationResource({ commit }) {
    commit('LOADING', true)
    try {
      const res = await axios.get(uri.api_reservation_resources_temp_rest_findByQuery)
      if (res.status === 200) {
        let arr = [];
        res.data.forEach(ele => {
          arr.push({ text: ele.fileName, value: ele.uid });
        });
        return arr;
      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getFormResource({ commit }) {
    commit('LOADING', true)
    try {
      const res = await axios.get(uri.api_form_resources_temp_findByQuery)
      if (res.status === 200) {
        let arr = [];
        res.data.forEach(ele => {
          arr.push({ text: ele.fileName, value: ele.uid });
        });
        return arr;

      } else {
        throw res
      }
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getDept({ commit }) {
    commit('LOADING', true)
    try {
      const res = await axios.get(uri.api_dept)
      if (res.status !== 200) {
        throw res;
      }
      return res.data
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getRole({ commit }, { cmDeptId }) {
    commit('LOADING', true)
    try {
      const res = await axios.get(uri.role, { params: { cmDeptId: cmDeptId } })
      if (res.status !== 200 || res.data.success) {
        throw res
      }
      return res.data.data;
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async actionApi({ commit }, { method, url, params, restParam }) {
    commit('LOADING', true)
    try {
      let appendUrl = restParam ? restParam : "";
      let res = null

      const obj = {
        get: { params: params },
        delete: { data: params },
        post: params,
        put: params
      }
      res = await axios[method](uri[url] + appendUrl, obj[method])
      if (res === null || (res.status.toString().substring(0, 1) !== '2')) {
        throw res
      }
      return res.data;
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

  async getExportExcel({ commit }, { url, params }) {
    commit('LOADING', true)
    try {
      const res = await axios.post(uri[url], params, {
        responseType: "arraybuffer"
      })
      if (res.status !== 200) {
        throw res
      }
      return res.data;
    } catch (error) {
      console.error('error data:', error.response.data)
    } finally {
      commit('LOADING', false)
    }
  },

}





import router from '@/router'

const userLoginStatus = {
  namespaced: true,
  state: {
    user: '',
    token: '',
  },
  getters: {
    user(state) {
      return state.user
    },
    token(state) {
      return state.token
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    authorize(state, data) {
      state.token = data.Token.token
      state.user = data.User
    },
    unauthorize(state) {
      state.token = ''
      state.user = ''
      window.localStorage.removeItem('vuex')
      router.push({ path: '/' })
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    authorize({ commit }, data) {
      commit('authorize', data)
    },
    unauthorize({ commit }) {
      commit('unauthorize')
    }
  }
}

export default userLoginStatus

import router from '@/router'

const adminLoginStatus = {
  namespaced: true,
  state: {
    token: '',
  },
  getters: {
    token(state) {
      return state.token
    }
  },
  mutations: {
    authorize(state, token) {
      state.token = token
    },
    unauthorize(state) {
      state.token = ''
      window.localStorage.removeItem('vuex')
      router.push({ path: '/' })
    }
  },
  actions: {
    authorize({ commit }, token) {
      commit('authorize', token)
    },
    unauthorize({ commit }) {
      commit('unauthorize')
    }
  }
}

export default adminLoginStatus

const flashMessage = {
  namespaced: true,
  state: {
    contents: ''
  },
  getters: {
    getFlashMessage(state) {
      return state.contents
    },
    
  },
  mutations: {
    set(state, data) {
      state.contents = data

      setTimeout(() => (state.contents = ''), 3000)
    },
  },
  actions: {
    set({ commit }, data) {
      commit('set', data)
    }
  }
}

export default flashMessage

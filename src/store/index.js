import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import userLoginStatus from './modules/userLoginStatus'
import adminLoginStatus from './modules/adminLoginStatus'
import flashMessage from './modules/flashMessage'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    adminLoginStatus,
    flashMessage,
    userLoginStatus
  },
  plugins: [createPersistedState(
    {
      key: 'japaneseLangualgeLab',
      paths: [
        'userLoginStatus.token',
        'userLoginStatus.user',
        'adminLoginStatus.token'
      ],
      storage: window.sessionStorage
    }
  )]
})

export default store

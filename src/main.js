import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import { commonAxios, userAxios, adminAxios } from '@/http/index'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import VueCalendarHeatmap from 'vue-calendar-heatmap'
import Mixin from './mixins/globalMethods'

Vue.mixin(Mixin)
Vue.config.productionTip = false
Vue.use(VueAxios, axios, VueCalendarHeatmap)
Vue.prototype.$axios = commonAxios
Vue.prototype.$userHttp = userAxios
Vue.prototype.$adminHttp = adminAxios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>'
})

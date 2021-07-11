import axios from 'axios'
import store from '../store'
import router from '../router/index'

axios.defaults.baseURL = 'http://localhost:1323'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

const commonAxios = axios.create({
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json;charset=utf-8',
  }
})

const userAxios = axios.create({
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json;charset=utf-8'
  }
})

userAxios.interceptors.request.use((config) => {
  const userToken = store.state.userLoginStatus.token
  if (userToken) {
    config.headers.common['Authorization'] = `Bearer ${userToken}`
    return config
  } else {
    alert("you are not logged in")
    router.push({ path: '/home' })
    throw new axios.Cancel('Not authorized')
  }
})

userAxios.interceptors.response.use(function (response) {
    if (response.message == "Invalid or Expired Token" || response.message == "missing or malformed jwt") {
      store.dispatch('userLoginStatus/unauthorize')
      router.push('/auth/login')
    }
    return response
  }, function (error) {
    return Promise.reject(error)
})

const adminAxios = axios.create({
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json;charset=utf-8'
  }
})
adminAxios.interceptors.request.use(function (config) {
  const adminToken = store.state.adminLoginStatus.token
  if (adminToken) {
    config.headers.common['Authorization'] = `Bearer ${adminToken}`
    return config
  } else {
    router.push({ path: '/admin_login' })
    // store.dispatch('flashMessage/setFlashMessage', 'you are not logged in')
    throw new axios.Cancel('Not authorized')
  }
})

adminAxios.interceptors.response.use(function (response) {
  if (response.message == "Invalid or Expired Token" || response.message == "missing or malformed jwt") {
    store.dispatch('adminrLoginStatus/unauthorize')
    router.push('/admin_login')
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
export { commonAxios, userAxios, adminAxios }

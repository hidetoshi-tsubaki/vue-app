import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Root from '../views/root'
import Dashboard from '../views/user/dashboard'
import userRoutes from './user-routes/user-routes'
import userQuizRoutes from './user-routes/quiz-routes'
import adminLogin from '../views/admin/auth/login'
import AdminHome from '../views/admin/home'
import AdminEdit from '../views/admin/edit'
import QuizRoutes from './admin-routes/quiz-routes'
import QuizTitleRoutes from './admin-routes/quiz-title-routes'
import QuizSectionRoutes from './admin-routes/quiz-section-routes'
import QuizLevelRoutes from './admin-routes/quiz-level-routes'
import UserRoutes from './admin-routes/user-routes'

Vue.use(Router)

const nestTemplate = { template: '<router-view/>' }

const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Root,
      beforeEnter: (to, from, next) => {
        if (store.state.userLoginStatus.token) {
          next('/home')
        } else if (store.state.adminLoginStatus.token) {
          next('/admin')
        } else {
          next()
        }
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeRouteEnter: (to, from, next) => {
        if (store.state.userLoginStatus.token) {
          alert('you are already logged in')
          next('/')
        } else {
          next()
        }
      }
    },
    { ...userRoutes },
    { ...userQuizRoutes },
    {
      path: '/admin_login',
      name: 'adminLogin',
      component: adminLogin,
      beforeEnter: (to, from, next) => {
        if (store.state.adminLoginStatus.token) {
          next('/admin/home')
        } else {
          next()
        }
      }
    },
    {
      path: '/admin',
      component: nestTemplate,
      children: [
        {
          path: 'home',
          name: 'AdminHome',
          component: AdminHome
        },
        {
          path: 'edit',
          name: 'AdminEdit',
          component: AdminEdit
        },
      ],
    },
    { ...QuizLevelRoutes },
    { ...QuizSectionRoutes },
    { ...QuizTitleRoutes },
    { ...QuizRoutes },
    { ...UserRoutes }
  ]
})

export default router

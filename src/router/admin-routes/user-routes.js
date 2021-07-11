import store from '../../store'
import Index from '../../views/admin/user/index'
// import Show from '../../views/admin/user/show'

const nestTemplate = { template: '<router-view/>' }

export default {
  path: '/admin/users',
  component: nestTemplate,
  beforeEnter: (to, from, next) => {
    if (store.state.adminLoginStatus.token) {
      next()
    } else {
      next('/admin_login')
    }
  },
  children: [
    {
      path: '',
      name: 'IndexUser',
      component: Index
    }
    // {
    //   path: ':id',
    //   name: 'ShowQuizLevel',
    //   component: Show
    // }
  ]
}

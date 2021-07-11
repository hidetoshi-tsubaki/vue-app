import store from '../../store'
import Index from '../../views/admin/quiz-title/index'
import Show from '../../views/admin/quiz-title/show'

const nestTemplate = { template: '<router-view></router-view>' }

export default {
  path: '/admin/quiz_titles',
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
      name: 'IndexQuizTitle',
      component: Index
    },
    {
      path: ':id',
      name: 'ShowQuizTitle',
      component: Show
    }
  ]
}

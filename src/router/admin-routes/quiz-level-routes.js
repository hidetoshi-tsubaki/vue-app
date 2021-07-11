import store from '../../store'
import Index from '../../views/admin/quiz-level/index'
import Show from '../../views/admin/quiz-level/show'

const nestTemplate = { template: '<router-view/>' }

export default {
  path: '/admin/quiz_levels',
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
      name: 'IndexQuizLevel',
      component: Index
    },
    {
      path: ':id',
      name: 'ShowQuizLevel',
      component: Show
    }
  ]
}

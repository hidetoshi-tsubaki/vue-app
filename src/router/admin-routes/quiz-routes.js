import store from '../../store'
import Index from '../../views/admin/quiz/index'
import Show from '../../views/admin/quiz/show'

export default {
  path: '/admin/quizzes',
  component: { template: '<router-view></router-view>' },
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
      name: 'IndexQuiz',
      component: Index
    },
    {
      path: ':id',
      name: 'ShowQuiz',
      component: Show
    }
  ]
}

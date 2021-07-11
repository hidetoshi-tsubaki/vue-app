import store from '../../store'
import Index from '../../views/admin/quiz-section/index'
import Show from '../../views/admin/quiz-section/show'

const nestTemplate = { template: '<router-view></router-view>' }

export default {
  path: '/admin/quiz_sections',
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
      name: 'IndexQuizSection',
      component: Index
    },
    {
      path: ':id',
      name: 'ShowQuizSection',
      component: Show
    }
  ]
}

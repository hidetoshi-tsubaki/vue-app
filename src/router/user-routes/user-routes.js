import Setting from '../../views/user/setting'
import Ranking from '../../views/user/ranking'
import Delete from '../../views/user/delete'
import store from '../../store'

export default {
  path: '/user',
  component: { template: `<router-view/>` },
  beforeEnter: (to, from, next) => {
    if (store.state.userLoginStatus.token) {
      next()
    } else {
      next('/')
    }
  },
  children: [
    {
      path: 'ranking',
      name: 'Ranking',
      component: Ranking
    },
    {
      path: 'Setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: 'DeleteAcount',
      name: 'delete',
      component: Delete
    }
  ]
}

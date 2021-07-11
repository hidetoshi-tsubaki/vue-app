import QuizSectionsAndTitles from '../../views/user/quiz/sections-and-titles'
import PlayQuiz from '../../views/user/quiz/play'
import store from '../../store'

export default {
  path: '/quiz',
  component: { template: `<router-view/>`},
  beforeEnter: (to, from, next) => {
    if (store.state.userLoginStatus.token) {
      next()
    } else {
      next('/')
    }
  },
  children: [
    {
      path: 'play/:id',
      name: 'PlayQuiz',
      component: PlayQuiz
    },
    {
      path: 'sections_and_titles/:id',
      name: 'QuizSectionsAndTitles',
      component: QuizSectionsAndTitles
    }
  ]
}

<template>
  <div>
    <h1>Quiz 一覧</h1>
    <p><router-link to='/admin/quizzes/new'>新規作成</router-link></p>
    <div v-for='(quiz, index) in quizzes' :key="index">
      <ul>
        <li>{{quiz.Question}}</li>
        <li>{{quiz.Answer}}</li>
        <li>{{quiz.Choice1}}</li>
        <li>{{quiz.Choice2}}</li>
        <li>{{quiz.CHoice3}}</li>
        <li>
          <router-link :to="{ name: 'EditQuiz', params: { id: quiz.ID}}">編集</router-link>
          <button v-on:click="deleteQuiz(quiz.ID, index)">削除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'quizzesIndex',
  data: function () {
    return {
      quizzes: null
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$adminHttp.get('/admin/quizzes')
        .then((response) => {
          this.quizzes = response.data.Quizzes
        })
        .catch((error) => {
          this.$router.push({ path: '/admin/home' })
          console.log(error)
        })
    },
    deleteQuiz: function (quizID, index) {
      this.$adminHttp.delete(`/admin/quizzes/${quizID}`)
        .then(response => {
          if (response.data != null) {
            this.errorMessages = response.data.ErrorMessages
            alert(response.data)
            alert("failed to delete quiz")
          }
          this.quizzes.splice(index)
        })
    }
  }
}
</script>

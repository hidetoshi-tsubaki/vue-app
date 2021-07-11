<template>
<div>
  <p>Quiz Detail</p>
  <router-link :to="{ name: 'EditQuiz', params: { id: this.quiz.ID}}">編集</router-link>
  <button v-on:click="deleteQuiz">削除</button>
  <div>
    <p>Question: {{ this.quiz.Question }}</p>
    <p>Answer: {{ this.quiz.Answer }}</p>
    <p>Choice1: {{ this.quiz.Choice1 }}</p>
    <p>Choice2: {{ this.quiz.Choice2 }}</p>
    <p>Choice3: {{ this.quiz.Choice3 }}</p>
  </div>
  <div>
    <p>Belongs to</p>
    <ul>
      <li v-for="quizTitle in quizTitles" :key="quizTitle.ID">
        <router-link :to="{ name: 'ShowQuizTitle', params: { id: quizTitle.ID}}">{{ quizTitle.Name}}</router-link>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'showQuiz',
  data: function () {
    return {
      quiz: null,
      quizTitles: null
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$adminHttp.get(`/admin/quizzes/${this.$route.params["id"]}`)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            alert("failed to get data")
          } else {
            this.quiz = response.data.Quiz
            this.quizTitles = response.data.QuizTitles
          }
        })
        .catch((error) => {
          this.$router.push({ path: '/admin/home' })
          console.log(error)
        })
    },
    deleteQuiz: function () {
      this.$adminHttp.delete(`/admin/quizzes/${this.quiz.ID}`)
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            alert("failed to delete quiz")
          } else {
            this.$router.push({ path: '/admin/quizzes/index' })
          }
        })
    }
  }
}
</script>

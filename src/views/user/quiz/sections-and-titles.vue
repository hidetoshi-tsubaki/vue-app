<template>
  <v-row justify="center" align="center">
    <v-col
      cols="12" sm="10"
      class="grey--text text--darken-2"
    >
      <v-card class="pa-4 blue-grey--text text--darken-1">
      <p class="display-2 text-center">
        {{ this.quizLevel.Name }}
      </p>
      <div
        v-for="quizSection in this.quizSections"
        :key="quizSection.ID"
        class="mb-12"
      >
        <p class="text-h5 text-sm-h4 pl-sm-5 font-weight-bold blue-grey--text text--darken-1">
          {{ quizSection.Name }}
        </p>
          <div
            v-for="quizTitle in quizSection.QuizTitles"
            :key="quizTitle.ID"
            class="font-weight-bold mb-4 pl-4 pl-sm-10"
          >
            <div class="mt-6 mb-4 pl-4 pr-sm-10">
              <p class="mb-1 text-h6">{{ quizTitle.Name }}</p>
              <div class="d-flex align-end flex-column">
                <v-btn
                  class="font-weight-bold"
                  color="primary"
                  :to="{ name: 'PlayQuiz', params: { id: quizTitle.ID, level_id: quizSection.QuizLevelID }}"
                >
                Play
                </v-btn>
              </div>
            </div>
            <v-divider></v-divider>
          </div>
      </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function () {
    return {
      quizLevel: null,
      quizSections: null
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$userHttp.get(`/users/quizzes/sections_and_titles/${this.$route.params.id}`)
        .then(response => {
          if (response.data.ErrorMessages) {
            alert("error")
          } else {
            this.quizLevel = response.data.QuizLevel
            this.quizSections = response.data.QuizSections
          }
        })
        .catch(error => {
          console.log(error)
          this.$router.push({path: '/home'})
        })
    }
  }
}
</script>

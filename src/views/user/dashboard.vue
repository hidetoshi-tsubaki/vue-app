<template>
  <v-row justify="center">
    <v-col cols="12" sm="8">
      <div  v-if='this.lastPlayedQuizTitle.ID'>
        <p class="mb-2 font-weight-bold blue-grey--text text--darken-1">
          <v-icon>mdi-clipboard-clock-outline</v-icon>
          Last Quizzes you played
        </p>
        <v-card class="mb-15 pa-4">
          <p class="mb-1">
            <router-link
              :to="{ name: 'QuizSectionsAndTitles', params: { id: this.lastPlayedQuizTitle.QuizSection.QuizLevel.ID }}"
            >
              {{ this.lastPlayedQuizTitle.QuizSection.QuizLevel.Name }}
            </router-link>
            - {{ this.lastPlayedQuizTitle.QuizSection.Name }}
          </p>
          <p class="mb-1 text-h5">{{ this.lastPlayedQuizTitle.Name }}</p>
          <div class="d-flex align-end flex-column">
            <v-btn
              class="font-weight-bold"
              color="primary"
              :to="{ name: 'PlayQuiz', params: { id: this.lastPlayedQuizTitle.ID }}"
            >
              Play
            </v-btn>
          </div>
        </v-card>
      </div>
      <div>
        <p class="font-weight-bold blue-grey--text text--darken-1">
          <v-icon>mdi-clipboard-text-outline</v-icon> Quiz Level
        </p>
        <v-card
          v-for="quizLevel in quizLevels" :key="quizLevel.ID"
          class="pa-5"
        >
          ・<router-link
              :to="{
                name: 'QuizSectionsAndTitles',
                params: { id: quizLevel.ID }
              }"
              class="mr-5"
            >
              <span class="text-h6">{{ quizLevel.Name }}</span>
          </router-link>
        </v-card>
      </div>
    </v-col>
    <v-col cols="3" style="height: 50vh;" class="heatmap d-none d-sm-flex">
      <div class="pa-2">
        <p class="text-lg-h6 font-weight-bold text-center  blue-grey--text text--darken-1">
          Learning History
        </p>
          <calendar-heatmap
            :end-date="this.getToday"
            :values="this.formattedHeatmapData"
            :range-color="['#ebedf0','#C8E6C9','#81C784','#43A047','#1B5E20']"
            :vertical="true" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { CalendarHeatmap } from 'vue-calendar-heatmap'
import moment from 'moment'
export default {
  name: 'Home',
  components: {
    CalendarHeatmap
  },
  data: function () {
    return {
      quizLevels: null,
      lastPlayedQuizTitle: null,
      heatmapData: []
    }
  },
  created: function () {
    this.fetchData()
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' }),
    getToday: function () {
      const today = new Date()
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      return date
    },
    formattedHeatmapData: function () {
      const array = this.heatmapData.map(value => {
        return { date: this.changeDateFormat(value.Date), count: value.Count }
      })
      return array
    }
  },
  methods: {
    ...mapActions({ logout: 'userLoginStatus/unauthorize' }),
    changeDateFormat: function (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    fetchData: function () {
      this.$userHttp.get('/users/dashboard')
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizLevels = response.data.QuizLevels
            this.lastPlayedQuizTitle = response.data.LastPlayedQuizTitle
            this.heatmapData = response.data.HeatmapData
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
.heatmap {
  overflow-y: scroll;
}
</style>
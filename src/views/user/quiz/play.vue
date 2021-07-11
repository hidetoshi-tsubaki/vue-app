<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="12" md="10" lg="8">
      <router-link
        :to="{
          name: 'QuizSectionsAndTitles',
          params: { id: this.quizTitle.QuizSection.QuizLevel.ID }
        }"
      >
        <v-btn class="grey white--text" small><v-icon>mdi-arrow-left</v-icon> Back To List</v-btn>
      </router-link>
      <p class="mt-2 text-h5 blue-grey--text text--darken-1">
        {{ this.quizTitle.QuizSection.QuizLevel.Name}}
        - {{this.quizTitle.QuizSection.Name}}
      </p>
      <v-card v-if="!this.dialog">
        <v-content class="pa-5">
          <div justify="text-center">
            <p
              v-if="this.showCollectMark()"
              class="collect text-center font-weight-bold"
            >
              正解・せいかい（Collect) !!!<br>
              <span class="collect-circle mt-2"></span>
            </p>
            <p
              v-if="this.showWrongMark()"
              class="wrong text-center font-weight-bold"
            >
              不正解・ふせいかい（Wrong)<br>
              <span class="wrong-cross red--text">×</span>
            </p>
          </div>
          <div class="question_box">
            <p class="text-center grey--text text--darken-2 font-weight-bold">{{ this.currentQuiz.Question }}</p>
          </div>
          <v-divider class="my-6"></v-divider>
          <div>
            <v-card
              v-for="(choice, index) in this.shuffledChoices"
              :key='index' v-on:click='check(choice, index)'
              v-bind:class="[{wrongChoice: isWrong(choice)}, {collectChoice: isCollect(choice)}, {answered: isAnswered()}]"
              v-text="choice"
              class="choice rounded-pill mb-5 py-2 font-weight-bold text-center text-body"
            ></v-card>
          </div>
          <v-card-actions class="justify-center">
            <v-btn
              v-on:click="next"
              v-bind:disabled="!this.answered"
              v-if="!lastQuiz"
              class="primary font-weight-bold px-6"
            >
              Next
            </v-btn>
            <v-btn
              v-on:click="postScore"
              v-if="lastQuiz"
              v-bind:disabled="this.posted"
              class="amber darken-2 white--text font-weight-bold"
            >
              Show score
            </v-btn>
          </v-card-actions>
        </v-content>
      </v-card>
      <v-card v-if="this.dialog" class="grey--text text--darken-2">
        <p class="py-4 text-center text-h4 font-weight-bold">- Results -</p>
        <v-content>
          <v-row class="text-center">
            <v-col cols="6" sm="3" md="3" lg="3" xl="3">
              <p class="font-weight-bold mb-1">Score</p>
              <div class="d-flex justify-center">
                <v-card class="amber darken-4 white--text py-3 py-sm-6" width="90%">
                  <p class="font-weight-bold mb-0">{{ this.calculatedScore }}</p>
                </v-card>
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6" sm="3" md="3" lg="3" xl="3">
              <p class="font-weight-bold mb-1">EXP</p>
              <div class="d-flex justify-center">
                <v-card class="amber darken-4 white--text py-3 py-sm-6" width="90%">
                  <p class="font-weight-bold mb-0">{{ this.result.EarnedExperience }} pt</p>
                </v-card>
              </div>
            </v-col>
            <v-divider vertical class="d-xs-none"></v-divider>
            <v-col cols="6" sm="3" md="3" lg="3" xl="3">
              <p class="font-weight-bold mb-1">To Next Level</p>
              <div class="d-flex justify-center">
                <v-card class="amber darken-4 white--text py-3 py-sm-6" width="90%">
                  <p class="font-weight-bold mb-0">{{ this.result.NeededPoint }} pt</p>
                </v-card>
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6" sm="3" md="3" lg="3" xl="3" class="relative">
              <p class="font-weight-bold mb-1">Learning Level</p>
              <div class="d-flex justify-center">
                <v-card class="amber darken-4 white--text py-3 py-sm-6" width="90%">
                  <p class="font-weight-bold mb-0">{{ this.result.LearningLevel }} %</p>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-content>
          <v-content class="mt-10">
            <LineChart
              :height="200"
              :chartData="this.result.RecentScores"
              >
            </LineChart>
          </v-content>
        <v-card-actions class="justify-center">
          <v-btn
            @click="replay"
            class="font-weight-bold align-center my-4"
            color="primary"
          >
            <v-icon dark left>mdi-reload</v-icon>
            replay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import LineChart from '../../../components/parts/charts/line-chart'
import { mapGetters } from 'vuex'
export default {
  name: 'PlayQuiz',
  components: {
    LineChart
  },
  data: function () {
    return {
      quizTitle: null,
      quizzes: [],
      wrong: null,
      count: 0,
      currentQuiz: null,
      answered: false,
      lastQuiz: false,
      score: 0,
      result: null,
      posted: false,
      dialog: false
    }
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' }),
    shuffledChoices: function () {
      var choices = [this.currentQuiz.Answer, this.currentQuiz.Choice1,this.currentQuiz.Choice2, this.currentQuiz.Choice3]
      choices = this.shuffle(choices)
      return choices
    },
    calculatedScore: function () {
      return Math.floor((this.score / this.quizzes.length) * 100)
    }
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$userHttp.get(`/users/quizzes/play/${this.$route.params.id}`)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
          } else {
            this.quizTitle = response.data.QuizTitle
            this.quizzes = response.data.Quizzes
            this.shuffleQuizzes()
            this.set()
          }
        })
    },
    set: function () {
      this.answered = false
      this.wrong = null
      this.currentQuiz = this.quizzes[this.count]
    },
    shuffleQuizzes: function() {
      this.quizzes.splice(0, this.quizzes.length, ...this.shuffle(this.quizzes))
    },
    shuffle: function (array) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];

      }
      return array
    },
    isAnswered: function () {
      return this.answered
    },
    isWrong: function (choice) {
      var bool = this.answered && this.wrong === choice
      return bool
    },
    isCollect: function (choice) {
      var bool = this.answered && choice === this.currentQuiz.Answer
      return bool
    },
    showWrongMark: function () {
      var bool = this.wrong != null && this.answered != false
      return bool
    },
    showCollectMark: function () {
      var bool = this.wrong === null && this.answered != false
      return bool
    },
    check: function (choice) {
      if (this.answered) {
        return
      }

      choice === this.currentQuiz.Answer ? this.score++ : this.wrong = choice

      this.count++

      if (this.count === this.quizzes.length) {
        this.lastQuiz = !this.lastQuiz
      }

      this.answered = !this.answered
    },
    next: function () {
      if (!this.answered) {
        return
      }

      this.set()
    },
    postScore: function () {
      this.posted = true
      this.$userHttp.post(`/users/score_records/${this.user.ID}`, {
        QuizTitleID: Number(this.$route.params.id),
        Score: this.calculatedScore
      })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessags
          } else {
            this.experience = response.data.EarnedExperience
            this.recentScores = response.data.RecentScores
            this.learningLevel = response.data.LearningLevel
            this.result = response.data
            this.dialog = true
          }
        })
    },
    replay: function () {
      this.reset()
      this.dialog = false
    },
    reset: function () {
      this.lastQuiz = false
      this.score = 0
      this.answered = false
      this.count = 0
      this.wrong = null
      this.posted = false
      this.shuffleQuizzes()
      this.set()
    }
  }
}
</script>

<style>
.choice {
  cursor: pointer;
  color: #616161 !important;
}
.choice:hover {
  background-color: #F5F5F5;
}
.answered {
  pointer-events: none;
}
.collectChoice {
  background: #4CAF50 !important;
  color: #fff !important;
}
.collect {
  color: #4CAF50;
}
.collect-circle {
  display: block;
  width: 90px;
  height: 90px;
  margin: auto;
  border-radius: 50%;
  border: 15px solid #4CAF50;
}
.wrongChoice {
  background: #F44336 !important;
  color: #fff !important;
}
.wrong {
  color: #F44336;
}
.wrong-cross {
  z-index: 2;
  font-size: 90px;
  line-height: 3rem;
}
.absolute {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
}
.relative {
  position: relative;
}
</style>
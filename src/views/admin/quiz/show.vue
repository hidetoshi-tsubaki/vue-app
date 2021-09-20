<template>
  <v-card class="pa-3 mb-5">
    <p>Quiz Detail</p>
    <ShowProperty
      v-model="quiz"
      :formKeys="formKeys"
      url="quizzes"
      v-if="quiz"
    >
      <template v-slot:form>
        <MyQuizForm v-model="quiz" />
      </template>
    </ShowProperty>
    <v-card style="max-width: 600px;">
      <v-data-table
        :headers="headers"
        :items="quizTitles"
        item-key="ID"
        show-select
        v-model="selectedItems"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat class="mb-4">
            <v-dialog
              v-model="dialog"
              max-width="600px"
            >
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete these items?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeRemove">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="removeQuizTitlesConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn
              small
              color="error"
              :disabled="!removable"
              @click="dialog = !dialog"
            >
              Remove Items
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.Name="{ item }">
          <v-btn
            plain
            color="primary"
            @click="pageTransition(item)"
          >
            {{ item.Name }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import mixin from '../../../mixins/globalMethods.js'
import MyQuizForm from '../../../components/parts/form/MyQuizForm'
import ShowProperty from '../../../components/parts/showPage/ShowProperty'
export default {
  name: 'showQuiz',
  components: {
    MyQuizForm,
    ShowProperty
  },
  mixins: [mixin],
  data: () => ({
    quiz: null,
    formKeys: ["Question", "Answer", "Choice1", "Choice2", "Choice3"],
    quizTitles: [],
    selectedItems: [],
    headers: [
      {
        text: "Name",
        value: "Name",
        sortable: false
      }
    ],
    dialog: false
  }),
  computed: {
    removable (){
      return this.selectedItems.length
    },
  },
  created: function () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    fetchData: function () {
      this.$adminHttp.get(`/admin/quizzes/${this.$route.params["id"]}`)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'warning',
              message: 'Failed to fetch data ...'
            })
          } else {
            this.quiz = response.data.Quiz
            this.quizTitles = response.data.QuizTitles
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deleteQuiz () {
      this.$adminHttp.delete(`/admin/quizzes/${this.quiz.ID}`)
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            alert("failed to delete quiz")
          } else {
            this.$router.push({ path: '/admin/quizzes/index' })
          }
        })
    },
    closeRemove () {
      this.dialog = false
    },
    removeQuizTitlesConfirm () {
      const selectedItemIds = this.selectedItems.map(item => item.ID)
      this.$adminHttp.request({
        method: 'delete',
        url: `/admin/quizzes/${this.$route.params.id}/remove_quiz_titles`,
        data: { SelectedItemIds: selectedItemIds }
      })
      .then(response => {
        if (response.data != null) {
          console.log(response.data)
          this.setFlashMessage({
            type: 'warning', message: 'Failed to remove quiz titles'
          })
        } else {
          this.quizTitles = this.quizTitles.filter( function (item) {
            return selectedItemIds.includes(item.ID) === false
          })
          this.selectedItems = []
          this.setFlashMessage({
            type: 'success', message: 'Remove quiz titles successfully'
          })
        }
        this.closeRemove()
      })
      .catch(
        this.setFlashMessage({
          type: 'warning', message: 'Failed to delete items'
        })
      )
    },
    pageTransition (item) {
      this.$router.push("/admin/quiz_titles/" + item.ID)
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>
      Quiz Titles
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="quizTitles"
      :sort-by="headers"
      :search='search'
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-spacer></v-spacer>
        <v-toolbar flat>
          <v-dialog
            v-model="dialog"
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-spacer></v-spacer>
              <v-btn
                small
                color="primary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }} Quiz Title</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <ErrorMessages :errorMessages=errorMessages></ErrorMessages>
                  <v-form ref="form">
                    <MySelect
                      v-model="editedItem.QuizLevelID"
                      label="Quiz Level"
                      :items="quizLevels"
                      itemText="Name"
                      itemValue="ID"
                      @change="getQuizSections"
                    />
                    <MySelect
                      v-model="editedItem.QuizSectionID"
                      label="Quiz Section"
                      :items="quizSections"
                      itemText="Name"
                      itemValue="ID"
                    />
                    <MyInput
                      v-model="editedItem.Name"
                      label="Name"
                      v-bind="nameRules"
                    />
                    <MySelect
                      v-model="editedItem.Rate"
                      label="Rate"
                      :items="rateArray"
                    />
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  v-if="editedIndex != -1"
                  color="blue darken-1"
                  text
                  @click="update"
                >
                  Update
                </v-btn>
                <v-btn
                  v-if="editedIndex === -1"
                  color="blue darken-1"
                  text
                  @click="create"
                >
                  create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm(editedItem)">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.CreatedAt="{ item }" v-slot:activator="{changeFormat}">
        {{ changeFormat(item.CreatedAt, 'yyyy/M/d H:m') }}
      </template>
      <template v-slot:item.UpdatedAt="{ item }" v-slot:activator="{changeFormat}">
        {{ changeFormat(item.UpdatedAt, 'yyyy/M/d H:m') }}
      </template>
      <template v-slot:item.actions="{ item }">
        <router-link :to="{ name: 'ShowQuizTitle', params: { id: item.ID }}">
          <v-icon
            small
            class="mr-2"
          >
            mdi-open-in-new
          </v-icon>
        </router-link>
        <v-icon
          small
          class="mr-2"
          color="primary"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          color="red"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import MyInput from '../../../components/parts/form/MyInput'
import MySelect from '../../../components/parts/form/MySelect'
import ErrorMessages from '../../../components/parts/ErrorMessages'
import mixin from '../../../mixins/globalMethods.js'
export default {
  name: 'ShowQuizSection',
  components: {
    MyInput,
    MySelect,
    ErrorMessages
  },
  mixins: [mixin],
  data: () => ({
    loading: false,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "ID"
      },
      {
        text: "Name",
        value: "Name"
      },
      {
        text: "Rate",
        value: "Rate"
      },
      {
        text: "Level",
        value: "QuizSection.QuizLevel.Name"
      },
      {
        text: "Section",
        value: "QuizSection.Name"
      },
      {
        text: "CreatedAt",
        value: "CreatedAt"
      },
      { text: "UpdatedAt",
        value: "UpdatedAt",
      },
      {
          text: 'Actions',
          value: 'actions',
          sortable: false
      }
    ],
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      QuizLevelID: 0,
      QuizSectionID: 0,
      Name: '',
      Rate: 1
    },
    defaultItem: {
      QuizLevelID: 0,
      QuizSectionID: 0,
      Name: '',
      Rate: 1
    },
    quizLevels: [],
    quizSections: [],
    quizTitles: [],
    nameRules: {
      max: 40,
      required: true
    },
    rateArray: [...Array(41)].map((_, i) => Math.round(((i * 0.1) + 1) * 10) / 10),
    errorMessages: []
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New' : 'Edit'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    fetchData: function () {
      this.loading = true
      this.$adminHttp.get('/admin/quiz_titles')
      .then(response => {
        if (response.data.ErrorMessages != null) {
          console.log(response.data.ErrorMessages)
          this.setFlashMessage({
            type: 'warning',
            message: 'Failed to fetch data ...'
          })
        } else {
          this.quizLevels = response.data.QuizLevels
          this.quizTitles = response.data.QuizTitles
        }
        this.loading = false
      })
      .catch((error) => {
        console.log(error)
      })
    },
    editItem (item) {
      this.editedItem = Object.assign({}, item)
      this.editedIndex = this.quizTitles.indexOf(item)
      this.editedItem.QuizLevelID = item.QuizSection.QuizLevel.ID
      this.editedItem.QuizSectionID = item.QuizSection.ID
      this.getQuizSections()
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.quizTitles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm (item) {
      this.$adminHttp.delete(`/admin/quiz_titles/${item.ID}`)
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({
              type: 'warning', message: "Failed to delete ..."
            })
          } else {
            this.quizTitles.splice(this.editedIndex, 1)
            this.closeDelete()
            this.setFlashMessage({
              type: 'success', message: "Delete successfully"
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.errorMessages = []
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    getQuizSections () {
      this.$adminHttp.get(`/admin/quiz_sections/get_quiz_sections_by_quiz_level_id/${this.editedItem.QuizLevelID}`)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.setFlashMessage({
              type: 'warning', message: "Failed to get data ..."
            })
          } else {
            this.quizSections = response.data
            if (response.data.length) {
              this.editedItem.QuizSectionID = this.quizSections[0].ID
            }
          }
        })
        .catch(error => {
          console.log(error)
          this.setFlashMessage({
            type: 'error', message: "Something went wrong. Please try again ..."
          })
        })
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    create () {
      if (this.validation()) {
        this.$adminHttp.post('/admin/quiz_titles', {
          QuizSectionID: this.editedItem.QuizSectionID,
          Name: this.editedItem.Name,
          Rate: this.editedItem.Rate
        })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizTitles.push(response.data)
            this.close()
            this.setFlashMessage({
              type: 'success', message: 'Created successfully'
            })
          }
        })
        .catch(error => {
          console.log(error)
          this.errorMessages = ['Something went wrong. Please try again']
        })
      }
    },
    update () {
      if (this.validation()) {
        this.$adminHttp.put(`/admin/quiz_titles/${this.editedItem.ID}`, {
          QuizSectionID: this.editedItem.QuizSectionID,
          Name: this.editedItem.Name,
          Rate: this.editedItem.Rate
      })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            Object.assign(this.quizTitles[this.editedIndex], response.data)
            this.setFlashMessage({
              type: 'success', message: 'Changes have been saved'
            })
            this.close()
          }
        })
        .catch(error => {
          console.log(error)
          this.setFlashMessage({
            type: 'error', message: 'Something went wrong. Please try again'
          })
        })
      }
    }
  }
}
</script>

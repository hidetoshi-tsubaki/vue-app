<template>
  <v-card>
    <v-card-title>
      {{ this.quizTitle.Name }}
    </v-card-title>
    <v-btn
      small
      color="primary"
      @click="addQuizTableDialog = !addQuizTableDialog"
    >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
      Add Existing Quiz
    </v-btn>
    <v-dialog v-model="addQuizTableDialog">
      <AddQuizTable
        :quizTitle="quizTitle"
      />
    </v-dialog>
    <v-divider class="mx-5"></v-divider>
    <v-card-title>
      Quizzes in {{ this.quizTitle.Name }}
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
      :items="quizzes"
      :sort-by="headers"
      :search='search'
      :loading="loading"
      loading-text="Loading... Please wait"
      item-key="ID"
      show-expand
      show-select
      v-model="selectedItems"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn
            small
            color="error"
            @click="removeItems"
            :disabled="!removeBtn"
          >
            Remove Quizzes from {{ quizTitle.Name }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                New
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }} Quiz</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <ErrorMessages :errorMessages=errorMessages></ErrorMessages>
                    <MySelect
                      v-if="editedIndex != -1"
                      v-model="editedItem.QuizLevelID"
                      label="Quiz Level"
                      :items="quizLevels"
                      itemText="Name"
                      itemValue="ID"
                      @change="getQuizSections"
                    />
                    <MySelect
                      v-if="editedIndex != -1"
                      v-model="editedItem.QuizSectionID"
                      label="Quiz Section"
                      :items="quizSectionsChoices"
                      itemText="Name"
                      itemValue="ID"
                      v-bind="selectRules"
                      noDataText="quiz sections not exist"
                    />
                  <v-form ref="form">
                    <MySelect
                      v-if="editedIndex != -1"
                      v-model="editedItem.QuizTitleID"
                      label="Quiz Title"
                      :items="quizTitlesChoices"
                      itemText="Name"
                      itemValue="ID"
                      v-bind="selectRules"
                      noDataText="quiz sections not exist"
                    />
                    <MyTextarea
                      v-model="editedItem.Question"
                      label="Question"
                      v-bind="questionRules"
                    />
                    <MyInput
                      v-model="editedItem.Answer"
                      label="Answer"
                      v-bind="choiceRules"
                    />
                    <MyInput
                      v-model="editedItem.Choice1"
                      label="Choice1"
                      v-bind="choiceRules"
                    />
                    <MyInput
                      v-model="editedItem.Choice2"
                      label="Choice2"
                      v-bind="choiceRules"
                    />
                    <MyInput
                      v-model="editedItem.Choice3"
                      label="Choice3"
                      v-bind="choiceRules"
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
          <v-dialog v-model="dialogConfirm" max-width="600px">
            <v-card>
              <v-card-title class="text-h5 py-8">
                Are you sure you want to
                <span class="font-weight-bold mx-2">{{ actionName }}</span>
                this Quiz?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn 
                  v-if="editedIndex == -1"
                  color="blue darken-1"
                  text
                  @click="removeItemsConfirm"
                >
                  OK
                </v-btn>
                <v-btn
                  v-if="editedIndex != -1"
                  color="blue darken-1"
                  text
                  @click="deleteItemConfirm(editedItem)">
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.Question="{ item }" v-slot:activator="{ truncate }">
        {{ truncate(item.Question, 15, '...')}}
      </template>
      <template v-slot:item.Answer="{ item }" v-slot:activator="{ truncate }">
        {{ truncate(item.Answer, 12, '...')}}
      </template>
      <template v-slot:item.Choice1="{ item }" v-slot:activator="{ truncate }">
        {{ truncate(item.Choice1, 12, '...')}}
      </template>
      <template v-slot:item.Choice2="{ item }" v-slot:activator="{ truncate }">
        {{ truncate(item.Choice2, 12, '...')}}
      </template>
      <template v-slot:item.Choice3="{ item }" v-slot:activator="{ truncate }">
        {{ truncate(item.Choice3, 12, '...')}}
      </template>
        <template v-slot:item.CreatedAt="{ item }" v-slot:activator="{ changeFormat }">
          {{ changeFormat(item.CreatedAt, 'yyyy/M/d H:m') }}
      </template>
      <template v-slot:item.UpdatedAt="{ item }" v-slot:activator="{ changeFormat }">
        {{ changeFormat(item.UpdatedAt, 'yyyy/M/d H:m') }}
      </template>
      <template v-slot:item.actions="{ item }">
        <router-link :to="{ name: 'ShowQuiz', params: { id: item.ID }}">
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
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-2" style="max-width: 98vw;">
          <span class="font-weight-bold">Question:</span><br>{{ item.Question }}
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import MyInput from '../../../components/parts/form/MyInput'
import MyTextarea from '../../../components/parts/form/MyTextarea'
import MySelect from '../../../components/parts/form/MySelect'
import ErrorMessages from '../../../components/parts/ErrorMessages'
import AddQuizTable from './AddQuizTable'
import mixin from '../../../mixins/globalMethods.js'
export default {
  name: 'ShowQuizSection',
  components: {
    MyInput,
    MyTextarea,
    MySelect,
    ErrorMessages,
    AddQuizTable
  },
  mixins: [mixin],
  data: () => ({
    expanded: [],
    loading: false,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "ID"
      },
      {
        text: "Question",
        value: "Question",
      },
      {
        text: "Answer",
        value: "Answer"
      },
      {
        text: "Choice1",
        value: "Choice1"
      },
      {
        text: "Choice2",
        value: "Choice2"
      },
      {
        text: "Choice3",
        value: "Choice3"
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
      },
      {
        text: '',
        value: 'data-table-expand'
      }
    ],
    search: '',
    selectedItems: [],
    dialog: false,
    dialogConfirm: false,
    addQuizTableDialog: false,
    editedIndex: -1,
    editedItem: {
      Question: '',
      Answer: '',
      Choice1: '',
      Choice2: '',
      Choice3: ''
    },
    defaultItem: {
      QuizTitleID: '',
      Question: '',
      Answer: '',
      Choice1: '',
      Choice2: '',
      Choice3: ''
    },
    quizTitle: '',
    quizzes: [],
    selectRules: {
      required: true
    },
    questionRules: {
      max: 300,
      required: true
    },
    choiceRules: {
      max: 150,
      required: true
    },
    errorMessages: [],
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New' : 'Edit'
    },
    actionName () {
      return this.editedIndex === -1 ? 'remove' : 'delete'
    },
    removeBtn () {
      return this.selectedItems.length
    },
    removeQuizIds () {
      return this.selectedItems.map(item => item.ID)
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogConfirm (val) {
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
      this.$adminHttp.get(`/admin/quiz_titles/${this.$route.params.id}`)
      .then(response => {
        if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'warning',
              message: 'Failed to fetch data ...'
            })
          } else {
            this.quizTitle = response.data.QuizTitle
            this.quizzes = response.data.Quizzes
          }
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    editItem (item) {
      this.editedIndex = this.quizzes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.quizzes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogConfirm = true
    },
    deleteItemConfirm (item) {
      this.$adminHttp.delete(`/admin/quizzes/${item.ID}`)
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({
              type: 'warning', message: "Failed to delete ..."
            })
          } else {
            this.quizzes.splice(this.editedIndex, 1)
            this.closeConfirm()
            this.setFlashMessage({
              type: 'success', message: "Delete successfully"
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    removeItems() {
      this.dialogConfirm = true
    },
    removeItemsConfirm () {
      const selectedQuizIds = this.selectedItems.map(item => item.ID)
      this.$adminHttp.put(`/admin/quiz_titles/${this.quizTitle.ID}/remove_quizzes`, {
        QuizIds: selectedQuizIds,
      })
      .then(response => {
        if (response.data != null) {
          console.log(response.data)
          this.setFlashMessage({
            type: 'warning', message: 'Failed to delete quizzes'
          })
        } else {
          this.quizzes = this.quizzes.filter( function (item) {
            return selectedQuizIds.includes(item.ID) === false
          })
        }
        this.closeConfirm()
        this.setFlashMessage({
          type: 'success', message: 'Remove quizzes successfully'
        })
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
    closeConfirm () {
      this.dialogConfirm = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    create () {
      if (this.validation()) {
        this.$adminHttp.post('/admin/quizzes', {
          QuizTitleID: this.quizTitle.ID,
          Question: this.editedItem.Question,
          Answer: this.editedItem.Answer,
          Choice1: this.editedItem.Choice1,
          Choice2: this.editedItem.Choice2,
          Choice3: this.editedItem.Choice3
        })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizzes.push(response.data)
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
        this.$adminHttp.put(`/admin/quizzes/${this.editedItem.ID}`, {
          QuizTitleID: this.quizTitle.ID,
          Question: this.editedItem.Question,
          Answer: this.editedItem.Answer,
          Choice1: this.editedItem.Choice1,
          Choice2: this.editedItem.Choice2,
          Choice3: this.editedItem.Choice3
      })
        .then(response => {
          if (response.data != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            if (this.quizTitle.ID === this.editedItem.QuizTitleID) {
              Object.assign(this.quizzes[this.editedIndex], this.editedItem)
              this.setFlashMessage({
                type: 'success', message: 'Changes have been saved'
              })
            } else {
              this.quizzes.splice(this.editedIndex, response.data)
              this.setFlashMessage({
                type: 'success', message: 'it was moved to another Quiz Section'
              })
            }
          }
          this.close()
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

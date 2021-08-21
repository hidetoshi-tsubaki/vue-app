<template>
  <v-card>
    <v-card-title>
      Quiz Sections
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="quizSections"
      :sort-by="headers"
      :loading="loading"
      loading-text="Loading... Please wait"
      item-key="ID"
      show-select
      v-model="selectedItems"

    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn
            small
            color="error"
            @click="deleteItems"
            :disabled="!deleteBtn"
          >
            Delete Quiz Sections
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
                <span class="text-h5">{{ formTitle }} Quiz Section</span>
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
                      v-bind="quizLevelRules"
                    />
                    <MyInput
                      v-model="editedItem.Name"
                      label="Name"
                      v-bind="nameRules"
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
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemsConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.CreatedAt="{ item }" v-slot:activator="{ChangeFormat}">
        {{ ChangeFormat(item.CreatedAt, 'yyyy/M/d H:m') }}
      </template>
      <template v-slot:item.UpdatedAt="{ item }" v-slot:activator="{ChangeFormat}">
        {{ ChangeFormat(item.UpdatedAt, 'yyyy/M/d H:m') }}
      </template>
      <template v-slot:item.actions="{ item }">
        <router-link :to="{ name: 'ShowQuizSection', params: { id: item.ID }}">
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
        text: "Level",
        value: "QuizLevel.Name"
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
    selectedItems: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      QuizLevelID: '',
      QuizSectionID: '',
      Name: '',
      Rate: 1
    },
    defaultItem: {
      QuizSectionID: '',
      Name: '',
      Rate: 1
    },
    quizLevels: [],
    quizSections: [],
    quizLevelRules: {
      required: true
    },
    nameRules: {
      max: 40,
      required: true
    },
    errorMessages: []
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New' : 'Edit'
    },
    deleteBtn () {
      return this.selectedItems.length
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
      this.$adminHttp.get('/admin/quiz_sections')
      .then(response => {
        if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'warning',
              message: 'Failed to fetch data ...'
            })
          } else {
            this.quizLevels = response.data.QuizLevels
            this.quizSections = response.data.QuizSections
        }
        this.loading = false
      })
      .catch((error) => {
        console.log(error)
      })
    },
    editItem (item) {
      this.editedIndex = this.quizSections.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    validation () {
      return this.$refs.form.validate() ? true : false
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
    create () {
      if (this.validation()) {
        this.$adminHttp.post('/admin/quiz_sections', {
          QuizLevelID: this.editedItem.QuizLevelID,
          Name: this.editedItem.Name
        })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizSections.push(response.data)
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
        this.$adminHttp.put(`/admin/quiz_sections/${this.editedItem.ID}`, {
          QuizLevelID: this.editedItem.QuizLevelID,
          Name: this.editedItem.Name,
      })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            Object.assign(this.quizSections[this.editedIndex], response.data)
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
    },
    deleteItems () {
      this.dialogDelete = true
    },
    deleteItemsConfirm () {
      const selectedItemIds = this.selectedItems.map(item => item.ID)
      this.$adminHttp.request({
        method: 'delete',
        url: "/admin/quiz_sections",
        data: { deleteItemIds: selectedItemIds }
      })
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({
              type: 'warning', message: "Failed to delete ..."
            })
          } else {
            this.quizSections = this.quizSections.filter( function (item) {
              return selectedItemIds.includes(item.ID) === false
            })
          }
          this.closeDelete()
          this.setFlashMessage({
            type: 'success', message: "Delete quiz sections successfully"
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

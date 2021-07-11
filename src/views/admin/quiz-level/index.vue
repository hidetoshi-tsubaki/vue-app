<template>
  <v-card>
    <v-card-title>
      Quiz Levels
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
      :items="quizLevels"
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
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                    <ErrorMessages :errorMessages=errorMessages></ErrorMessages>
                    <v-form ref="form">
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
                  Create
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
        {{ changeFormat(item.CreatedAt, 'yyyy/M/d H:m:s') }}
      </template>
      <template v-slot:item.UpdatedAt="{ item }" v-slot:activator="{changeFormat}">
        {{ changeFormat(item.UpdatedAt, 'yyyy/M/d H:m:s') }}
      </template>
      <template v-slot:item.actions="{ item }">
        <router-link :to="{ name: 'ShowQuizLevel', params: { id: item.ID }}">
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
import ErrorMessages from '../../../components/parts/ErrorMessages'
import mixin from '../../../mixins/globalMethods.js'
export default {
  name: 'IndexQuizLevel',
  components: {
    MyInput,
    ErrorMessages
  },
  mixins: [mixin],
  data () {
    return {
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
      quizLevels: [],
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        Name: ''
      },
      defaultItem: {
        Name: ''
      },
      nameRules: {
        max: 40,
        required: true
      },
      errorMessages: []
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New' : 'Edit'
    },
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
      this.$adminHttp.get('/admin/quiz_levels')
        .then((response) => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'error', message: 'Failed to get data ...'
            })
          } else {
            this.quizLevels = response.data
          }
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    editItem (item) {
      this.editedIndex = this.quizLevels.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.quizLevels.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm (item) {
      this.$adminHttp.delete(`/admin/quiz_levels/${item.ID}`)
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({ type: 'warning', message: "Failed to delete ..."})
          } else {
            this.quizLevels.splice(this.editedIndex, 1)
            this.closeDelete()
            this.setFlashMessage({ type: 'success', message: "Delete successfully"})
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
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    create () {
      if (this.validation()) {
        this.$adminHttp.post('/admin/quiz_levels', {
          Name: this.editedItem.Name,
        })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizLevels.push(response.data)
            this.setFlashMessage({
              type: 'success', message: 'Created successfully'
            })
            this.close()
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
        this.$adminHttp.put(`/admin/quiz_levels/${this.editedItem.ID}`, {
          Name: this.editedItem.Name,
      })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            Object.assign(this.quizLevels[this.editedIndex], this.editedItem)
            this.setFlashMessage({
              type: 'success', message: 'Changes have been saved'
            })
            this.close()
          }
        })
        .catch(error => {
          console.log(error)
          this.errorMessages = ['Something went wrong. Please try again']
        })
      }
    },
  }
}
</script>

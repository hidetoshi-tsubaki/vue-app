<template>
  <div>
    <v-card class="px-2 pt-2">
      <v-card-title>
        <v-divider
          class="mr-4"
          vertical
        ></v-divider>
        Quiz Titles
        <v-spacer></v-spacer>
        <div align="right">
          <p class="mb-0">
            Search Condition
            <v-switch
              v-model="showSearchCondition"
              :label="showSearchCondition ? 'show': 'hide'"
              class="my-0 py-0 d-inline-flex"
            />
          </p>
        </div>
      </v-card-title>
      <MySearch
        v-if="showSearchCondition"
        v-model="searchConditions"
        :defaultConditions="defaultSearchConditions"
        url="quiz_titles"
      >
        <template v-slot:selectCategory>
          <MySelect
            v-model="searchConditions.selectedQuizLevelIDs"
            label="Quiz Level"
            :items="quizLevels"
            itemText="Name"
            itemValue="ID"
            multiple
            chips
            clearable
            @change="SetCategoryOptionsForSelect(
              'admin/quiz_sections/get_by_quiz_level_ids',
              'quizSectionOptionsForSearch',
              searchConditions.selectedQuizLevelIDs
            )"
          />
          <MySelect
            v-model="searchConditions.selectedQuizSectionIDs"
            label="Quiz Section"
            :items="quizSectionOptionsForSearch"
            itemText="Name"
            itemValue="ID"
            multiple
            chips
            clearable
            @focus="setInitialOptionsForSearchSelect(
              'admin/quiz_sections/get_by_quiz_level_ids',
              'quizSectionOptionsForSearch',
              searchConditions.selectedQuizLevelIDs
            )"
            />
        </template>
      </MySearch>
      <v-data-table
        :headers="headers"
        :items="tableData"
        :sort-by="headers"
        :loading="loading"
        loading-text="Loading... Please wait"
        item-key="ID"
        show-select
        v-model="selectedItems"
        hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-btn
              small
              color="error"
              @click="deleteItems"
              :disabled="!deleteBtn"
            >
              Delete Quiz Titles
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
                        @change="SetCategoryOptionsForSelect(
                          'admin/quiz_sections/get_by_quiz_level_ids',
                          'quizSectionOptionsForForm',
                          editedItem.QuizLevelID
                        )"
                      />
                      <MySelect
                        v-model="editedItem.QuizSectionID"
                        label="Quiz Section"
                        :items="quizSectionOptionsForForm"
                        itemText="Name"
                        itemValue="ID"
                        required
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
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete those items?</v-card-title>
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
          {{ ChangeFormat(item.CreatedAt, 'yyyy/MM/dd HH:mm') }}
        </template>
        <template v-slot:item.UpdatedAt="{ item }" v-slot:activator="{ChangeFormat}">
          {{ ChangeFormat(item.UpdatedAt, 'yyyy/MM/dd HH:mm') }}
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
        </template>
      </v-data-table>
      <Pagination
        v-model="this.searchConditions"
        :itemsTotalCount="itemsTotalCount"
      />
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixin from '../../../mixins/globalMethods.js'
import MySearch from '../../../components/parts/search/MySearch'
import MyInput from '../../../components/parts/form/MyInput'
import MySelect from '../../../components/parts/form/MySelect'
import ErrorMessages from '../../../components/parts/ErrorMessages'
import Pagination from '../../../components/parts/pagination/Pagination'
export default {
  name: 'IndexQuizTitles',
  components: {
    MySearch,
    MyInput,
    MySelect,
    ErrorMessages,
    Pagination
  },
  mixins: [mixin],
  data: () => ({
    tableData: [],
    loading: false,
    itemsTotalCount: 0,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "ID",
        sortable: false
      },
      {
        text: "Name",
        value: "Name",
        sortable: false
      },
      {
        text: "Rate",
        value: "Rate",
        sortable: false
      },
      {
        text: "Level",
        value: "QuizLevelName",
        sortable: false
      },
      {
        text: "Section",
        value: "QuizSectionName",
        sortable: false
      },
      {
        text: "CreatedAt",
        value: "CreatedAt",
        sortable: false
      },
      { text: "UpdatedAt",
        value: "UpdatedAt",
        sortable: false
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
    quizSectionOptionsForForm: [],
    nameRules: {
      max: 40,
      required: true
    },
    rateArray: [...Array(41)].map((_, i) => Math.round(((i * 0.1) + 1) * 10) / 10),
    errorMessages: [],
    showSearchCondition: true,
    quizSectionOptionsForSearch: [],
    defaultSearchConditions: {
      page: 1,
      selectedQuizLevelIDs: [],
      selectedQuizSectionIDs: [],
      keywords: '',
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false
    },
    searchConditions: {
      page: 1,
      keywords: '',
      selectedQuizLevelIDs: [],
      selectedQuizSectionIDs: [],
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false
    }
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
    '$route' () {
      this.fetchData()
    },
    dialog (val) {
      val || this.close()
    },
    'searchConditions.selectedQuizLevelIDs': function (val) {
      if (val.length === 0) {
        this.searchConditions.selectedQuizSectionIDs = []
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    fetchData () {
      const params = this.$route.query
      if (Object.keys(params).length) {
        this.loading = true
        this.ParseQueryAndSetSearchConditions()
        const queryString = this.MakeQueryStringFromSearchConditions()
        const url = 'admin/quiz_titles?' + queryString
        this.$adminHttp.get(url)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'warning',
              message: 'Failed to fetch data ...'
            })
          } else {
            this.quizLevels = response.data.QuizLevels
            this.tableData = response.data.QuizTitles
            this.itemsTotalCount = response.data.ItemsTotalCount
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      } else {
        this.searchConditions = Object.assign({}, this.defaultSearchConditions)
        this.SetQueryParamsFromSearchConditions(this.defaultSearchConditions)
      }
    },
    editItem (item) {
      this.editedItem = Object.assign({}, item)
      this.editedIndex = this.tableData.indexOf(item)
      this.editedItem.QuizLevelID = item.QuizLevelID
      this.editedItem.QuizSectionID = item.QuizSectionID
      this.SetCategoryOptionsForSelect(
        'admin/quiz_sections/get_by_quiz_level_ids',
        'quizSectionOptionsForForm',
        item.QuizLevelID
      )
      this.dialog = true
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
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    create () {
      if (this.validation()) {
        this.$adminHttp.post('/admin/quiz_titles', this.editedItem)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.searchConditions = Object.assign({}, this.defaultSearchConditions)
            this.$router.push({ query: ""})
            // this.tableData.push(response.data)
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
        this.$adminHttp.put(`/admin/quiz_titles/${this.editedItem.ID}`, this.editedItem)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            Object.assign(this.tableData[this.editedIndex], response.data)
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
        url: "/admin/quiz_titles",
        data: { DeleteItemIds: selectedItemIds }
      })
      .then(response => {
        if (response.data != null) {
          console.log(response.data)
          this.setFlashMessage({
            type: 'warning', message: 'Failed to delete quizzes'
          })
        } else {
          this.tableData = this.tableData.filter( function (item) {
            return selectedItemIds.includes(item.ID) === false
          })
          this.setFlashMessage({
            type: 'success', message: 'Remove quizzes successfully'
          })
        }
        this.closeDelete()
      })
      .catch((error) => {
        console.log(error)
        this.setFlashMessage({
          type: 'warning', message: 'Failed to delete quizzes'
        })
      })
    }
  }
}
</script>

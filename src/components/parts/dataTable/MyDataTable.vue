<template>
  <div>
    <v-card class="px-2 pt-2">
      <v-card-title class="pa-2">
        <v-divider
          class="mr-4 my-2"
          vertical
        ></v-divider>
        {{ title }}
        <v-spacer></v-spacer>
        <p class="mb-0 text-subtitle-1 grey--text text--darken-1">
          Search Condition
          <v-switch
            v-model="showSearchCondition"
            class="d-inline-flex"
            dense
          />
        </p>
      </v-card-title>
      <MySearch
        v-model="searchConditions"
        :defaultSearchConditions="defaultSearchConditions"
        :quizLevels="quizLevels"
        :url="defaultPath"
        v-if="showSearchCondition"
      >
        <template v-slot:selectCategory>
          <slot name="search"></slot>
        </template>
      </MySearch>
      <v-data-table
        :headers="headers"
        :items="tableData"
        :loading="loading"
        loading-text="Loading... Please wait"
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
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  class="mr-4"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon>
                  New
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }} {{ title }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <ErrorMessages :errorMessages=errorMessages></ErrorMessages>
                    <v-form ref="form">
                      <slot name="form"></slot>
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
            <v-btn
              small
              color="error"
              @click="deleteItems"
              :disabled="!deleteBtn"
              class="mr-4"
            >
              <v-icon left>
                mdi-trash-can-outline
              </v-icon>
              Delete items
            </v-btn>
            <v-spacer></v-spacer>
            <span class="d-none d-sm-flex mr-3 text-caption grey--text text--darken-3">
              viewing {{ viewingCount }} of {{ itemsTotalCount }} results
            </span>
            <span class="d-none d-sm-flex text-caption font-weight-bold grey--text text--darken-2">
              Page Size
            </span>
            <span class="d-none d-sm-flex ml-2" style="width: 65px;">
              <MySelect
                v-model="searchConditions.pageSize"
                :items="[10, 20, 30, 50, 70, 100]"
                required
                dense
                @change="changePageSize()"
              />
            </span>
            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete those items?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemsConfirm(defaultPath)">OK</v-btn>
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
          <v-icon
            small
            class="mr-2"
            @click="pageTransition(item)"
          >
            mdi-open-in-new
          </v-icon>
          <v-icon
            small
            class="mr-2"
            color="primary"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:footer v-if="showBottomDeleteBtn">
          <v-btn
              x-small
              color="error"
              class="ml-4"
              @click="deleteItems"
              :disabled="!deleteBtn"
            >
              Delete {{ title }}
          </v-btn>
        </template>
      </v-data-table>
      <Pagination
        v-model="page"
        :length="culculatePageCount"
      />
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixin from '../../../mixins/globalMethods.js'
import MySearch from '../../../components/parts/search/MySearch'
import MySelect from '../../../components/parts/form/MySelect'
import ErrorMessages from '../../../components/parts/ErrorMessages'
import Pagination from '../../../components/parts/pagination/Pagination'
export default {
  name: 'MyDataTable',
  components: {
    MySearch,
    MySelect,
    ErrorMessages,
    Pagination
  },
  mixins: [mixin],
  props: {
    value:                    { type: Object, required: true },
    defaultSearchConditions:  { type: Object, required: true },
    title:                    { type: String, required: true },
    headers:                  { type: Array, required: true },
    url:                      { type: String, required: true },
    linkName:                 { type: String, required: true },
    editedItem:               { type: Object, required: true },
    defaultItem:              { type: Object, required: true },
    initQuizLevels:           { type: Function, required: true },
    updateEditedItem:         { type: Function, required: true }
  },
  data: () => ({
    tableData: [],
    loading: false,
    quizLevels: [],
    itemsTotalCount: 0,
    selectedItems: [],
    dialog: false,
    dialogDelete: false,
    editedItemBefore: null,
    editedIndex: -1,
    errorMessages: [],
    showSearchCondition: true,
    page: 1,
    pageSize: 1
  }),
  computed: {
    searchConditions: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New' : 'Edit'
    },
    deleteBtn () {
      return this.selectedItems.length
    },
    showBottomDeleteBtn () {
      return this.tableData.length >= 20
    },
    defaultPath () {
      return 'admin/' + this.url
    },
    viewingCount () {
      const from = ((this.page - 1) * this.pageSize) + 1
      const to = from + this.tableData.length - 1
      return from + " - " + to 
    },
    culculatePageCount() {
      return Math.ceil(this.itemsTotalCount / Number(this.pageSize))
    }
  },
  watch: {
    '$route' () {
      this.fetchData()
    },
    dialog (val) {
      val || this.close()
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
        const path = this.defaultPath + '?' + queryString
        this.$adminHttp.get(path)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'warning',
              message: 'Failed to fetch data ...'
            })
          } else {
            this.page = this.searchConditions.page
            this.pageSize = this.searchConditions.pageSize
            this.tableData = response.data.TableData
            this.itemsTotalCount = response.data.ItemsTotalCount
            this.initQuizLevels(response.data.QuizLevels)
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
      this.updateEditedItem(item)
      this.editedItemBefore = Object.assign({}, item)
      this.editedIndex = this.tableData.indexOf(item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.updateEditedItem(this.defaultItem)
        this.editedIndex = -1
        this.errorMessages = []
      })
    },
    closeDelete () {
      this.dialogDelete = false
    },
    changePageSize () {
      var query = Object.assign({}, this.$route.query)
      if (query["pageSize"] != this.searchConditions.pageSize) {
        query["pageSize"] = this.searchConditions.pageSize
        query["page"] = 1
        this.$router.push({ query: query })
      }
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    create () {
      if (this.validation()) {
        this.$adminHttp.post(this.defaultPath, this.editedItem)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.searchConditions = Object.assign({}, this.defaultSearchConditions)
            this.$router.push({ query: ""})
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
        this.$adminHttp.put(`${this.defaultPath}/${this.editedItem.ID}`, this.editedItem)
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
    deleteItemsConfirm (deleteUrl) {
      const selectedItemIds = this.selectedItems.map(item => item.ID)
      this.$adminHttp.request({
        method: 'delete',
        url: deleteUrl,
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
    },
    pageTransition (item) {
      this.$router.push(this.url + "/" + item.ID)
    }
  }
}
</script>
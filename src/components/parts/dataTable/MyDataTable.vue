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
        :searchAction="searchAction"
        v-if="showSearchCondition"
      >
        <template v-slot:searchForm>
          <slot name="search"></slot>
        </template>
      </MySearch>
      <v-data-table
        :headers="headers"
        :items="tableData"
        :loading="loading"
        loading-text="Loading... Please wait"
        item-key="ID"
        :items-per-page="searchConditions.pageSize"
        show-select
        v-model="selectedItems"
        hide-default-footer
        class="mytable"
      >
        <template v-slot:top>
          <div
            class="d-flex flex-column-reverse flex-md-row justify-space-between my-6 mx-2">
            <div class="d-flex flex-wrap justify-start table-action">
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
                    class="mr-4 mb-3 mb-md-0"
                  >
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
                        <slot name="form" v-bind:editedIndex="editedIndex" ></slot>
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
                class="mr-4 mb-3 mb-md-0"
              >
              <v-icon left>
                mdi-trash-can-outline
              </v-icon>
                Delete items
              </v-btn>
              <v-dialog
                v-model="dialogDelete"
                max-width="600px"
              >
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
              <slot name="btn" v-bind:selectedItems="selectedItems"></slot>
            </div>
            <div class="d-flex flex-wrap md-justify-end mb-3 mb-md-0 table-info">
              <p class="d-flex mb-0 mr-3 text-caption text-sm-body-1 grey--text text--darken-3">
                viewing {{ viewingCount }} of {{ itemsTotalCount }} results
              </p>
              <v-divider vertical class="d-none d-sm-block mr-2"></v-divider>
              <p class="d-flex mb-0 text-caption text-sm-body-1 grey--text text--darken-2 page-size">
                PageSize
                <span class="pageSize ml-2" style="width: 65px;">
                  <MySelect
                    v-model="searchConditions.pageSize"
                    :items="[10, 20, 30, 50, 70, 100]"
                    required
                    dense
                    hide-details
                    @change="changePageSize()"
                  />
                </span>
              </p>
            </div>
          </div>
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
            small
            color="error"
            class="ml-4"
            @click="deleteItems"
            :disabled="!deleteBtn"
          >
            <v-icon left>
              mdi-trash-can-outline
            </v-icon>
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
    initQuizLevels:           { type: Function, default: () => 1 },
    updateEditedItem:         { type: Function, required: true },
    searchAction:             { type: Function }
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
      if (from === to ) {
        return from
      } else if (to === 0) {
        return 0
      } else {
        return from + " - " + to 
      }
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
      var path
      this.parseQueryAndSetSearchConditions()
      if (Object.keys(params).length) {
        this.loading = true
        const queryString = this.MakeQueryStringFromSearchConditions()
        path = this.defaultPath + '?' + queryString
      } else {
        path = this.defaultPath + '?page=1&PageSize=50'
        this.searchConditions = { ...this.defaultSearchConditions }
      }
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
    },
    parseQueryAndSetSearchConditions () {
      const params = this.$route.query
      let queryParams = Object.assign({}, params)
      const selectedIDsKeys = [
        'selectedQuizLevelIDs',
        'selectedQuizSectionIDs',
        'selectedQuizTitleIDs',
      ]
      selectedIDsKeys.forEach(key => {
        if (Array.isArray(queryParams[key])) {
          queryParams[key] = queryParams[key].map(Number)
        } else if (queryParams[key] != null){
          queryParams[key] = [Number(queryParams[key])]
        }
      })
      const paginationKeys = ["page", "pageSize"]
      paginationKeys.forEach(key => {
        queryParams[key] = Number(queryParams[key])
      })
      var condition = { ...this.defaultSearchConditions }
      condition = Object.assign(condition, queryParams)
      this.searchConditions = Object.assign(this.searchConditions, condition)
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
      this.$refs.form.reset()
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
    refleshTableData () {
      const selectedItemIds = this.selectedItems.map(item => item.ID)
      this.tableData = this.tableData.filter( function (item) {
        return selectedItemIds.includes(item.ID) === false
      })
      this.itemsTotalCount -= this.selectedItems.length
      this.selectedItems = []
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
        data: { SelectedItemIds: selectedItemIds }
      })
      .then(response => {
        if (response.data != null) {
          console.log(response.data)
          this.setFlashMessage({
            type: 'warning', message: 'Failed to delete items'
          })
        } else {
          this.reflashTableData()
          this.setFlashMessage({
            type: 'success', message: 'Delete items successfully'
          })
        }
        this.closeDelete()
      })
      .catch(
        this.setFlashMessage({
          type: 'warning', message: 'Failed to delete items'
        })
      )
    },
    pageTransition (item) {
      this.$router.push("/" + this.defaultPath + "/" + item.ID)
    }
  }
}
</script>

<style lang="scss">
.mytable .text-start, .v-application--is-ltr .mytable .v-data-table__mobile-row__cell{
  max-width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.mytable .table-info, .mytable .table-action, .mytable .page-size {
  align-items: center;
}

.mytable .pageSize .v-select {
  padding-bottom: 8px;
}

</style>

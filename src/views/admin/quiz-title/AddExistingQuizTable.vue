<template>
  <div>
    <v-card class="px-2 pt-2">
      <v-btn
        small
        absolute right
        @click="closeDialog()"
      >
        close
      </v-btn>
      <v-card-title class="pa-2 mt-3">
        <v-divider
          class="mr-4 my-2"
          vertical
        ></v-divider>
        Add Existing Quiz
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
        :searchFunc="search"
        v-if="showSearchCondition"
      >
        <template v-slot:searchForm>
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
            @change="SetCategoryOptionsForSelect(
              'admin/quiz_titles/get_by_quiz_section_ids',
              'quizTitleOptionsForSearch',
              searchConditions.selectedQuizSectionIDs
            )"
          />
          <MySelect
            v-model="searchConditions.selectedQuizTitleIDs"
            label="Quiz Title"
            :items="quizTitleOptionsForSearch"
            itemText="Name"
            itemValue="ID"
            multiple
            chips
            clearable
          />
          <my-checkbox
            v-model="searchConditions.notLinkedToAnyQuizTitles"
            label="Not linked to any Quiz Titles"
          />
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
          <v-toolbar flat class="mb-4">
            <v-btn
              small
              color="primary"
              @click="dialogAdd = !dialogAdd"
              :disabled="!addBtn"
              class="mr-4"
            >
              Add quizzes
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
                hide-details
                @change="search()"
              />
            </span>
            <v-dialog v-model="dialogAdd" max-width="600px">
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to add those items?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeAdd">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="addQuizzesConfirm()">OK</v-btn>
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
      </v-data-table>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="culculatePageCount"
          @input="getDataPerPage()"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixin from '../../../mixins/globalMethods.js'
import MySearch from '../../../components/parts/search/MySearch'
import MySelect from '../../../components/parts/form/MySelect'
import MyCheckbox from '../../../components/parts/form/MyCheckbox'
export default {
  name: 'MyDataTable',
  components: {
    MySearch,
    MySelect,
    MyCheckbox
  },
  mixins: [mixin],
  props: {
    quizLevels: { type: Array, required: true },
    closeDialog: { type: Function, required: true }
  },
  data: () => ({
    tableData: [],
    loading: false,
    selectedItems: [],
    dialogAdd: false,
    itemsTotalCount: 0,
    showSearchCondition: true,
    quizSectionOptionsForSearch: [],
    quizTitleOptionsForSearch: [],
    defaultSearchConditions: {
      page: 1,
      notLinkedToAnyQuizTitles: false,
      selectedQuizLevelIDs: [],
      selectedQuizSectionIDs: [],
      selectedQuizTitleIDs: [],
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
      notLinkedToAnyQuizTitles: false,
      keywords: '',
      selectedQuizLevelIDs: [],
      selectedQuizSectionIDs: [],
      selectedQuizTitleIDs: [],
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false
    },
    page: 1,
    pageSize: 1,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "ID",
        sortable: false
      },
      {
        text: "Question",
        value: "Question",
        sortable: false,
        cellClass: ""
      },
      {
        text: "Answer",
        value: "Answer",
        sortable: false
      },
      {
        text: "Choice1",
        value: "Choice1",
        sortable: false
      },
      {
        text: "Choice2",
        value: "Choice2",
        sortable: false
      },
      {
        text: "Choice3",
        value: "Choice3",
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
      }
    ]
  }),
  computed: {
    addBtn () {
      return this.selectedItems.length
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
    },
    defaultPath () {
      return '/admin/quizzes/get_existing_quizzes_to_add/' + this.$route.params.id
    }
  },
  watch: {
    'searchConditions.notLinkedToAnyQuizTitles': function (val) {
      if (val === true) {
        this.searchConditions.selectedQuizLevelIDs = []
      }
    },
    'searchConditions.selectedQuizLevelIDs': function (val) {
      if (val.length === 0) {
        this.searchConditions.selectedQuizSectionIDs = []
        this.searchConditions.selectedQuizTitleIDs = []
      } else {
        this.searchConditions.notLinkedToAnyQuizTitles = false
      }
    },
    'searchConditions.selectedQuizSectionIDs': function (val) {
      if (val.length === 0) {
        this.searchConditions.selectedQuizTitleIDs = []
      }
    },
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    fetchData () {
      this.loading = true
      this.$adminHttp.get(this.defaultPath)
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
        }
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    search () {
      this.loading = true
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
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    closeAdd () {
      this.dialogAdd = false
    },
    addQuizzes () {
      this.dialogAdd = true
    },
    addQuizzesConfirm () {
      const selectedItemIds = this.selectedItems.map(item => item.ID)
      this.$adminHttp.post(`/admin/quiz_titles/${this.$route.params.id}/add_quizzes`, {
        SelectedItemIds: selectedItemIds
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
          this.selectedItems = []
          this.setFlashMessage({
            type: 'success', message: 'Add quizzes successfully'
          })
        }
        this.closeAdd()
      })
      .catch((error) => {
        console.log(error)
        this.setFlashMessage({
          type: 'warning', message: 'Failed to delete quizzes'
        })
      })
    },
    changePageSize () {
      if (this.pageSize != this.searchConditions.pageSize) {
        this.searchConditions.pageSize = this.pageSize
        this.search()
      }
    },
    getDataPerPage () {
      if (this.page != this.searchConditions.page) {
        this.searchConditions.page = this.page
        this.search()
      }
    }
  }
}
</script>

<style>
.mytable .text-start, .v-application--is-ltr .mytable .v-data-table__mobile-row__cell{
  max-width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

</style>

<template>
  <div>
    <v-card class="pa-3 mb-5">
      <ShowProperty
        v-model="quizLevel"
        :formKeys="formKeys"
        url="quiz_levels"
        v-if="quizLevel"
      >
        <template v-slot:form>
          <MyInput
            v-model="quizLevel.Name"
            label="Name"
            v-bind="nameRules"
          />
        </template>
      </ShowProperty>
    </v-card>
    <v-btn
      v-if="!showTable"
      plain
      color="primary"
      @click="showTable = true"
    >
      show items belongs to quiz levels
    </v-btn>
    <v-card v-if="showTable">
      <MyDataTable
        v-if="showTable"
        :title="tableTitle"
        v-model="searchConditions"
        :defaultSearchConditions="defaultSearchConditions"
        :headers="headers"
        url="quiz_sections"
        linkName="showQuizSection"
        :editedItem.sync="editedItem"
        :defaultItem="defaultItem"
        :initQuizLevels="initQuizLevels"
        :updateEditedItem="updateEditedItem"
      >
        <template v-slot:form>
          <MyInput
            v-model="editedItem.Name"
            label="Name"
            v-bind="nameRules"
          />
        </template>
      </MyDataTable>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixin from '../../../mixins/globalMethods.js'
import MyDataTable from '../../../components/parts/dataTable/MyDataTable'
import MyInput from '../../../components/parts/form/MyInput'
import ShowProperty from '../../../components/parts/showPage/ShowProperty'
export default {
  name: 'ShowQuizLevel',
  components: {
    MyDataTable,
    MyInput,
    ShowProperty
  },
  mixins: [mixin],
  data: () => ({
    showTable: false,
    quizLevel: null,
    quizLevels: [],
    formKeys: [ "Name" ],
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
    editedItem: {
      QuizLevelID: 0,
      Name: '',
    },
    defaultItem: {
      QuizLevelID: 0,
      Name: '',
    },
    nameRules: {
      max: 40,
      required: true
    },
    showSearchCondition: true,
    defaultSearchConditions: {
      page: 1,
      selectedQuizLevelIDs: [],
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
      selectedQuizLevelIDs: [],
      keywords: '',
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false
    }
  }),
  computed: {
    tableTitle () {
      return "Quiz Sections In ' " + this.quizLevel.Name +" '"
    },
  },
  created () {
    this.$adminHttp.get(`admin/quiz_levels/${this.$route.params.id}`)
    .then(response => {
      if (response.data.ErrorMessages != null) {
        console.log(response.data.ErrorMessages)
        this.setFlashMessage({
          type: 'warning',
          message: 'Failed to fetch data ...'
        })
      } else {
        this.quizLevels = response.data.QuizLevels
        this.quizLevel = response.data.QuizLevel
        this.setQuizLevelID()
      }
    })
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    setQuizLevelID () {
      var quizLevelID = Number(this.$route.params.id)
      this.searchConditions.selectedQuizLevelIDs = quizLevelID
      this.defaultSearchConditions.selectedQuizLevelIDs = quizLevelID
      this.editedItem.QuizLevelID = quizLevelID
      this.defaultItem.QuizLevelID = quizLevelID
    },
    initQuizLevels (value) {
      this.quizLevels = value
    },
    updateEditedItem (value) {
      this.editedItem = Object.assign({}, value)
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    update () {
      if (this.validation()) {
        this.$adminHttp.put(`/admin/quiz_levels/${this.$route.params.id}`, {
          Name: this.quizLevel.Name
        })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizLevelBeforeEdit = {...this.quizLevel}
            this.setFlashMessage({
              type: 'success', message: 'Changes have been saved'
            })
          }
        })
      }
    },
    deleteQuizLevel () {
      if (window.confirm("Are you sure you want to delete quiz level ?")) {
        this.$adminHttp.delete('/admin/quiz_levels')
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({
              type: 'warning', message: 'Failed to delete quiz levels'
            })
          } else {
            this.setFlashMessage({
              type: 'success', message: 'delete quiz section successfully'
            })
            this.$router.push('/admin/quiz_levels')
          }
          this.closeDelete()
        })
      }
    }
  }
}
</script>

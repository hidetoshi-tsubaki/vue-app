<template>
  <div>
    <v-card class="pa-3 mb-5">
      <ShowProperty
        v-model="quizSection"
        :formKeys="formKeys"
        url="quiz_sections"
        v-if="quizSection"
      >
        <template v-slot:form>
          <my-select
            v-model="quizSection.QuizLevelID"
            label="Quiz Level"
            :items="quizLevels"
            itemText="Name"
            itemValue="ID"
            required
          />
          <MyInput
            v-model="quizSection.Name"
            label="Name"
            v-bind="nameRules"
          />
        </template>
      </showProperty>
    </v-card>
    <v-btn
      v-if="!showTable"
      plain
      color="primary"
      @click="showTable = true"
    >
      show items belongs to quiz Section
    </v-btn>
    <v-card v-if="showTable">
      <MyDataTable
        v-if="showTable"
        :title="tableTitle"
        v-model="searchConditions"
        :defaultSearchConditions="defaultSearchConditions"
        :headers="headers"
        url="quiz_titles"
        linkName="showQuizTitle"
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
          <MySelect
            v-model="editedItem.Rate"
            label="Rate"
            :items="rateArray"
            required
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
import MySelect from '../../../components/parts/form/MySelect'
import MyInput from '../../../components/parts/form/MyInput'
import ShowProperty from '../../../components/parts/showPage/ShowProperty'
export default {
  name: 'ShowQuizSection',
  components: {
    MyDataTable,
    MySelect,
    MyInput,
    ShowProperty
  },
  mixins: [mixin],
  data: () => ({
    showTable: false,
    quizSection: null,
    quizLevels: [],
    formKeys: [ "QuizLevelID", "Name" ],
    rateArray: [...Array(41)].map((_, i) => Math.round(((i * 0.1) + 1) * 10) / 10),
    quizSectionOptionsForForm: [],
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
      QuizSectionID: 0,
      Name: '',
    },
    defaultItem: {
      QuizSectionID: 0,
      Name: '',
    },
    nameRules: {
      max: 40,
      required: true
    },
    showSearchCondition: true,
    defaultSearchConditions: {
      page: 1,
      keywords: '',
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false,
      selectedQuizSectionIDs: []
    },
    searchConditions: {
      page: 1,
      keywords: '',
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false,
      selectedQuizSectionIDs: []
    }
  }),
  computed: {
    tableTitle () {
      return "Quiz Titles In ' " + this.quizSection.Name +" '"
    }
  },
  created () {
    this.$adminHttp.get(`admin/quiz_sections/${this.$route.params.id}`)
    .then(response => {
      if (response.data.ErrorMessages != null) {
        console.log(response.data.ErrorMessages)
        this.setFlashMessage({
          type: 'warning',
          message: 'Failed to fetch data ...'
        })
      } else {
        this.quizLevels = response.data.QuizLevels
        this.quizSection = response.data.QuizSection
        this.setID()
      }
    })
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    setID () {
      var quizSectionID = Number(this.$route.params.id)
      this.searchConditions.selectedQuizSectionIDs = quizSectionID
      this.defaultSearchConditions.selectedQuizSectionIDs = quizSectionID
      this.editedItem.QuizSectionID = quizSectionID
      this.defaultItem.QuizSectionID = quizSectionID
    },
    initQuizLevels (value) {
      this.quizLevels = value
    },
    updateEditedItem (value) {
      this.editedItem = Object.assign({}, value)
      if (this.editedItem.Name != "") {
        this.SetCategoryOptionsForSelect(
          'admin/quiz_sections/get_by_quiz_level_ids',
          'quizSectionOptionsForForm',
          value.QuizLevelID
        )
      }      
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    update () {
      if (this.validation()) {
        this.$adminHttp.put(`/admin/quiz_sections/${this.$route.params.id}`, {
          QuizLevelID: this.quizSection.QuizLevelID,
          Name: this.quizSection.Name
        })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.quizSection = response.data
            this.setFlashMessage({
              type: 'success', message: 'Changes have been saved'
            })
          }
        })
      }
    },
    deleteQuizSection () {
      if (window.confirm("Are you sure you want to delete quiz section ?")) {
        this.$adminHttp.delete('/admin/quiz_sections')
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({
              type: 'warning', message: 'Failed to delete quiz sections'
            })
          } else {
            this.setFlashMessage({
              type: 'success', message: 'delete quiz section successfully'
            })
            this.$router.push('/admin/quiz_sections')
          }
          this.closeDelete()
        })
      }
    }
  }
}
</script>

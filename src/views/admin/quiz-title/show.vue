<template>
  <div>
    <v-card class="pa-3 mb-5">
      <ShowProperty
        v-model="quizTitle"
        :formKeys="formKeys"
        url="quiz_titles"
        v-if="quizTitle"
      >
        <template v-slot:form>
          <my-select
            v-model="quizTitle.QuizLevelID"
            label="Quiz Level"
            :items="quizLevels"
            itemText="Name"
            itemValue="ID"
            required
            @change="SetCategoryOptionsForSelect(
              'admin/quiz_sections/get_by_quiz_level_ids',
              'quizSectionOptionsForTitleForm',
              quizTitle.QuizLevelID
            )"
          />
          <my-select
            v-model="quizTitle.QuizSectionID"
            label="Quiz Section"
            :items="quizSectionOptionsForTitleForm"
            itemText="Name"
            itemValue="ID"
            required
          />
          <MyInput
            v-model="quizTitle.Name"
            label="Name"
            v-bind="nameRules"
          >
          </MyInput>
          <my-select
            v-model="quizTitle.Rate"
            label="Rate"
            :items="rateArray"
            required
          />
        </template>
      </ShowProperty>
    </v-card>
    <v-btn
      v-if="!showTable"
      plain
      small
      color="primary"
      @click="showTable = true"
    >
      show quizzes belongs to quiz Title
    </v-btn>
    <v-card v-if="showTable">
      <MyDataTable
        v-if="showTable"
        :title="tableTitle"
        v-model="searchConditions"
        :defaultSearchConditions="defaultSearchConditions"
        :headers="headers"
        url="quizzes"
        linkName="showQuizzes"
        :editedItem.sync="editedItem"
        :defaultItem="defaultItem"
        :updateEditedItem="updateEditedItem"
      >
        <template v-slot:form>
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
        </template>
      </MyDataTable>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixin from '../../../mixins/globalMethods.js'
import MyDataTable from '../../../components/parts/dataTable/MyDataTable'
import MyTextarea from '../../../components/parts/form/MyTextarea'
import MySelect from '../../../components/parts/form/MySelect'
import MyInput from '../../../components/parts/form/MyInput'
import ShowProperty from '../../../components/parts/showPage/ShowProperty'
export default {
  name: 'ShowQuizTitle',
  components: {
    MyDataTable,
    MySelect,
    MyInput,
    MyTextarea,
    ShowProperty
  },
  mixins: [mixin],
  data: () => ({
    showTable: false,
    quizTitle: null,
    quizLevels: [],
    formKeys: [ "QuizSectionID", "Name", "Rate" ],
    quizSectionOptionsForTitleForm: [],
    quizSectionOptionsForQuizForm: [],
    rateArray: [...Array(41)].map((_, i) => Math.round(((i * 0.1) + 1) * 10) / 10),
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
        sortable: false
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
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      }
    ],
    editedItem: {
      QuizLevelID: 0,
      QuizSectionID: 0,
      QuizTItleID: 0,
      Question: "",
      Answer: "",
      Choice1: "",
      Choice2: "",
      Choice3: ""
    },
    defaultItem: {
      QuizLevelID: 0,
      QuizSectionID: 0,
      QuizTItleID: 0,
      Question: "",
      Answer: "",
      Choice1: "",
      Choice2: "",
      Choice3: ""
    },
    nameRules: {
      max: 40,
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
      return "Quizzes In ' " + this.quizTitle.Name +" '"
    }
  },
  created () {
    this.$adminHttp.get(`admin/quiz_titles/${this.$route.params.id}`)
    .then(response => {
      if (response.data.ErrorMessages != null) {
        console.log(response.data.ErrorMessages)
        this.setFlashMessage({
          type: 'warning',
          message: 'Failed to fetch data ...'
        })
      } else {
        this.quizLevels = response.data.QuizLevels
        this.quizSectionOptionsForTitleForm = response.data.QuizSections
        this.quizTitle = response.data.QuizTitle
        this.setQuizTitleID()
      }
    })
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    setQuizTitleID () {
      var quizTitleID = Number(this.$route.params.id)
      this.searchConditions.selectedQuizTitleIDs = quizTitleID
      this.defaultSearchConditions.selectedQuizTitleIDs = quizTitleID
      this.editedItem.QuizTitleID = quizTitleID
      this.defaultItem.QuizTitleID = quizTitleID
    },
    updateEditedItem (value) {
      this.editedItem = Object.assign({}, value)
      // if (this.editedItem.Name != "") {
      //   this.SetCategoryOptionsForSelect(
      //     'admin/quiz_sections/get_by_quiz_level_ids',
      //     'quizSectionOptionsForQuizForm',
      //     value.QuizLevelID
      //   )
      // } 
    },
    validation () {
      return this.$refs.form.validate() ? true : false
    },
  }
}
</script>

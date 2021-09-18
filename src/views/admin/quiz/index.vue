<template>
  <MyDataTable
    title="Quiz"
    v-model="searchConditions"
    :defaultSearchConditions="defaultSearchConditions"
    :headers="headers"
    url="quizzes"
    linkName="showQuiz"
    :editedItem.sync="editedItem"
    :defaultItem="defaultItem"
    :initQuizLevels="initQuizLevels"
    :updateEditedItem="updateEditedItem"
  >
    <template v-slot:search>
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
    </template>
    <template v-slot:form>
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
        @focus="SetCategoryOptionsForSelect(
          'admin/quiz_sections/get_by_quiz_level_ids',
          'quizSectionOptionsForForm',
          editedItem.QuizLevelID
        )"
      />
      <MySelect
        v-model="editedItem.QuizTitleID"
        label="Quiz Title"
        :items="quizTitleOptionsForForm"
        itemText="Name"
        itemValue="ID"
        required
        @focus="SetCategoryOptionsForSelect(
          'admin/quiz_titles/get_by_quiz_section_ids',
          'quizTitleOptionsForForm',
          editedItem.QuizSectionID
        )"
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
    </template>
  </MyDataTable>
</template>

<script>
import mixin from '../../../mixins/globalMethods.js'
import MyDataTable from '../../../components/parts/dataTable/MyDataTable'
import MySelect from '../../../components/parts/form/MySelect'
import MyInput from '../../../components/parts/form/MyInput'
import MyTextarea from '../../../components/parts/form/MyTextarea'
export default {
  name: 'IndexQuizTitles',
  components: {
    MyDataTable,
    MySelect,
    MyInput,
    MyTextarea
  },
  mixins: [mixin],
  data: () => ({
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
      QuizTitleID: 0,
      Question: "",
      Answer: "",
      Choice1: "",
      Choice2: "",
      Choice3: ""
    },
    defaultItem: {
      QuizLevelID: 0,
      QuizSectionID: 0,
      QuizTitleID: 0,
      Question: "",
      Answer: "",
      Choice1: "",
      Choice2: "",
      Choice3: ""
    },
    quizLevels: [],
    quizSectionOptionsForForm: [],
    quizTitleOptionsForForm: [],
    questionRules: {
      max: 300,
      required: true
    },
    choiceRules: {
      max: 150,
      required: true
    },
    rateArray: [...Array(41)].map((_, i) => Math.round(((i * 0.1) + 1) * 10) / 10),
    showSearchCondition: true,
    quizSectionOptionsForSearch: [],
    quizTitleOptionsForSearch: [],
    defaultSearchConditions: {
      page: 1,
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
    }
  }),
  watch: {
    'searchConditions.selectedQuizLevelIDs': function (val) {
      if (val.length === 0) {
        this.searchConditions.selectedQuizSectionIDs = []
        this.searchConditions.selectedQuizTitleIDs = []
      }
    },
    'searchConditions.selectedQuizSectionIDs': function (val) {
      if (val.length === 0) {
        this.searchConditions.selectedQuizTitleIDs = []
      }
    },
    'editedItem.QuizLevelID': function (val) {
      if (val.length === 0 ) {
        this.editedItem.QuizSectionID = 0
        this.editedItem.QuizTitleID = 0
      }
    },
    'editedItem.QuizSectionID': function (val) {
      if (val.length === 0 ) {
        this.editedItem.QuizTitleID = 0
      }
    }
  },
  methods: {
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
      if (this.editedItem.Name != "") {
        this.SetCategoryOptionsForSelect(
          'admin/quiz_sections/get_by_quiz_section_ids',
          'quizSectionOptionsForForm',
          value.QuizSectionID
        )
      }
    }
  }
}
</script>

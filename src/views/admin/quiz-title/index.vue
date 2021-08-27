<template>
  <MyDataTable
    title="Quiz Title"
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
        @focus="setInitialOptionsForSearchSelect(
          'admin/quiz_sections/get_by_quiz_level_ids',
          'quizSectionOptionsForSearch',
          searchConditions.selectedQuizLevelIDs
        )"
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
    </template>
  </MyDataTable>
</template>

<script>
import mixin from '../../../mixins/globalMethods.js'
import MyDataTable from '../../../components/parts/dataTable/MyDataTable'
import MySelect from '../../../components/parts/form/MySelect'
import MyInput from '../../../components/parts/form/MyInput'
export default {
  name: 'IndexQuizTitles',
  components: {
    MyDataTable,
    MySelect,
    MyInput
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
  watch: {
    'searchConditions.selectedQuizLevelIDs': function (val) {
      if (val.length === 0) {
        this.searchConditions.selectedQuizSectionIDs = []
      }
    },
    'editedItem.QuizLevelID': function (val) {
      if (val.length === 0 ) {
        this.editedItem.QuizSectionIDs = []
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
    }
  }
}
</script>

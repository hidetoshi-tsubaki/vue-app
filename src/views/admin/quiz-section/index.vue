<template>
  <MyDataTable
    title="Quiz Section"
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
      />
    </template>
    <template v-slot:form>
      <MySelect
        v-model="editedItem.QuizLevelID"
        label="Quiz Level"
        :items="quizLevels"
        itemText="Name"
        itemValue="ID"
      />
      <MyInput
        v-model="editedItem.Name"
        label="Name"
        v-bind="nameRules"
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
        text: "Level",
        value: "QuizLevelName",
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
    quizLevels: [],
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
      keywords: '',
      selectedQuizLevelIDs: [],
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false
    }
  }),
  methods: {
    initQuizLevels (value) {
      this.quizLevels = value
    },
    updateEditedItem (value) {
      this.editedItem = Object.assign({}, value)
    }
  }
}
</script>

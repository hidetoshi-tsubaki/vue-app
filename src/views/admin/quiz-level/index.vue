<template>
  <MyDataTable
    title="Quiz Level"
    v-model="searchConditions"
    :defaultSearchConditions="defaultSearchConditions"
    :headers="headers"
    url="quiz_levels"
    linkName="showQuizLevel"
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
</template>

<script>
import mixin from '../../../mixins/globalMethods.js'
import MyDataTable from '../../../components/parts/dataTable/MyDataTable'
import MyInput from '../../../components/parts/form/MyInput'
export default {
  name: 'IndexQuizTitles',
  components: {
    MyDataTable,
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
      Name: '',
    },
    defaultItem: {
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
      ascending: false
    },
    searchConditions: {
      page: 1,
      keywords: '',
      fromCreationDate: '',
      toCreationDate: '',
      fromUpdateDate: '',
      toUpdateDate: '',
      pageSize: 50,
      ascending: false
    }
  }),
  methods: {
    updateEditedItem (value) {
      this.editedItem = Object.assign({}, value)
    }    
  }
}
</script>

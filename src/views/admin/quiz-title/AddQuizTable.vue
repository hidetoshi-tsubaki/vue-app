<template>
  <v-card>
    <v-card-title>
      Add Existing Quiz
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="quizzes"
      :sort-by="headers"
      :search='search'
      item-key="ID"
      @item-selected="enable"
      @input="alert"
      show-select
    >
    <template v-slot:top v-slot:activator="addQuizzes">
      <v-toolbar flat>
          <v-btn
            small
            color="primary"
            class="mb-2"
            @click="addQuizzes"
            :disabled="!selectedAny"
          >
            Add
          </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.Question="{ item }">
      {{ truncate(item.Question, 30, '...')}}
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    quizTitle: { type: Object, required: true }
  },
  data () {
    return {
      selected: [],
      selectedAny: false,
      headers: [
        {
          text: "ID",
          align: "start",
          value: "ID"
        },
        {
          text: "Question",
          value: "Question",
        },
        {
          text: "Answer",
          value: "Answer"
        },
        {
          text: "Choice1",
          value: "Choice1"
        },
        {
          text: "Choice2",
          value: "Choice2"
        },
        {
          text: "Choice3",
          value: "Choice3"
        },
      ],
      search: '',
      quizzes: [],
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    fetchData: function () {
      this.$adminHttp.get(`/admin/quizzes/to_add/${this.quizTitle.ID}`)
      .then(response => {
        if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({
              type: 'warning',
              message: 'Failed to fetch data ...'
            })
          } else {
            this.quizzes = response.data
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    addQuizzes () {
      if (this.selected.length) {
        alert("checked")
      } else {
        alert("not checked")
      }
    },
    enable(data) {
      this.selectedAny = data.value
    },
    alert(data) {
      if (data) {
        alert(data)
      } else {
        alert(data)
      }
    }
  }
}
</script>

<template>
  <v-menu v-model="menu" max-width="290px" min-width="290px">
    <template v-slot:activator="{ on }">
      <v-text-field
        slot="activator"
        v-model="picker"
        :label="label"
        readonly
        v-on="on"
        prepend-inner-icon="mdi-calendar"
        clear-icon="mdi-close-circle"
        clearable
        hide-details
        @click:clear="clearDate"
      >
      </v-text-field>
    </template>
    <v-date-picker
      v-model="picker"
      :max="ISO8601FormatedDate(max)"
      :min="ISO8601FormatedDate(min)"
    />
  </v-menu>
</template>

<script>
import moment from 'moment'
export default {
  name: "MyDatepickerInput",
  props: {
    value: { type: String },
    label: { type: String },
    type: { type: String, default: 'Date' },
    prependIcon: { type: String },
    required: { type: Boolean, default: false },
    max: { type: String },
    min: { type: String }
  },
  computed: {
    picker: {
      get() {
        return this.value
      },
      set(value) {
        this.menu = false
        this.$emit("input", value)
      }
    },
    ISO8601FormatedDate () {
      return function (date) {
        return date ? moment(date).format('YYYY-MM-DD') : ''
      }
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    clearDate () {
      this.$emit("input", null)
    }
  }
}
</script>
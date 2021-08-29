<template>
  <v-text-field
    v-model="inputValue"
    :label="label"
    :rules="rules"
    :counter="max"
    :prepend-icon="prependIcon"
    :type="type"
    :hide-details="hideDetails"
  />
</template>

<script>
export default {
  name: "MyInput",
  props: {
    value: { type: String, required: true },
    label: { type: String },
    type: { type: String, default: 'text' },
    prependIcon: { type: String},
    required: { type: Boolean, default: false },
    max: { type: Number },
    allowSpace: { type: Boolean, default: false },
    hideDetails: { type: [Boolean, String], default: false }
  },
  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    },
    rules: function () {
      const rules = []

      if (this.max) {
        const rule =
          v => (v || '').length <= this.max ||
          `${this.label} must be less than ${this.max} characters`

        rules.push(rule)
      }

      if (this.required) {
        const rule =
          v => !!v || `${this.label} is required`

        rules.push(rule)
      }

      if (this.allowSpace) {
        const rule =
          v => (v || '').indexOf(' ') < 0 ||
          'No spaces are allowed'

        rules.push(rule)
      }

      return rules
    }
  }
}
</script>

<template>
  <v-textarea
    v-model="inputValue"
    :label="label"
    :rules="rules"
    :counter="max"
    :rows="rows"
    :row-height="height"
    :type="type"
    auto-grow
    outlined
  />
</template>

<script>
export default {
  name: "MyTextarea",
  props: {
    value: { type: String, required: true },
    label: { type: String },
    type: { type: String, default: 'text' },
    rows: { type: String, default: "5" },
    height: { type: String, default: "30" },
    max: { type: Number }
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

      return rules
    }
  }
}
</script>

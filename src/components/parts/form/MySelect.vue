<template>
  <v-select
    v-model="selectValue"
    :label="label"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    :rules="rules"
    @change="change"
  />
</template>

<script>
export default {
  name: "MySelect",
  props: {
    value: { type: Number, required: true },
    items: { type: Array },
    itemText: { type: String },
    itemValue: { type: String},
    label: { type: String, required: true },
    required: { type: Boolean, default: false }
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    },
    rules: function () {
      const rules = []

      if (this.required) {
        const rule =
          v => !!v || `${this.label} is required`

        rules.push(rule)
      }

      return rules
    }
  },
  methods: {
    change () {
      this.$emit('change')
    }
  }
}
</script>
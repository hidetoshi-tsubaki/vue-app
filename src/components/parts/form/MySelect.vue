<template>
  <v-select
    v-model="selectValue"
    :label="label"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    :rules="rules"
    :multiple="multiple"
    :chips="chips"
    :clearable="clearable"
    @change="change"
    @focus="focus"
  >
  </v-select>
</template>

<script>
export default {
  name: "MySelect",
  props: {
    value:      { type: [ Number, Array ], required: true },
    items:      { type: Array },
    itemText:   { type: String },
    itemValue:  { type: String},
    label:      { type: String },
    multiple:   { type: Boolean, default: false },
    chips:      { type: Boolean, default: false },
    clearable:  { type: Boolean, default: false },
    required:   { type: Boolean, default: false }
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
        const rule = v => !!v || `${this.label} is required`
        rules.push(rule)
      }

      return rules
    }
  },
  methods: {
    change () {
      this.$emit('change')
    },
    focus () {
      this.$emit('focus')
    }
  }
}
</script>
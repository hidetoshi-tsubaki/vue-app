<template>
  <v-checkbox
    v-model="inputValue"
    :label="label"
  />
</template>

<script>
export default {
  name: "MyInput",
  props: {
    value: { type: [ Boolean, String, Number ], required: true },
    label: { type: String },
  },
  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    }
  }
}
</script>

<template>
  <v-text-field
    v-model="inputValue"
    :label="label"
    :rules="passwordRule"
    :counter="max"
    prepend-icon="mdi-lock"
    :type="showPassword ? 'text' : 'password'"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="showPassword = !showPassword"
  />
</template>

<script>
export default {
  name: "MyPasswordInput",
  props: {
    value: { type: String, required: true },
    label: { type: String, required: true },
    max: { type: String}
  },
  data: function () {
    return {
      passwordRule: [
        v => !!v || `${this.label} is required`,
        v => (v && v.length <= 40) ||
          `${this.label} must be less than 40 characters`,
        v => (v || '').indexOf(' ') < 0 ||
          'No spaces are allowed'
      ],
      showPassword: false
    }
  },
    computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>
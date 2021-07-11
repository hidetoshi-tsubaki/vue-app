<template>
  <v-text-field
    v-model="inputValue"
    label="Confirm Password"
    :rules="confirmPasswordRule"
    :counter="40"
    prepend-icon="mdi-lock"
    :type="showPassword ? 'text' : 'password'"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="showPassword = !showPassword"
  />
</template>

<script>
export default {
  name: "MyConfirmPasswordInput",
  props: {
    value: { type: String, required: true },
    originPassword: { type: String, required: true }
  },
  data: function () {
    return {
      confirmPasswordRule: [
        v => (v && v == this.originPassword) ||
          'Please make sure your new passwords match',
        v => (v || '').indexOf(' ') < 0 ||
          'No spaces are allowed'
      ],
      showPassword: false
    }
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
};
</script>
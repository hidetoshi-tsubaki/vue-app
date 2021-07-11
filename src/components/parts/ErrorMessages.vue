<template>
  <div>
    <v-alert
      v-for="(message, key) in errorMessages"
      :key="key"
      class="font-weight-bold"
      outlined
      type="error"
      dense
    >
      {{ message }}
    </v-alert>
  </div>
</template>

<script>
export default {
  props: {
    errorMessages: Array
  }
}
</script>

<template>
  <v-alert
    v-if="flashMessage"
    dense
    border="left"
    :color="messageColor"
    :type="flashMessage.type"
    transition="scroll-y-transition"
    class="flash_message"
  >
    {{ flashMessage.message }}
  </v-alert>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({ flashMessage: 'flashMessage/getFlashMessage'}),
    messageColor () {
      const type = this.flashMessage.type

      if (type === 'success') {
        return 'green'
      } else if (type === 'error') {
        return 'yellow'
      } else if (type === 'warning') {
        return 'red'
      } else {
        return 'blue'
      }
    }
  }
}
</script>

<style scoped>
.flash_message {
  position: fixed;
  z-index: 10;
  top: 30px;
  right: 10px;
}
</style>

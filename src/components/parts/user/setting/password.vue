<template>
  <v-card class="pa-5">
    <p class="text-h4 font-weight-bold text-center blue-grey--text text--darken-1">
      Password
    </p>
    <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
    <v-form v-on:submit.prevent="post" ref="form">
      <MyPasswordInput
        v-model="currentPassword"
        label="Current Password"
        max=40
      />
      <MyPasswordInput
        v-model="newPassword"
        label="New Password"
        max=40
      />
      <MyConfirmPasswordInput
        v-model="confirmPassword"
        :originPassword="newPassword"
        max=40
      />
      <v-card-actions class="justify-center">
        <v-btn
          class="font-weight-bold"
          color="primary"
          @click="post()"
          width="120px"
        >Update</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ErrorMessages from '../../ErrorMessages'
import MyPasswordInput from '../../form/MyPasswordInput'
import MyConfirmPasswordInput from '../../form/MyConfirmPasswordInput'
export default {
  components: {
    ErrorMessages,
    MyPasswordInput,
    MyConfirmPasswordInput
  },
  data: function () {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      errorMessages: []
    }
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' })
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    validate () {
      return this.$refs.form.validate() ? true : false
    },
    post: function () {
      if (this.validate()) {
        this.$userHttp.put(`/users/${this.user.ID}/password`, {
          CurrentPassword: this.currentPassword,
          NewPassword: this.newPassword
        })
          .then(response => {
            if (response.data.ErrorMessages != null) {
              this.errorMessages = response.data.ErrorMessages
            } else {
              this.setFlashMessage('success', 'Changes have been saved')
              this.$refs.form.reset()
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
  }
}
</script>

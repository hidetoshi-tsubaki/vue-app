<template>
  <div>
    <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
    <v-form ref="form">
      <MyInput
        v-model="name"
        label="Name"
        v-bind="nameRules"
        prepend-icon="mdi-account-circle"
      />

      <MyPasswordInput
        v-model="password"
        label="Password"
        max="40"
      />
      <MyConfirmPasswordInput
        v-model="confirmPassword"
        :originPassword="password"
        max="40"
      />
      <v-card-actions class="justify-center">
        <v-btn
          class="font-weight-bold"
          color="green accent-4 white--text font-weight-bold"
          @click="signup"
          width="50%"
        >
          Sign up
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ErrorMessages from '../../ErrorMessages'
import MyInput from '../../form/MyInput'
import MyPasswordInput from '../../form/MyPasswordInput'
import MyConfirmPasswordInput from '../../form/MyConfirmPasswordInput'
export default {
  name: 'SignUp',
  components: {
    ErrorMessages,
    MyInput,
    MyPasswordInput,
    MyConfirmPasswordInput
  },
  data: function () {
    return {
      name: '',
      password: '',
      confirmPassword: '',
      nameRules: {
        max: 40,
        required: true
      },
      errorMessages: []
    }
  },
  methods: {
    ...mapActions({ authorize: 'userLoginStatus/authorize' }),
    validate () {
      return this.$refs.form.validate() ? true : false
    },
    signup: function () {
      if (this.validate()) {
      this.$axios.post('/signup', {
          Name: this.name,
          Password: this.password
        })
          .then(response => {
            if (response.data.ErrorMessages != null) {
              this.errorMessages = response.data.ErrorMessages
            } else {
              this.authorize(response.data)
              this.$router.push({ path: '/dashboard'})
            }
          })
          .catch(error => {
            console.log(error)
            this.errorMessages = ['Something went wrong. Please try again']
          })
      }
    }
  }
}
</script>

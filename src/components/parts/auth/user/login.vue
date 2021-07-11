<template>
  <div>
    <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
    <v-form v-on:submit.prevent="login" ref="form">
      <MyInput
        v-model="name"
        label="Name"
        v-bind="nameRules"
        prepend-icon="mdi-account-circle"
      />
      <MyPasswordInput
        v-model="password"
        label="Password"
      />
      <v-card-actions class="justify-center">
        <v-btn
          class="font-weight-bold"
          color="primary"
          @click="login"
          width="100%"
        >
          log in
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
export default {
  name: 'Login',
  components: {
    ErrorMessages,
    MyInput,
    MyPasswordInput
  },
  data: function () {
    return {
      name: '',
      password: '',
      confirmPassword: '',
      errorMessages: [],
      nameRules: {
        required: true,
        allowSpaces: false
      },
      showPassword: false
    }
  },
  methods: {
    ...mapActions({ authorize: 'userLoginStatus/authorize' }),
    validate () {
      return this.$refs.form.validate() ? true: false
    },
    login () {
      if (this.validate()) {
        this.$axios.post('/login', {
            Name: this.name,
            Password: this.password
          })
            .then(response => {
              if (response.data.ErrorMessages != null) {
                this.errorMessages = response.data.ErrorMessages
              } else {
                this.authorize(response.data)
                this.$router.push({ path: '/dashboard' })
              }
            })
            .catch(error => {
              console.log(error)
              this.errorMessages = ['Something went wrong. Please try again']
            })
      }
    },
  }
}
</script>

<template>
<div align="center">
  <v-card style="max-width: 420px">
    <v-card-text>
    <p class="text-h5 mt-5">Admin User Login</p>
    <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
      <v-form>
        <MyInput
          v-model="name"
          label="Name"
          v-bind="nameRules"
          prepend-icon="mdi-account-edit"
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
    </v-card-text>
  </v-card>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import ErrorMessages from '../../../components/parts/ErrorMessages'
import MyInput from '../../../components/parts/form/MyInput'
import MyPasswordInput from '../../../components/parts/form/MyPasswordInput'
export default {
  name: 'AdminLogIn',
  components: {
    ErrorMessages,
    MyInput,
    MyPasswordInput
  },
  data: function () {
    return {
      name: '',
      password: '',
      errorMessages: []
    }
  },
  methods: {
    ...mapActions({ authorize: 'adminLoginStatus/authorize' }),
    login: function () {
      const url = '/admin_login'
      this.axios.post(url, {
        Name: this.name,
        Password: this.password
      })
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.authorize(response.data.Token.Token)
            this.$router.push({ path: '/admin/home' })
          }
        })
        .catch(error => {
          console.log(error)
          this.errorMessages = ['Something went wrong. Please try again']
        })
    }
  }
}
</script>

<template>
  <v-card class="px-5 pt-5">
    <p class="text-h4 font-weight-bold text-center blue-grey--text text--darken-1">
      Profile
    </p>
    <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
    <v-form v-on:submit.prevent="post" ref="form">
      <MyInput
      v-model="name"
      label="Name"
      v-bind="nameRules"
      prepend-icon="mdi-account-circle"
      />
      <v-card-actions class="justify-center">
        <v-btn
          class="font-weight-bold"
          color="primary"
          @click="post"
          width="120px"
        >Update</v-btn>
      </v-card-actions>
    </v-form>
    <p class="text-right">
      <router-link to="deleteAcount">
        Delete Acount
      </router-link>
    </p>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ErrorMessages from '../../ErrorMessages'
import MyInput from '../../form/MyInput'
export default {
  components: {
    ErrorMessages,
    MyInput
  },
  data: function () {
    return {
      name: '',
      nameRules: {
        required: true,
        max: 40,
      },
      errorMessages: []
    }
  },
  created () {
    this.name = this.user.Name
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' })
  },
  methods: {
    ...mapActions({ updateUser: 'userLoginStatus/setUser' }),
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    validate () {
      return this.$refs.form.validate() ? true : false
    },
    post () {
      if (this.validate()) {
        this.$userHttp.put(`/users/${this.user.ID}`, {
            Name: this.name
          })
          .then(response => {
            if (response.data.ErrorMessages != null) {
              console.log(response.data.ErrorMessages)
            } else {
              this.updateUser(response.data.User)
              this.setFlashMessage({type: 'success', message: 'Changes have been saved'})
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

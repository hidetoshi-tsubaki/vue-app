<template>
  <div align="center">
    <v-card
      class="pa-5 pa-sm-15"
      style="max-width: 600px"
    >
      <p class="mb-10 text-h6 text-sm-h5 font-weight-bold blue-grey--text text--darken-1">
        Deleting your account
      </p>
      <v-card 
        class="mb-10 py-5 px-3 pa-sm-9 text-left red--text text--darken-1"
        color="red lighten-5"
      >
        <p class="font-weight-bold">
          <v-icon class="red--text text--darken-1">
            mdi-check-circle-outline
          </v-icon>
          Please be sure check before deleting
        </p>
        <p>You will lose access to all the data associated with your acount.</p>
      </v-card>
      <p class="text-left">How can we improve?(*optional, up to 255 characters)</p>
      <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
      <v-form ref="form">
        <MyTextarea
          v-model="contents"
          max="255"
        />
        <v-card-actions>
          <v-btn
            class="font-weight-bold white--text"
            color="red lighten-1"
            @click="deleteAccount"
          >
            Delete Accont
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ErrorMessages from '../../components/parts/ErrorMessages'
import MyTextarea from '../../components/parts/form/MyTextarea'
export default {
  name: 'Delete',
  components: {
    ErrorMessages,
    MyTextarea
  },
  data () {
    return {
      contents: '',
      errorMessages: []
    }
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' })
  },
  methods: {
    ...mapActions({ userLogout: 'userLoginStatus/unauthorize' }),
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    validate () {
      return this.$refs.form.validate() ? true : false
    },
    deleteAccount () {
      if (this.validate()) {
        if (window.confirm('Are you sure? This cannot be undone')) {
          this.$userHttp.post(`/users/${this.user.ID}`, {
              Contents: this.contents
            })
              .then(response => {
                if (response.data === null) {
                  this.setFlashMessage({ type: "success", message: 'Delete account successfully'})
                  this.userLogout()
                } else if (response.data.ErrorMessages != null) {
                  this.errorMessages = response.data.ErrorMessages
                }
              })
              .catch(error => {
                console.log(error)
                this.errorMessages = ['Something went wrong. Please try again']
              })
        } else {
          return false
        }
      }
    }

  }
}
</script>

<template>
  <div align="center">
    <div class="mb-4 mb-sm-10 text-center">
      <p class="text-h5 text-sm-h4 font-weight-bold amber--text text--darken-3">
        JP Language Lab
      </p>
      <p class="mt-7 text-h6 text-sm-h4">
        Improve your Japanese skill <br>on JP Language Lab
      </p>
    </div>
    <v-card style="max-width: 420px">
      <v-card-text>
        <Login />
        <v-divider class="mt-3 mb-3"></v-divider>
        <v-card-actions class="justify-center">
          <v-btn
            to="/"
            width="70%"
            color="green accent-4 white--text font-weight-bold"
            @click.stop="dialog = true"
          >
            Create Account
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-actions class="text-right">
          <v-btn
            @click="dialog = false"
            icon
            small
            class="align-right"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-card-title class="headline justify-center font-weight-bold">Create Account</v-card-title>
          <Signup />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Login from '../components/parts/auth/user/login'
import Signup from '../components/parts/auth/user/signup'
export default {
  name: 'Root',
  components: {
    Login,
    Signup,
  },
  data () {
    return {
      dialog: false
    }
  }
}
</script>

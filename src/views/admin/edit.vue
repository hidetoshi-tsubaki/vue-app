<template>
<div>
  <div>
    <h1>Edit Profile</h1>
  </div>
  <ErrorMessages :errorMessages=this.errorMessages></ErrorMessages>
  <div>
    <form v-on:submit.prevent="update">
      <label for="name">Name: </label>
      <input type="text" id="name" name="Name" v-model="newName"/>
      <label for="current-password">Current Password: </label>
      <input type="password" id="current-password" name="current-password" />
      <label for="new-password">New Password: </label>
      <input type="password" id="new-password" name="new-password" />
      <input type="submit" />
    </form>
  </div>
</div>
</template>

<script>
import{ mapActions } from 'vuex'
import ErrorMessages from '../../components/parts/ErrorMessages'
export default {
  name: 'AdminEdit',
  components: {
    ErrorMessages
  },
  data: function () {
    return {
      currentName: null,
      newName: null,
      currentPassword: null,
      newPassword: null,
      errorMessages: []
    }
  },
  created: function () {
    this.fechData()
    this.newName = this.admin.Name
    this.currentName = this.admin.Name
  },
  methods: {
    ...mapActions({ updateUser: 'userLoginStatus/setUser' }),
    fechData: function () {
      this.$adminHttp.get('/admin/edit')
      .then(response => {
        if (response.data.ErrorMessages != null) {
          console.log(response.data.ErrorMessages)
          alert('Failed to get data')
        } else {
          this.newName = response.data.Admin.Name
          this.currentName = response.data.Admin.Name
        }
      })
    },
    update: function () {
      if (this.checkForm()) {
        this.$userHttp.put(`/admin/users/${this.$route.params.id}`, {
          Name: this.newName,
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        })
          .then(response => {
            if (response.data.ErrorMessages != null) {
              console.log(response.data.ErrorMessages)
            } else {
              this.updateUser(response.data.User)
              this.$router.push({ name: 'Profile' })
            }
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        console.log("cancel to send form")
        return 
      }
    },
    checkForm: function () {
      if (this.newName === this.currentName) {
        this.errorMessages = ['new name is not changed']
        return false
      } else if (this.newName == null && this.currentPassword == null && this.newPassword == null){
        this.errorMessages = ['All inputs are blank']
        return false
      } else if (this.currentPassword != null && this.currentPassword == this.newPassword) {
        this.errorMessages = ['new password is not changed']
        return false
      }
      return true
    }
  }
}
</script>

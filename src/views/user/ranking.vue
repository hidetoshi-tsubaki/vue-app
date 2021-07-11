<template>
<div>
  <h1>Ranking</h1>
  <div>
    <ul>
      <li v-for="user in this.users" :key="user.ID">
        <span>{{ rankNumber(user) }}</span>
        <span>{{ user.Name }} </span>
        <span>{{ user.Experience }}</span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'Ranking',
  data: function () {
    return {
      users: null,
      experience: null,
      number: 1
    }
  },
  created: function () {
    this.fechData()
  },
  computed: {
    rankNumber: function () {
      return function(user) {
        if (this.experience == null) {
          this.experience = user.Experience
        }

        if (this.experience != user.Experience) {
          this.experience = user.Experience
          this.number ++
        }

        return this.number
      }
    }
  },
  methods: {
    fechData: function () {
      this.$userHttp.get('/users/ranking')
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.users = response.data.Users
          }
        })
        .catch(error => {
          console.log(error.message)
          this.$router.push({path: '/home'})
        })
    }
  }
}
</script>

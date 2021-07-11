<template>
  <v-row justify="center">
    <v-col cols="12" sm="4">
      <v-card class="py-4">
        <div
          @click="isSelected('1')"
          v-bind:class="{'active' : isActive === '1'}"
          class="tab py-4 pl-5"
        >
          <v-icon>mdi-account-details-outline</v-icon>
          <span class="ml-4">Profile</span>
        </div>
        <div
          @click="isSelected('2')"
          v-bind:class="{'active' : isActive === '2'}"
          class="tab py-4 pl-5"
        >
          <v-icon>mdi-lock</v-icon>
          <span class="ml-4">Password</span>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" md="6">
      <div v-show="isActive === '1'">
        <Profile />
      </div>
      <div v-show="isActive === '2'">
        <Password />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Profile from '../../components/parts/user/setting/profile'
import Password from '../../components/parts/user/setting/password'
export default {
  components: {
    Profile,
    Password
  },
  data: function () {
    return {
      isActive: "1"
    }
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' }),
  },
  methods: {
    ...mapActions({ updateUser: 'userLoginStatus/setUser' }),
    isSelected: function (num) {
      this.isActive = num
    }
  }
}
</script>

<style scoped>
.tab:hover{
  background: #F0F4F9;
  cursor: pointer;
}
.active{
  background: #F0F4F9;
}
</style>
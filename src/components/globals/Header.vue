<template>
  <header v-if='this.userToken'>
    <v-app-bar class="amber darken-3 white--text" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-subtitle-2 font-weight-bold">
        <router-link to="/dashboard" class="white--text">JP Language Lab</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-title class="text-caption text-sm-h6 font-weight-bold">
        Lv. {{ this.user.Level }}
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed permanent>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item to="/dashboard">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/user/ranking">
            <v-list-item-title>Ranking</v-list-item-title>
          </v-list-item>
          <v-list-item to="/user/setting">
            <v-list-item-title>Account Setting</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title v-on:click='this.userLogout'>Log Out</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
  </header>
  <header v-else-if='this.adminToken'>
    <v-app-bar class="amber darken-3 white--text" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-subtitle-2 font-weight-bold">
        <router-link to="/dashboard" class="white--text">JP Language Lab</router-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item to="/admin/home">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/users"> 
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/quiz_levels"> 
            <v-list-item-title>Quiz Levels</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/quiz_sections">
            <v-list-item-title>Quiz Sections</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/quiz_titles">
            <v-list-item-title>Quiz Titles</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/setting">
            <v-list-item-title>Setting</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title v-on:click='this.adminLogout'>Log Out</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
  </header>
  <header v-else>
    <v-app-bar class="amber darken-3">
      <v-toolbar-title class="text-center white--text">JP Language Lab</v-toolbar-title>
    </v-app-bar>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters({ user: 'userLoginStatus/user' }),
    ...mapGetters({ userToken: 'userLoginStatus/token' }),
    ...mapGetters({ adminToken: 'adminLoginStatus/token' })
  },
  methods: {
    ...mapActions({ userLogout: 'userLoginStatus/unauthorize' }),
    ...mapActions({ adminLogout:'adminLoginStatus/unauthorize' }),
  }
}
</script>

<style>
.v-toolbar__title{
  overflow: visible !important;
  margin-right: 50px !important;
}
</style>
<template>
  <v-app style="min-width: 320px">
    <FlashMessage />
    <Header />
    <v-main
      style="background-color: #F9FBFE;"
      class="pt-sm-5 main_wrapper"
    >
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Header from './components/globals/Header'
import Footer from './components/globals/Footer'
import FlashMessage from './components/globals/FlashMessage'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
    FlashMessage
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/setFlashMessage' })
  }
};
</script>

<style>
@import "./css/reset.css";
.main_wrapper {
  position: relative;
}
.v-application {
  position: relative;
}
</style>


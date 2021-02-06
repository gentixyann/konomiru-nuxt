<template>
  <v-app dark v-cloak>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <header-component></header-component>
  </v-app>
</template>

<script>
import axios from "axios";
import firebase from '@/plugins/firebase.js'
import HeaderComponent from "../components/templates/Header";
export default {
  components: {
    'header-component': HeaderComponent,
  },
  beforeCreate(){
    this.$store.dispatch('loadUser');
  }
}
</script>
<style>
    [v-cloak] {
        display: none;
    }
</style>
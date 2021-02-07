<template>
  <v-app dark v-cloak v-resize="onResize">
    <div v-if="introduction">
      <v-main>
        <v-container>
          <nuxt />
        </v-container>
      </v-main>
    <header-component></header-component>
    </div>
    <div v-else>
      <introduction></introduction>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import firebase from '@/plugins/firebase.js'
import HeaderComponent from "../components/templates/Header";
import Introduction from '../components/templates/Introduction'
export default {
  components: {
    'header-component': HeaderComponent,
    Introduction
  },
  computed: {
    introduction(){
      return this.$store.state.introduction
    }
  },
  beforeCreate(){
    this.$store.dispatch('loadUser');
  },
  methods: {
    onResize () {
      this.$store.commit('windowSize', { x: window.innerWidth, y: window.innerHeight })
    },
  },
}
</script>
<style>
    [v-cloak] {
        display: none;
    }
</style>
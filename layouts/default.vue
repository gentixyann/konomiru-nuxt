<template>
  <v-app dark v-cloak v-resize="onResize">
    <div>
      <v-main>
        <v-container>
          <transition name="fade" mode="out-in">
            <nuxt />
          </transition>
        </v-container>
      </v-main>
    <header-component></header-component>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import firebase from '@/plugins/firebase.js'
import HeaderComponent from "../components/templates/Header";
export default {
  components: {
    HeaderComponent,
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
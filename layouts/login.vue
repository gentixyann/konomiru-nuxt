<template>
    <div>
      <v-app dark v-cloak v-resize="onResize" style="background-image: linear-gradient(to bottom right, #ffcb00, #ffb400);">
          <nuxt />
      </v-app>
    </div>
</template>

<script>
import axios from "axios";
import firebase from '@/plugins/firebase.js'
import HeaderComponent from "../components/templates/Header";
export default {
  name: 'login',
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
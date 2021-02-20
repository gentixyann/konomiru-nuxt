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
  <v-bottom-navigation :value="value" color="teal" grow fixed v-if="user.uid">
    <v-btn to="/">
      <span>Home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn to="/search">
      <span>Search</span>

      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'profile-uid', params: { uid: user.uid } }">
      <span>Mypage</span>

      <v-icon>mdi-heart</v-icon>
    </v-btn>
  </v-bottom-navigation>
    <v-snackbar v-model="snackbar" :timeout="timeout" style="bottom: 20px">
      {{ text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
import firebase from '@/plugins/firebase.js'
import HeaderComponent from "../components/templates/Header";
export default {
  name: 'default',
  components: {
    HeaderComponent,
  },
  data(){
    return{
      snackbar: false,
      timeout: 2000,
      text: '',
      value: 0,
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
  computed: {
    isLogin(){
      return this.$store.state.isLogin;
    },
    user(){
      return this.$store.getters.user;
    }
  },
  watch: {
    '$route'(to, from){
      console.log(to)
      console.log(from)
    },
    isLogin:{
        handler(){
          console.log(this.isLogin)
        if(this.isLogin){
          this.snackbar = true;
          this.text = 'ログインしました';
        } else if(this.isLogin===false){
          this.snackbar = true;
          this.text = 'ログアウトしました';
        }
      },
      immediate: true
    }
  }
}
</script>
<style>
    [v-cloak] {
        display: none;
    }
</style>
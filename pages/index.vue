<template>
  <div>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                みんなの好きな作品
            </v-col>
        </v-row>
        <v-row v-if="ready">
            <v-col v-for="(movie, i) in movies" :key="i">
                <v-card class="d-flex" :style="selectId == i ? {backgroundColor: '#c9fbff'} : ''" @click="select(i, movie)" width="330">
                    <div>
                        <v-img v-bind:src="'http://image.tmdb.org/t/p/w154/' + movie.poster_path"></v-img>
                    </div>
                    <div>
                        <card-template v-bind="movie" />
                    </div>
                </v-card>
            </v-col>
            <v-col v-if="movies.length%3 !== 0">
                <div style="width: 330px"></div>
            </v-col>
        </v-row>
        <v-btn class="mx-2" fab fixed right bottom dark small color="primary" @click="save" :disabled="selectId==-1">
            <v-icon dark>
                mdi-plus
            </v-icon>
        </v-btn>
    </v-container>
    <v-snackbar v-model="snackbar" :multi-line="multiLine" :timeout="timeout">
      <div v-html="text"></div>
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            <v-icon dark right>
                mdi-close
            </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase.js'
import axios from 'axios'
import CardTemplate from '../components/templates/CardTemplate'
export default {
    name: 'Home',
    components: {
        'card-template': CardTemplate,
    },
    data() {
        return {
            selectId: -1,
            movie: '',
            movies: [],
            user: this.$store.getters.user,
            multiLine: true,
            snackbar: false,
            text: null,
            timeout: 2000,
        }
    },
    computed: {
        ready(){
            return this.$store.state.ready;
        }
    },
    methods: {
        getMovies() {
            // &language=ja
            axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.$store.state.apiKey}`)
            .then(response => {
                this.movies = response.data.results
                this.$store.commit('ready', true)
            })

        },
        getItem(movie) {
            this.movie = movie;
            console.log('押した' + movie.title);
        },
        submit () {
            const db = firebase.firestore()
            let dbUsers = db.collection('users')
            dbUsers.add({
                name: this.user.name,
                email: this.user.email,
            })
            .then(ref => {
                console.log('Add ID: ', ref.id)
            })
        },
        async save(){
            this.text = null;
            const isRegistered = this.$store.getters.likedMovies.some((likedMovie) => {
                return likedMovie.id === this.movie.id;
            })
            if(isRegistered) {
                this.text = 'お忘れですか？<br>あなたは既にこの作品をマイラブしてます';
            } else {
                const db = firebase.firestore();
                const data = {id: this.movie.id, title: this.movie.title }
                const data2 = {userId: this.user.uid }
                await db.collection(`users/${this.user.uid}/movies`).add(data)
                await db.collection(`likedMovies/${this.movie.id}/users`).add(data2)
                this.$store.dispatch('getLikedMovies',this.$store.state.user.uid);
                this.text = 'マイラブに追加しました';
            }
                this.snackbar = true;
                this.selectId = -1;
        },
        select(index, movie){
            if(index == this.selectId){
                this.selectId = -1;
                this.movie = '';
            } else {
                this.selectId = index;
                this.movie = movie;
            }
        }
    },
    mounted() {
        this.getMovies();
    },

}
</script>

<style scoped>
.v-image__image--cover {
    background-size: contain;
}
.red {
  background-color: red;
}
</style>
<style>
    .v-application a{
        text-decoration: none;
    }
</style>

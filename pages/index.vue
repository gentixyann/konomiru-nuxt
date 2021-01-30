<template>
    <v-container>
        <v-row>
            <router-link to="/search">検索へ</router-link>
        </v-row>
        <v-row class="text-center">
            <v-col cols="12">
                みんなの好きな作品
            </v-col>
        </v-row>
        <v-row v-if="ready">
            <v-col v-for="(movie, i) in movies" :key="i">
                <v-card class="d-flex" :style="selectId == i ? {backgroundColor: '#c9fbff'} : ''" @click="select(i, movie)" width="330"><!--qiita-->
                    <div>
                        <v-img v-bind:src="'http://image.tmdb.org/t/p/w154/' + movie.poster_path"></v-img>
                    </div>
                    <div>
                        <card-template :title="movie.title" :release_date="movie.release_date" :overview="movie.overview" />
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-btn class="mx-2" fab fixed right bottom dark small color="primary" @click="save">
            <v-icon dark>
                mdi-plus
            </v-icon>
        </v-btn>
    </v-container>
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
            // movie: [],
            apiKey: 'a1a357b8cd4732e4d9c84ecc9a1d7406',
            ready: false,
            user: this.$store.getters.user,
        }
    },
    methods: {
        getMovies() {
            // &language=ja
            axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}`)
            .then(response => {
                this.movies = response.data.results
                this.ready = true;
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
        save(){
            const db = firebase.firestore();
            const data = {id: this.movie.id, title: this.movie.title }
            const data2 = {userId: this.user.uid }
            db.collection(`users/${this.user.uid}/movies`).add(data)
            db.collection(`likedMovies/${this.movie.id}/users`).add(data2)
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
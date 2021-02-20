<template>
    <div>
        <avatar></avatar>
        <v-row v-if="ready">
            <v-col v-for="(movie, i) in movies" :key="i">
                <router-link :to="{ name: 'profile-uid-mid', params: { uid: $route.params.uid, mid: likedMovies[i].mid } }">
                    <v-card class="d-flex" style="position:relative;z-index: 1;" width="330">
                        <div>
                            <v-img v-bind:src="'http://image.tmdb.org/t/p/w154/' + movie.poster_path"></v-img>
                        </div>
                        <div>
                            <card-template v-bind="movie" />
                        </div>
                    </v-card>
                </router-link>
            </v-col>
            <v-col v-if="movies.length%3 !== 0">
                <div style="width: 330px"></div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';
import CardTemplate from "../../../components/templates/CardTemplate";
import Avatar from "../../../components/templates/mypage/Avatar";
import Buttons from "../../../components/templates/mypage/Buttons";
export default {
    components: {
        CardTemplate,
        Avatar,
        Buttons
    },
    data() {
        return {
            movie: '',
            movies: [],
            apiKey: 'a1a357b8cd4732e4d9c84ecc9a1d7406',
            user: this.$store.getters.user,
        }
    },
    computed: {
        likedMovies(){
            const likedMovies = this.$store.getters.likedMovies;
            return likedMovies ? likedMovies : false;
        },
        ready(){
            return this.$store.state.ready;
        }
    },
    mounted(){
        // console.log(this.movies)
    },
    watch:{
        likedMovies(){
            if (this.likedMovies) {
                this.getMovies()
            } else {
                this.movies = [];
            }
        },
    },
    created(){
        this.getMovies()
    },
    methods: {
        async getMovies() {
            for (let i = 0; i < this.likedMovies.length; i++) {
                await axios.get(`https://api.themoviedb.org/3/movie/${this.likedMovies[i].id}?api_key=${this.apiKey}&language=en-US`)
                .then(response => {
                    this.movies.push(response.data);
                })
            }
            this.$store.commit('ready', true)
        },
    }
}
</script>
<style>
    .v-application a{
        text-decoration: none;
    }
</style>
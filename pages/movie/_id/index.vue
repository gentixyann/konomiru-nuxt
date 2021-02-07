<template>
    <div v-if="ready">
        <v-card class="d-flex">
            <div>
                <v-img :src="'http://image.tmdb.org/t/p/w154' + movie.poster_path" width="300"></v-img>
            </div>
            <div class="pa-4">
                <h1>{{movie.title}}</h1>
                <h2><span v-for="(genre, i) in movie.genres" :key="i">{{genre.name}} </span></h2>
                <h2>{{movie.release_date}}</h2>
                <h3>{{movie.overview}}</h3>
                <a :href="movie.homepage" target="_blank">{{ movie.homepage }}</a>
            </div>
        </v-card>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            movie: null,
        }
    },
    computed: {
        ready(){
            return this.$store.state.ready;
        }
    },
    created(){
        this.$store.commit('ready',false)
        axios.get(`https://api.themoviedb.org/3/movie/${this.$route.params.id}?api_key=${this.$store.state.apiKey}&language=en-US`)
        .then(response => {
            this.movie = response.data;
            this.$store.commit('ready',true);
            console.log(response.data)
        })
    }
}
</script>
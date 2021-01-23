<template>
    <v-container text-center>
        <v-row>
            <v-col>
                <h1>検索</h1>
                <input
                type='text' 
                v-model='query' 
                placeholder="検索したい映画を入力"
                @keyup='getSearch(query)'
                >
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for='result in results' :key='result.id'>
                 <v-card>
                    <v-img v-bind:src="'http://image.tmdb.org/t/p/w300/' + result.poster_path"></v-img>
                    <v-card-title>{{ result.title }}</v-card-title>
                    <v-card-subtitle>{{ result.release_date }}</v-card-subtitle>
                    <v-card-text>{{ result.overview }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
          <router-link to="/">Go to Home</router-link>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    name: 'search',
    data() {
        return {
            query: '',
            results: '',
            apiKey: 'a1a357b8cd4732e4d9c84ecc9a1d7406',

        }
    },
    methods: {
        getSearch(query) {
           axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${query}`)
           .then(response => {
               this.results = response.data.results
           });
        },
    }
}
</script>
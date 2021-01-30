<template>
    <div>
        <v-list-item three-line class="px-3">
            <v-list-item-avatar size="80">
                <!-- <avatar @progress="progress = $event" @sizeDialog="sizeDialog = $event"></avatar> -->
            </v-list-item-avatar>
            <v-list-item-content>
                <!-- <follower></follower> -->
            </v-list-item-content>
            <div class="font-weight-light grey--text title mb-2">
                <!-- <buttons></buttons> -->
            </div>
        </v-list-item>
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
    </div>
</template>

<script>
import axios from 'axios';
import CardTemplate from "../components/templates/CardTemplate";
export default {
    components: {
        CardTemplate
    },
    data() {
        return {
            selectId: -1,
            movie: '',
            movies: [],
            apiKey: 'a1a357b8cd4732e4d9c84ecc9a1d7406',
            ready: false,
            user: this.$store.getters.user,
        }
    },
    computed: {
        likedMovies(){
            return this.$store.state.user.likedMovies;
        }
    },
    watch:{
        likedMovies(){
            this.getMovies()
        },
    },
    created(){
        this.getMovies()
    },
    methods: {
        getMovies() {
            for (let i = 0; i < this.likedMovies.length; i++) {
                axios.get(`https://api.themoviedb.org/3/movie/${this.likedMovies[i].id}?api_key=${this.apiKey}&language=en-US`)
                .then(response => {
                    this.movies.push(response.data);
                })
            }
            this.ready = true;
        },
    }
}
</script>
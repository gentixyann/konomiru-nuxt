<template>
    <div>
        <!-- <card-template :movies="movies[0]"></card-template> -->
        {{ likedMovies }}
    </div>
</template>

<script>
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
    created(){
        // movie_id
        console.log(this.likedMovies)
    },
    methods: {
        getMovies(id) {
            for (let i = 0; i < this.likedMovies.length; i++) {
                axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`)
                .then(response => {
                    this.movies = response.data.results
                    this.ready = true;
                })
            }
        },
    }
}
</script>
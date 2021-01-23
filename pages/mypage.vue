<template>
    <div>
        <card-template></card-template>
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
    created(){
        movie_id
    },
    methods: {
        getMovies(id) {
            // &language=ja
            axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=en-US`)
            .then(response => {
                this.movies = response.data.results
                console.log(this.movies);
                this.ready = true;
            })
            console.log(this.movies);
        },
    }
}
</script>
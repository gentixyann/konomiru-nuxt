<template>
    <div v-if="ready">
        <v-card class="d-flex">
            <div>
                <v-img :src="'http://image.tmdb.org/t/p/w154' + movie.poster_path" width="300"></v-img>
            </div>
            <div class="pa-4" style="width: 100%">
                <h1>{{movie.title}}</h1>
                <h3><span v-for="(genre, i) in movie.genres" :key="i">{{genre.name}} </span></h3>
                <h3>{{movie.release_date}}</h3>
                <h4>{{movie.overview}}</h4>
                <a :href="movie.homepage" target="_blank">{{ movie.homepage }}</a>
            </div>
        </v-card>
        <v-card>
            <h3 class="py-4 px-4" style="background-color: #4a85c7; color: white;font-family: 'Noto Sans JP',sans-serif;">本書の要点</h3>
            <div v-if="points.length>=1">
                <div style="justify-content: center;align-items: center;" v-for="(point, i) in points" :key="i">
                    <div class="d-flex py-4 px-4">
                        <div class="d-flex text-center mx-2" style="justify-content: center;align-items: center;border-radius: 50%;color: #34a0ad;border: 1px solid #34a0ad;min-width: 55px;min-height: 55px;"><span>要点<br>{{ i+1 }}</span></div>
                        <div class="px-4" style="">{{ point }}</div>
                    </div>
                    <v-divider v-if="i<2" />
                </div>
                <div class="d-flex py-4 px-2" style="justify-content: center;align-items: center;" v-if="points.length<3">
                    <v-btn class="primary" fab><v-icon>mdi-plus</v-icon></v-btn>
                </div>
            </div>
            <div v-else>
                <div class="d-flex py-4 px-4" style="justify-content: center;align-items: center;">
                    <v-btn class="primary" fab><v-icon>mdi-plus</v-icon></v-btn>
                </div>
            </div>
        </v-card>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            points: [
                '資本主義を支えるグローバルな文明ともいうべき会計システムは、イタリアにアラビア数字がもたらされたことをきっかけに発展し、オランダへと渡る。そのことがオランダ美術の発展に大きく貢献した。',
                '資本主義を支えるグローバルな文明ともいうべき会計システムは、イタリアにアラビア数字がもたらされたことをきっかけに発展し、オランダへと渡る。そのことがオランダ美術の発展に大きく貢献した。',
                // '資本主義を支えるグローバルな文明ともいうべき会計システムは、イタリアにアラビア数字がもたらされたことをきっかけに発展し、オランダへと渡る。そのことがオランダ美術の発展に大きく貢献した。'
            ],
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
        axios.get(`https://api.themoviedb.org/3/movie/${this.$route.params.mid}?api_key=${this.$store.state.apiKey}&language=en-US`)
        .then(response => {
            this.movie = response.data;
            this.$store.commit('ready',true);
            console.log(response.data)
        })
    }
}
</script>
<style>

</style>
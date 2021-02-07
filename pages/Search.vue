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
            <v-col v-for='(result, i) in results' :key='i'>
                 <v-card class="d-flex" :style="selectId == i ? {backgroundColor: '#c9fbff'} : ''" @click="select(i, result)" width="330">
                    <div>
                        <v-img width="154" v-bind:src="'http://image.tmdb.org/t/p/w300/' + result.poster_path"></v-img>
                    </div>
                    <div>
                        <card-template v-bind="result" />
                    </div>
                </v-card>
            </v-col>
            <v-col v-if="results.length%3 !== 0">
                <div style="width: 330px"></div>
            </v-col>
        </v-row>
        <v-row>
          <router-link to="/">Go to Home</router-link>
        </v-row>
        <v-btn class="mx-2" fab fixed right bottom dark small color="primary" @click="save" :disabled="selectId==-1">
            <v-icon dark>
                mdi-plus
            </v-icon>
        </v-btn>
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
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    name: 'search',
    data() {
        return {
            selectId: -1,
            multiLine: true,
            snackbar: false,
            text: null,
            timeout: 2000,
            movie: null,
            query: '',
            results: '',
            apiKey: 'a1a357b8cd4732e4d9c84ecc9a1d7406',

        }
    },
    methods: {
        getSearch(query) {
           axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.query}`)
           .then(response => {
               this.results = response.data.results
           });
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
    }
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
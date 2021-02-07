<template>
    <div v-if="ready">
        <div class="d-flex">
            <div class="text-center" style="margin: auto">
                <img :src="'http://image.tmdb.org/t/p/w154' + movie.poster_path" style="width: 200px;display: block">
            </div>
            <movie v-bind="movie" v-if="windowSize.x > 678"></movie>
        </div>
        <movie v-bind="movie" v-if="windowSize.x <= 678"></movie>
        <v-card class="list-item">
            <h3 class="py-4 px-4" style="background-color: #4a85c7; color: white;font-family: 'Noto Sans JP',sans-serif;">本書の要点</h3>
            <div v-if="points.length>=1">
                <transition-group name="list" tag="p">
                    <div class="list-item" style="justify-content: center;align-items: center;" v-for="(point, i) in points" :key="i">
                        <div class="d-flex py-4 px-4" style="justify-content: start;align-items: center;">
                            <div class="d-flex text-center mx-2" style="justify-content: center;align-items: center;border-radius: 50%;color: #34a0ad;border: 1px solid #34a0ad;min-width: 55px;min-height: 55px;"><span>要点<br>{{ i+1 }}</span></div>
                            <textarea @focus="focus=true" @blur="saveText(i)" ref="point" :rows="str(point.text)" v-model="point.text" style="font-size: 16px;width: 100%" maxlength="144" row-height="5"></textarea>
                        </div>
                        <v-divider v-if="i<2" />
                    </div>
                </transition-group>
                <div class="d-flex py-4 px-2" style="justify-content: center;align-items: center;" v-if="points.length<3">
                    <v-btn class="primary" fab @click="newPoint" :disabled="focus"><v-icon>mdi-plus</v-icon></v-btn>
                </div>
            </div>
            <div v-else>
                <div class="d-flex py-4 px-4" style="justify-content: center;align-items: center;">
                    <v-btn class="primary" fab @click="newPoint"><v-icon>mdi-plus</v-icon></v-btn>
                </div>
            </div>
        </v-card>
    </div>
</template>
<script>
import axios from 'axios'
import firebase from '~/plugins/firebase'
import Movie from '../../../../components/templates/mypage/Movie'
export default {
    components: {
        Movie
    },
    data() {
        return {
            points: [],
            movie: {},
            focus: false,
        }
    },
    computed: {
        ready(){
            return this.$store.state.ready;
        },
        windowSize(){
            return this.$store.getters.windowSize;
        }
    },
    created(){
        this.$store.commit('ready',false)
        const db = firebase.firestore();
        db.collection(`users/${this.$route.params.uid}/movies`).doc(this.$route.params.mid).get().then(query => {
            Object.assign(this.movie, query.data())
        })
        db.collection(`users/${this.$route.params.uid}/movies/${this.$route.params.mid}/points`).get().then(query => {
            let that =this;
            query.forEach(function(doc) {
                that.points.push(doc.data());
            });
        })
        .then(() => {
            axios.get(`https://api.themoviedb.org/3/movie/${this.movie.id}?api_key=${this.$store.state.apiKey}&language=en-US`)
            .then(response => {
                Object.assign(this.movie,response.data);
                this.$store.commit('ready',true)
                console.log(this.movie)
            })
        })
    },
    methods: {
        async newPoint(){
            this.focus = true;
            await this.points.push({text: ''});
            this.$refs.point[this.points.length-1].focus()
        },
        async saveText(index){
            let docId = [];
            const db = firebase.firestore();
            const uid = this.$store.getters.user.uid;
            await db.collection(`users/${uid}/movies/${this.$route.params.mid}/points`).get()
            .then(query => {
                query.forEach(function(doc){
                    docId.push(doc.id)
                })
            })
                
            try {
                if(this.points[index].text == ''){
                    db.collection(`users/${uid}/movies/${this.$route.params.mid}/points`).doc(docId[index]).delete()
                    .then(() => {
                        this.points.splice(index, 1)
                    })
                } else {
                    this.points[index].text = this.$refs.point[index].value.replace(/\r?\n/g,'')
                    if (this.points.length == docId.length) {
                        db.collection(`users/${uid}/movies/${this.$route.params.mid}/points`).doc(docId[index]).update(this.points[index])
                    } else {
                        db.collection(`users/${uid}/movies/${this.$route.params.mid}/points`).add(this.points[index])
                    }
                }
            } catch (error) {
                
            }
            this.focus = false;
        },
        str(text){
            if (text) {
                if (text.length <=48) {
                    return 1
                } else if(text.length <=96){
                    return 2
                } else {
                    return 3;
                }
            } else {
                return 1
            }
        }
    }
}
</script>
<style>
.list-item {
    transition: all 1s;
    height: auto
}
.list-enter-active, .list-leave-active {
    transition: all .5s;
}
.list-enter /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-30px);
}
.list-leave-to /* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translate(-30px);
    position: absolute;
}

</style>
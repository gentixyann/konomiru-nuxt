<template>
    <div>
        <h3 class="text-center py-4 px-4" style="font-size: 20px;">konomir<span style="letter-spacing: 2px">uへようこそ</span></h3>
        <v-divider></v-divider>
        <div class="d-flex py-4 px-4" style="align-items: start">
            <div class="px-4" style="width: 50%">
                <v-carousel :show-arrows="false" v-model="page">
                    <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
                </v-carousel>
            </div>
            <div class="mt-4 px-4 py-4" style="width: 50%;height: 100%;">
                <div class="my-4 px-4 py-4" style="font-size: 28px;min-height: 300px;">{{ discribe[page] }}</div>
                <div class="my-4 px-4" style="max-width: 500px;margin-left: auto;margin-right: auto;">
                    <div class="my-4 px-4">
                        <button class="py-4" style="border-radius: 40px;width: 100%;color: #fff;background-image: linear-gradient(to right, #ffcb00, #ffb400);font-weight: bold;" @click="transition(1)">{{ next }}</button>
                    </div>
                    <div class="my-4 px-4">
                        <button class="py-4" style="border-radius: 40px;width: 100%;color: #fff;background-image: linear-gradient(to right, #ffcb00, #ffb400);font-weight: bold;"  @click="transition(-1)" v-if="page != 0">{{ back }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            page: 0,
            items: [
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                },
            ],
            discribe: [
                'Buddyup!は集まった人たちが仲間になっていくのを助けるサービスです。',
                'あなたがイベントを開くと、たくさんの人が来てくれます。',
                'イベントを重ねる度に、出会った人もどんどん増えていきますよね。',
                '集まった人達が、お互いに助け合えると素晴らしいと思いませんか？ この集まりを私たちはコミュニティと呼んでいます。',
                'コミュニティを発展させて、たくさんのチームを作り、みんなのやりたいことを実現していきましょう。',
            ]
        }
    },
    computed: {
        next(){
            return (this.page == this.items.length-1) ? 'konomiruを始める' : '次へ'
        },
        back(){
            return '戻る'
        }
    },
    methods: {
        transition(num){
            this.page += num;
            if(this.page == -1){
                this.page = this.items.length - 1;
            } else if(this.page == this.items.length){
                this.$store.commit('introduction', true)
            }
        }
    },
}
</script>
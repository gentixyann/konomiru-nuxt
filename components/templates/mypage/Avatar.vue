<template>
    <div>
        <v-list three-line>
            <v-list-item three-line class="px-3">
                <v-list-item-avatar size="100">
                    <v-avatar color="indigo" size="120" @click="btnclick2">
                        <v-img :src="user.photoURL"></v-img>
                    </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content class="px-4" style="max-width: 600px;margin: auto">
                    <v-list-item-title class="mb-2 text-center" style="font-size: 24px;">{{ user.name }}</v-list-item-title>
                    <v-textarea outlined label="自己紹介" rows="2" row-height="10" v-model="introduction" @blur="saveText" style="font-size: 16px"></v-textarea>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <input style="display: none" ref="avatar" type="file" accept="image/jpeg, image/jpg, image/png" @input="changeAvatar">
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from 'axios';
import firebase from '~/plugins/firebase'
export type DataType = {
    visitor: any,
    windowSize: { x: number, y: number},
    introduction: string|null
}
export default Vue.extend({
    data(): DataType{
        return {
            visitor: '',
            windowSize: this.$store.getters.windowSize,
            introduction: null,
        }
    },
    computed: {
        requestedUserInfo(): object{
            return this.user;
        },
        user(){
            return this.$store.getters.user;
        },
        userText(){
            return this.$store.getters.user.text;
        },
    },
    watch: {
        userText:{
            handler(){
                this.introduction = this.userText
            },
            immediate: true
        }
    },
    methods: {
        saveText(){
            const db = firebase.firestore();
            db.collection('users').doc(this.user.uid).update({ text: this.introduction})
            this.$store.dispatch('loadUser')
        },
        btnclick2(): void {
            if(this.visitor.id == this.user.id){
                const element: HTMLElement | any = this.$refs.avatar;
                element.click()
            }
        },
        async changeAvatar(event: any): Promise<any>{
            const file = event.target.files[0];
            if (typeof FileReader === 'function') {
                if(this.windowSize.x<480){
                    if(file.size<3100000){
                        this.$emit('progress', true);
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        const that = this;
                        reader.onload = function(e: any) {
                            const avatarData = e.target.result;
                            const fd= new FormData();
                            fd.append("avatarData", avatarData);
                            fd.append("userId", that.user.id);
                            axios.post('/api/upload2', fd)
                            .then(
                                response => {
                                    that.user.profile_image = response.data;
                                    that.$emit('progress', false);
                                }
                            )
                            .catch(function (error) {
                                console.log(error);
                                that.$emit('progress', false);
                            });
                        }
                    } else {
                        this.$emit('sizeDialog', true);
                    }
                } else {
                    const reader = new FileReader();
                    const that = this;
                    reader.onload = function(e: any) {
                        const avatarData = e.target.result;
                        const fd= new FormData();
                        fd.append("avatarData", avatarData);
                        fd.append("userId", that.user.id);
                        axios.post('/api/upload2', fd)
                        .then(
                            response => {
                                that.user.profile_image = response.data;
                            }
                        )
                        .catch(function (error) {
                            console.log(error);
                        });
                    }
                    reader.readAsDataURL(file);
                }
            }
        },
    }
})
</script>
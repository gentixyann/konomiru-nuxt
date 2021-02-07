<template>
    <div>
        <v-navigation-drawer
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        fixed
        app
        >
        <v-list>
            <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
            >
            <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title v-text="item.title" />
            </v-list-item-content>
            </v-list-item>
        </v-list>
        </v-navigation-drawer>
        <v-app-bar
        :clipped-left="clipped"
        fixed
        app
        >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" :disabled="!auth" />
        <!-- <v-btn
            icon
            @click.stop="miniVariant = !miniVariant"
        >
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
        <v-btn
            icon
            @click.stop="clipped = !clipped"
        >
            <v-icon>mdi-application</v-icon>
        </v-btn>
        <v-btn
            icon
            @click.stop="fixed = !fixed"
        >
            <v-icon>mdi-minus</v-icon>
        </v-btn> -->
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <!-- <v-btn
            icon
            @click.stop="rightDrawer = !rightDrawer"
        >
            <v-icon>mdi-menu</v-icon>
        </v-btn> -->
        <div v-if="auth">
            <v-btn @click="logout">ログアウト</v-btn>
        </div>
        <div v-else>
            <v-btn @click="dialog =true">ログイン/新規登録</v-btn>
        </div>
        </v-app-bar>
        <v-navigation-drawer
            v-model="rightDrawer"
            :right="right"
            temporary
            fixed
            >
            <v-list>
                <v-list-item @click.native="right = !right">
                <v-list-item-action>
                    <v-icon light>
                    mdi-repeat
                    </v-icon>
                </v-list-item-action>
                <v-list-item-title>Switch drawer (click me)</v-list-item-title>
                </v-list-item>
            </v-list>
            </v-navigation-drawer>
        <v-row justify="center">
            <v-dialog
            v-model="dialog"
            max-width="600px"
            >
            <div id="login" class="example">
                <div class="hello" style="opacity: 0.95;">
                    <v-card class="mx-auto" max-width="600">
                        <v-card-title class="title font-weight-regular justify-space-between">
                        <h4>{{ currentTitle }}</h4>
                        <v-avatar color="primary lighten-2" class="subheading white--text" size="24" v-text="step"></v-avatar>
                        </v-card-title>

                        <v-window class="px-5 py-5" v-model="step" touchless>
                        <v-window-item :value="0">
                            <v-form ref="form">
                            <v-text-field class="py-2" v-model="resetEmail" placeholder="アドレス" label="Email" required clearable @keyup.enter.exact="sendPasswordResetLink" autocomplete="new-password"></v-text-field>
                                <div v-if="Object.keys(resetErrors).length !== 0">
                                <div class="mb-2 px-4">
                                    <div class="error px-4 py-2" style="font-size: smaller;font-weight: 500;">
                                    <div class="alert alert-danger" v-text="resetErrors.email" v-if="resetErrors.email"></div>
                                    <div class="alert alert-danger" v-text="resetErrors.password" v-if="resetErrors.password"></div>
                                    </div>
                                </div>
                                </div>
                            <v-btn color="success" class="mr-4" @click="sendPasswordResetLink">メール送信</v-btn>
                            <v-btn class="mr-4" @click="step++">ログイン画面</v-btn>
                            </v-form>
                        </v-window-item>
                        <v-window-item :value="1">
                        <v-form ref="form" lazy-validation>
                        <!-- <h4 class="py-2">ログイン</h4> -->
                        <v-text-field class="py-2" v-model="email" placeholder="アドレス" label="Email" required clearable @keyup.enter.exact="login"></v-text-field>
                        <v-text-field autofocus v-model="password" placeholder="パスワード" :counter="10" label="Password" required @click:append="show1 = !show1" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" @keyup.enter.exact="login"></v-text-field>
                        <div v-if="Object.keys(errors).length !== 0">
                        <div class="mb-3 mt-1">
                            <div class="error px-4 py-2" style="font-size: smaller;font-weight: 500;">
                            <div class="alert alert-danger" v-text="errors.email" v-if="errors.email"></div>
                            <div class="alert alert-danger" v-text="errors.password" v-if="errors.password"></div>
                            </div>
                        </div>
                        </div>
                        <div class="mb-5">
                        <v-btn color="success mb-3" block class="mr-4" @click="login">
                        ログイン
                        </v-btn>
                        <v-btn color="indigo white--text mb-3" block class="mr-4" @click="step++">
                        会員登録
                        </v-btn>
                        <v-btn color="indigo white--text mb-3" block class="mr-4" @click="loginGoogle">
                        Googleログイン
                        </v-btn>
                        </div>
                        <a class="btn btn-link mb-3" style="display: block;" @click="step--">パスワードをお忘れの場合</a>
                    </v-form>
                        </v-window-item>

                        <v-window-item :value="2">
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field ref="name" v-model="registration.name" :rules="nameRules" label="名前"
                            placeholder="井上領"
                            required
                            class="py-2"
                            @input="blurInput"
                            ></v-text-field>
                            <v-text-field
                            @input="blurInput"
                            autocomplete="new-password"
                            v-model="registration.email"
                            :rules="emailRules"
                            label="メールアドレス"
                            placeholder="mymemories@hello.com"
                            counter="40"
                            required
                            class="py-2"
                            ></v-text-field>
                            <v-text-field
                            @input="blurInput"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[passwordRules.required, passwordRules.min]"
                            :type="show2 ? 'text' : 'password'"
                            name="input-10-2"
                            label="パスワード"
                            hint="8文字以上です"
                            autocomplete="new-password"
                            class="input-group--focused py-2"
                            @click:append="show2 = !show2"
                            v-model="registration.password"
                            ></v-text-field>
                            <v-text-field
                            @input="blurInput"
                            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[confirmationPasswordRules.required, confirmationPasswordRules.match]"
                            :type="show3 ? 'text' : 'password'"
                            name="input-10-2"
                            label="パスワード確認"
                            hint="8文字以上です"
                            autocomplete="new-password"
                            class="input-group--focused py-2"
                            @click:append="show3 = !show"
                            @keyup.enter.exact="register"
                            v-model="registration.confirmationPassword"
                            ></v-text-field>
                            </v-form>
                        </v-card-text>
                            <div v-if="Object.keys(registrationErrors).length !== 0">
                            <div class="mb-2 px-4">
                                <div class="error px-4 py-2" style="font-size: smaller;font-weight: 500;">
                                <div class="alert alert-danger" v-text="registrationErrors.email" v-if="registrationErrors.email"></div>
                                <div class="alert alert-danger" v-text="registrationErrors.password" v-if="registrationErrors.password"></div>
                                </div>
                            </div>
                            </div>
                        <div class="d-flex" style="justify-content: space-between;">
                        <v-btn color="white" class="mr-4" @click="step--">
                        戻る
                        </v-btn>
                        <template v-if="initial">
                        <v-btn disabled class="mr-4">
                        登録
                        </v-btn>
                        </template>
                        <template v-else>
                        <v-btn color="indigo white--text" class="mr-4" @click="register" :disabled="!valid">
                        登録
                        </v-btn>
                        </template>
                        </div>
                        </v-window-item>

                        <v-window-item :value="3">
                            <div class="pa-4 text-center">
                            <v-img
                                class="mb-4"
                                contain
                                height="128"
                                src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                            ></v-img>
                            <h3 class="title font-weight-light mb-2">
                                Welcome to Vuetify
                            </h3>
                            <span class="caption grey--text">Thanks for signing up!</span>
                            </div>
                        </v-window-item>
                        </v-window>
                    </v-card>
                </div>
                <v-overlay :value="progress">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <v-snackbar v-model="emailSnackbar" :timeout="timeout">
                    メールが送信されました
                    <template v-slot:action="{ attrs }">
                        <v-btn color="blue" text v-bind="attrs" @click="emailSnackbar = false">
                        閉じる
                        </v-btn>
                    </template>
                </v-snackbar>
            </div>
            </v-dialog>
        </v-row>
        <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </div>
</template>

<script>
import axios from "axios";
import firebase from '@/plugins/firebase.js'
export default {
  data () {
    return {
      resetErrors: {},
      emailSnackbar: false,
      timeout: 2000,
      progress: false,
      resetEmail: '',
        initial: true,
        avatar: '',
        show1: false,
        show2: false,
        show3: false,
        email: '',
        password: null,
        remember: '',
        errors: {},
        step: 1,
        randomNumber: '',
        registration: {name: '', email: '', password: '', confirmationPassword: ''},
        show4: false,
        nameRules: [
          v => !!v || '入力が必要です',
        ],
        nicknameRules: [
          v => !!v || '入力が必要です',
        ],
        emailRules: [
          v => !!v || '入力が必要です',
          v => /.+@.+\..+/.test(v) || '有効なメールアドレスを入力してください',
        ],
        passwordRules: {
        required: value => !!value || '入力が必要です',
        min: v => v.length >= 8 || '8文字以上です',
        },
        confirmationPasswordRules: {
        match: v => v == this.registration.password || 'パスワードと一致してません',
        },
        valid: false,
        registrationErrors: {},
        dialog: false,
        email: '',
        password: '',
        clipped: false,
        drawer: false,
        fixed: false,
        items: [
            {
                icon: 'mdi-home',
                title: 'Home',
                to: '/'
            },
            {
                icon: 'mdi-account',
                title: 'Mypage',
                to: { name: 'mypage-id', params: { id: this.mypageId } }
            },
            {
                icon: 'mdi-magnify',
                title: 'Search',
                to: '/search'
            },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Konomiru'
        }
    },
    computed: {
        currentTitle () {
            switch (this.step) {
            case 1: return 'ログイン'
            case 2: return '会員登録'
            default: return 'パスワード再設定'
            }
        },
        auth(){
            return this.$store.getters.user.uid ? true : false
        },
        mypageId(){
            return this.$store.getters.user.uid
        }
    },
    watch: {
        mypageId:{
            handler(){
                this.items[1] = {icon: 'mdi-account', title: 'Mypage', to: { name: 'profile-uid', params: { uid: this.mypageId } } }
            },
            immediate: true
        },
        auth:{
            handler(){
                if(!this.auth){
                    this.drawer = false;
                }
            },
            immediate: true
        },
    },
    methods: {
        loginGoogle(){
            this.$store.dispatch('loginGoogle');
            this.dialog = false;
        },
        login() {
            this.$store.dispatch('login', {email: this.email, password: this.password})
            this.dialog = false;
        },
        blurInput() {
            var registrationArray = Object.values(this.registration).map(registration => {
            return registration;
            })
            this.initial = registrationArray.some((registration) => {
            return registration === '';
            })
        },
        register() {
            var params = {
                name: this.registration.name,
                email: this.registration.email,
                password: this.registration.password,
            };
            this.$store.dispatch('register', params)
        },
        logout(){
            firebase.auth().signOut().then(() => {
            this.$store.dispatch('logout')
            this.$router.push({ name: 'index' })
            }).catch((error) => {
            // An error happened.
            });
        },
        sendPasswordResetLink(){
            this.progress = true;
            var url = '/password/email';
            var params = {
                email: this.resetEmail,
            };
            axios.post(url, params)
            .then((response) => {
                this.progress = false,
                this.step = 1,
                this.emailSnackbar = true
            })
            .catch((error) => {
                this.progress = false;
                let that = this;
                var responseErrors = error.response.data.errors;
                console.log(error.response.data.errors)
                var errors = {};
                for(var key in responseErrors) {
                    errors[key] = responseErrors[key][0];
                }
                that.resetErrors = errors;
            });
        }
    }
}
</script>
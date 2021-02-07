
import firebase from '~/plugins/firebase'
export const state = () => ({
    user: {
        uid: null,
        name: null,
        email: null,
        photoURL: null,
        text: null,
        likedMovies: [],
    },
    ready: false,
    apiKey: 'a1a357b8cd4732e4d9c84ecc9a1d7406',
    windowSize: {x: 0, y: 0},
    introduction: true,
})
export const getters = {
    user: state => {
        return state.user
    },
    likedMovies: state => {
        return state.user.likedMovies
    },
    text: state => {
        return state.user.text
    },
    windowSize: state => {
        return state.windowSize
    },
}
export const mutations = {
    getData (state, payload) {
        state.user.uid = payload.uid
        state.user.name = payload.name
        state.user.email = payload.email
        state.user.photoURL = payload.photoURL
        state.user.text = payload.text
    },
    likedMovies (state, payload) {
        state.user.likedMovies = payload
    },
    ready (state, payload) {
        state.ready = payload
    },
    windowSize(state,size){
        state.windowSize = size;
    },
    introduction(state,payload){
        state.introduction = payload;
        console.log(payload)
    }
}
export const actions = {
    login({ dispatch, commit }, payload) {
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                commit('getData', { uid: user.uid,name: user.displayName, email: user.email, photoURL: user.photoURL, text: user.text })
                dispatch('getLikedMovies', user.uid)
            }
        })

        }).catch((error) => {
            alert(error)
        })
    },
    logout({ commit }) {
        commit('getData', { uid: null, name: null, email: null, photoURL: null, text: null });
        commit('likedMovies', [])
    },
    async register({ commit, dispatch }, payload) {
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);
            const newUser = response.user;
            newUser.updateProfile({
                displayName: payload.name,
                photoURL: null,
                text: null
            });
            const db = firebase.firestore();
            await db.collection('users').doc(newUser.uid).set({ name: payload.name, email: payload.email, photoURL: null, text: null})
                commit('getData', { uid: newUser.uid, name: newUser.displayName, email: newUser.email, photoURL: null, text: null })
                commit('introduction', false)
        } catch (error) {
            console.log('error')
        }
    },
    getLikedMovies({commit},uid){
        let likedMovies = [];
        const db = firebase.firestore();
        db.collection(`users/${uid}/movies`).get().then(query => {
            query.forEach(function(doc) {
                let mid = {mid: doc.id}
                let movies = Object.assign(mid, doc.data());
                likedMovies.push(movies);
            });
        })
        .then(() => commit('likedMovies', likedMovies))
    },
    async loadUser({commit, dispatch}){
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const db = firebase.firestore();
                db.collection(`users`).doc(user.uid).get().then(query => {
                    commit('getData', { uid: user.uid, name: user.displayName, email: user.email, photoURL: user.photoURL, text: query.data().text })
                    dispatch('getLikedMovies', user.uid)
                })
            }
        })
    },
    loginGoogle ({ commit, dispatch }) {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
            const db = firebase.firestore();
            if(db.collection(`users`).doc(result.user.uid).get()){//過去にログインがある場合
                try {
                    db.collection(`users`).doc(result.user.uid).get().then(query => {
                        commit('getData', { uid: result.user.uid, name: result.user.displayName, email: result.user.email, photoURL: result.user.photoURL, text: query.data().text })
                        dispatch('getLikedMovies', result.user.uid)
                    })
                } catch (error) {
                    dispatch('logout')
                }
            } else {//初めてのログインの場合
                db.collection('users').doc(result.user.uid).set({ name: result.user.displayName, email: result.user.email, photoURL: result.user.photoURL})
                commit('introduction', false)
            }
        }).catch(function (error) {
            console.log(error)
        })
    },
}
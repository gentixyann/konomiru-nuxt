
import firebase from '~/plugins/firebase'
export const state = () => ({
    user: {
        uid: null,
        name: null,
        email: null,
        photoURL: null,
        likedMovies: [],
    },
})
export const getters = {
    user: state => {
        return state.user
    },
    likedMovies: state => {
        return state.user.likedMovies
    }
}
export const mutations = {
    getData (state, payload) {
        state.user.uid = payload.uid
        state.user.name = payload.name
        state.user.email = payload.email
        state.user.photoURL = payload.photoURL
    },
    likedMovies (state, payload) {
        state.user.likedMovies = payload
    },
}
export const actions = {
    login({ dispatch, commit }, payload) {
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                commit('getData', { uid: user.uid, email: user.email, photoURL: null })
                dispatch('getLikedMovies', user.uid)
            }
            })

        }).catch((error) => {
            alert(error)
        })
    },
    logout({ commit }) {
        commit('getData', { uid: '', email: '', photoURL: null });
    },
    async register({ commit, dispatch }, payload) {
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);
            const newUser = response.user;
            newUser.updateProfile({
                displayName: payload.name,
                photoURL: '',
            });
            const db = firebase.firestore();
            await db.collection('users').doc(newUser.uid).set({ name: payload.name, email: payload.email, })
                commit('getData', { uid: newUser.uid, email: newUser.email, photoURL: null })
        } catch (error) {
            console.log('error')
        }
        // firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        // .then((user) => {
        //     const newUser = user.user;
        //         newUser.updateProfile({
        //             displayName: payload.name,
        //             photoURL: '',
        //         });
        //     const db = firebase.firestore();
        //     db.collection('users').doc(newUser.uid).set({ name: payload.name, email: payload.email, })
        //         .then(ref => {
        //         console.log('Add ID: ', ref.id)
        //         })
        //         commit('getData', { uid: newUser.uid, email: newUser.email })
        //     })
        // .catch((error) => {
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        // });
    },
    getLikedMovies({commit},uid){
        let likedMovies = [];
        const db = firebase.firestore();
        db.collection(`users/${uid}/movies`).get().then(query => {
            query.forEach(function(doc) {
                likedMovies.push(doc.data());
            });
            console.log(likedMovies)
            commit('likedMovies', likedMovies)
        })
    },
    async loadUser({commit, dispatch}){
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                commit('getData', { uid: user.uid, name: user.displayName, email: user.email, photoURL: user.photoURL })
                dispatch('getLikedMovies', user.uid)
                console.log(user)
            }
        })
    },
    loginGoogle ({ commit, dispatch }) {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
            const db = firebase.firestore();
            db.collection('users').doc(result.user.uid).set({ name: result.user.displayName, email: result.user.email, })
                commit('getData', { uid: result.user.uid, name: result.user.displayName, email: result.user.email, photoURL: user.photoURL })
                dispatch('getLikedMovies', result.user.uid)
        }).catch(function (error) {
            console.log(error)
        })
    },
    checkLogin ({ commit }) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                commit('getData', { uid: user.uid, email: user.email })
                // commit('switchLogin')
            }
        })
    },
}
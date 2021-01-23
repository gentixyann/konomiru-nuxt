
import firebase from '~/plugins/firebase'
export const state = () => ({
    user: {
        uid: '',
        email: '',
    },
})
export const getters = {
    user: state => {
    return state.user
    }
}
export const mutations = {
    getData (state, payload) {
        console.log(payload)
    state.user.uid = payload.uid
    state.user.email = payload.email
    }
}
export const actions = {
    login({ commit }, payload) {
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
            console.log('成功！')
            firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user)
                commit('getData', { uid: user.uid, email: user.email })
            }
            })
        }).catch((error) => {
            alert(error)
        })
    },
    logout({ commit }) {
        commit('getData', { uid: '', email: '' })
    },
    register({ commit }, payload) {
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
            const newUser = user.user;
                newUser.updateProfile({
                    displayName: payload.name,
                    photoURL: '',
                });
            const db = firebase.firestore();
            db.collection('users').doc(newUser.uid).set({ name: payload.name, email: payload.email, })
                .then(ref => {
                console.log('Add ID: ', ref.id)
                })
                commit('getData', { uid: newUser.uid, email: newUser.email })
            })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    },
    loginGoogle ({ dispatch }) {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(function (result) {
          dispatch('checkLogin')
        }).catch(function (error) {
          console.log(error)
        })
      },
      checkLogin ({ commit }) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            commit('getData', { uid: user.uid, email: user.email })
            commit('switchLogin')
          }
        })
      },
}

import firebase from "firebase/app"
import 'firebase/firestore'
 
if (!firebase.apps.length) {
 firebase.initializeApp({
    apiKey: "AIzaSyBeEJt7x6NdkiPCWBfqNWl5lZEudJ0PCkY",
    authDomain: "konomiru-1f37c.firebaseapp.com",
    projectId: "konomiru-1f37c",
    storageBucket: "konomiru-1f37c.appspot.com",
    messagingSenderId: "976431979111",
    appId: "1:976431979111:web:d8aa969e829799cdabd2c2",
    measurementId: "G-082DWQJYM4"
 })
}
 
export default firebase
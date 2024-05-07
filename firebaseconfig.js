// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth,getReactNativePersistence} from "firebase/auth"
import {getFirestore,collection} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeIt3jopAQqn6PnRLYYyYCy6ghYk1kNaQ",
    authDomain: "easygo-f83a9.firebaseapp.com",
    projectId: "easygo-f83a9",
    storageBucket: "easygo-f83a9.appspot.com",
    messagingSenderId: "593501848581",
    appId: "1:593501848581:web:4ad9d628102da96629886c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=initializeAuth(app,{
    persistence:getReactNativePersistence()
})

export const db=getFirestore(app);

export const roomRef=collection(db,'rooms')
export const userRef=collection(db,'users')
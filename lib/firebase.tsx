// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA75JYTRECwAc5SGJFwBsTEN6DivlSddgs",
  authDomain: "kanuura-fcf00.firebaseapp.com",
  databaseURL: "https://kanuura-fcf00-default-rtdb.firebaseio.com",
  projectId: "kanuura-fcf00",
  storageBucket: "kanuura-fcf00.firebasestorage.app",
  messagingSenderId: "774738591582",
  appId: "1:774738591582:web:708a2087ad921332c1d9cf",
  measurementId: "G-BJ2SCDXVP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const fireStore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export {app,db,fireStore,auth,storage}
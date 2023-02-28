// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK59Iqk3cwfvMH4sCtjqHZ-sc7i_pugjI",
  authDomain: "eventz-rush.firebaseapp.com",
  projectId: "eventz-rush",
  storageBucket: "eventz-rush.appspot.com",
  messagingSenderId: "365928955961",
  appId: "1:365928955961:web:d95e4be152bc422448cde8",
  measurementId: "G-63Z1D8N07C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { db, auth };

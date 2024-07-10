// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXUQYIqoMXKCvuC_Htz4hykUnaZI_tFPM",
  authDomain: "hokkientranslationapp.firebaseapp.com",
  databaseURL: "https://hokkientranslationapp-default-rtdb.firebaseio.com",
  projectId: "hokkientranslationapp",
  storageBucket: "hokkientranslationapp.appspot.com",
  messagingSenderId: "813107102392",
  appId: "1:813107102392:web:43a8f096ae961be234ea4d",
  measurementId: "G-ERE55KCSP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
export default app;


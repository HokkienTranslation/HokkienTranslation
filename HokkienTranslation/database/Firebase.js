import { initializeApp } from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDXUQYIqoMXKCvuC_Htz4hykUnaZI_tFPM",
  authDomain: "hokkientranslationapp.firebaseapp.com",
  databaseURL: "https://hokkientranslationapp-default-rtdb.firebaseio.com",
  projectId: "hokkientranslationapp",
  storageBucket: "hokkientranslationapp.appspot.com",
  messagingSenderId: "813107102392",
  appId: "1:813107102392:web:43a8f096ae961be234ea4d",
  measurementId: "G-ERE55KCSP9",
};
const firebase = initializeApp(firebaseConfig);

export default firebase;

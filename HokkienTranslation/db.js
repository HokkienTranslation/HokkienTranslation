import { initializeApp } from "firebase/app";

import { getFirestore, collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";

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
const db = getFirestore(app);

const collectionName = "translation";

async function addTranslation(eng, hok) {
  // Note that setDoc overwrites the document if it already exists
  await setDoc(doc(db, collectionName, eng), {
    hokkien: hok
  });
}

async function getTranslation() {
  // Dumps all the documents in the collection
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().hokkien}`);
  });
}

export { addTranslation, getTranslation };

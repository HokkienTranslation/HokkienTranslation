import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import firebase from "./Firebase.js";

// Initialize Firebase
const app = firebase;
const db = getFirestore(app);

const collectionName = "translation";

export async function addTranslation(data) {
  const docRef = doc(collection(db, collectionName));
  await setDoc(docRef, {
    englishInput: "",
    chineseInput: "",
    hokkienTranslation: data.word,
    definitions: data.definition,
    sentence_id: "",
  });
}

// export async function addTranslation(eng, hok) {
//   // Note that setDoc overwrites the document if it already exists
//   await setDoc(doc(db, collectionName, eng), {
//     hokkien: hok,
//   });
// }

export async function getTranslation() {
  // Dumps all the documents in the collection
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().hokkien}`);
  });
}

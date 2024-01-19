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

export async function addTranslation(data) {
  const collectionName = "translation";
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

export async function addSentence(data) {
  const collectionName = "sentence";
  const docRef = doc(collection(db, collectionName));
  const engSentence = data.English_sentence;
  const hokSentence = data.Sentence;
  const imagePath = path.join("../../data/total_img_125", data.Gpt4_image_path);
  await setDoc(docRef, {
    translation_list: [],
    sentences: [],
    image_url: "",
  });
}

export async function getData(collectionName) {
  // Dumps all the documents in the collection
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { readFile } from "fs/promises";
import firebase from "./Firebase.js";

// Initialize Firebase
const app = firebase;
const db = getFirestore(app);
const storage = getStorage(app);

// Add Translation data to Firebase
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

// Add Senetence data to Firebase
export async function addSentence(data) {
  const collectionName = "sentence";
  const docRef = doc(collection(db, collectionName));
  const engSentence = data.English_sentence;
  const hokSentence = data.Sentence;
  const imageUrl = uploadImage(data.imagePath);

  await setDoc(docRef, {
    translation_list: [],
    sentences: [],
    image_url: imageUrl,
  });
}

// Upload image to google storage
export async function uploadImage(filename) {
  const localPath = `../data/total_img_125/${filename}`;
  console.log(localPath);

  try {
    const buffer = await readFile(localPath);
    const imageRef = storageRef(storage, `images/${filename}`);
    const snapshot = await uploadBytes(imageRef, buffer);
    console.log("Uploaded a blob or file!");

    const imageUrl = await getDownloadURL(snapshot.ref);
    console.log(imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// export async function getData(collectionName) {
//   // Dumps all the documents in the collection
//   const querySnapshot = await getDocs(collection(db, collectionName));
//   querySnapshot.forEach((doc) => {
//     console.log(`${doc.id} => ${doc.data()}`);
//   });
// }

// uploadImage("ID_1.png");

// getData("sentence");

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
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
    englishInput: data.englishInput,
    chineseInput: data.chineseInput,
    hokkienTranslation: data.hokkienTranslation,
    definitions: data.definitions,
    sentence: "",
  });
  return docRef.id;
}

// Add Sentence data to Firebase
export async function addSentence(data) {
  const collectionName = "sentence";
  const docRef = doc(collection(db, collectionName));

  await setDoc(docRef, {
    translationList: [],
    sentences: data.sentences,
    imageURL: data.imageURL,
  });
  return docRef.id;
}

// Upload image to google storage
// TODO: Do not upload Image with same Image Path for Excel Reading
export async function uploadImage(filename) {
  const localPath = `../../../data/total_img_125/${filename}`;
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

// Update Translation with Sentence ID
export async function updateTranslationWithSentence(translationId, sentenceId) {
  const translationRef = doc(db, "translation", translationId);
  await updateDoc(translationRef, {
    sentence: sentenceId,
  });
}

// Update Sentence with Translation ID
export async function updateSentenceWithTranslation(
  sentenceId,
  translationList
) {
  const sentenceRef = doc(db, "sentence", sentenceId);
  await updateDoc(sentenceRef, {
    translationList: translationList,
  });
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

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import firebase from "./Firebase.js";

const app = firebase;
const db = getFirestore(app);
const collectionName = "translation";

export async function checkIfTranslationExists(englishInput, chineseInput) {
  const translationsRef = collection(db, collectionName);
  const q = query(
    translationsRef,
    where("englishInput", "==", englishInput),
    where("chineseInput", "==", chineseInput)
  );

  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}

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
// Function to check if user input already in database
export async function checkIfTranslationExists(englishInput, chineseInput) {
  const translationsRef = collection(db, collectionName);
  const q = query(
    translationsRef,
    where("englishInput", "==", englishInput),
    where("chineseInput", "==", chineseInput)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming pair of englishInput and chineseInput is unique, only one document matching the query.
      const translationDocument = querySnapshot.docs[0];
      console.log("Translation Found:");
      console.log(translationDocument.data());
      return translationDocument.data();
    } else {
      // No data in the database
      console.log(
        `No Translation with englishInput: ${englishInput} and chineseInput:${chineseInput}`
      );
      return null;
    }
  } catch (error) {
    console.error("Error getting Translation: ", error);
    throw error;
  }
}

// checkIfTranslationExists("Thank you", "谢谢");

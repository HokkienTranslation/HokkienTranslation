import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import firebase from "./Firebase.js";
import { determineLanguage } from "../BackendUtils.js";
import { fetchTranslation } from "../API/HokkienTranslationToolService.js";

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

// Return englishInput, chineseInput, and hokkienTranslation
export async function translateToThree(query) {
  const inputLanguage = determineLanguage(query);
  let englishInput = "";
  let chineseInput = "";

  if (inputLanguage === "ZH") {
    englishInput = await fetchTranslation(query, "EN");
  } else if (inputLanguage === "EN") {
    englishInput = query;
  }
  chineseInput = await fetchTranslation(query, "ZH");
  const hokkienTranslation = await fetchTranslation(query, "HAN");
  // console.log(englishInput, chineseInput, hokkienTranslation);

  return { englishInput, chineseInput, hokkienTranslation };
}

// checkIfTranslationExists("Thank you", "谢谢");

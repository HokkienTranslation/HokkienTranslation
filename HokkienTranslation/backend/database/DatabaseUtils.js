import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import firebase from "./Firebase.js";
import { determineLanguage } from "../BackendUtils.js";
import { fetchTranslation } from "../API/HokkienTranslationToolService.js";

const app = firebase;
const db = getFirestore(app);
// Function to check if user input already in database
export async function checkIfTranslationExists(englishInput, chineseInput) {
  const collectionName = "translation";
  const translationsRef = collection(db, collectionName);
  const qEnglish = query(
    translationsRef,
    where("englishInput", "==", englishInput)
  );
  const qChinese = query(
    translationsRef,
    where("chineseInput", "==", chineseInput)
  );

  try {
    const englishQuerySnapshot = await getDocs(qEnglish);
    const chineseQuerySnapshot = await getDocs(qChinese);
    if (!englishQuerySnapshot.empty) {
      const translationDocument = englishQuerySnapshot.docs[0];
      return translationDocument.data();
    } else if (!chineseQuerySnapshot.empty) {
      const translationDocument = chineseQuerySnapshot.docs[0];
      return translationDocument.data();
    } else {
      // No data in the database
      // console.log(
      //   `No Translation with englishInput: ${englishInput} and chineseInput:${chineseInput}`
      // );
      return null;
    }
  } catch (error) {
    console.error("Error getting Translation: ", error);
    throw error;
  }
}

// Function to check if a sentence exists by its ID
export async function checkIfSentenceExists(sentenceID) {
  const collectionName = "sentence";
  const sentenceRef = doc(db, collectionName, sentenceID);

  try {
    const docSnap = await getDoc(sentenceRef);
    if (docSnap.exists()) {
      // console.log("Sentence Found:");
      // console.log(docSnap.data());
      return docSnap.data();
    } else {
      // No sentence found with the given ID
      // console.log(`No Sentence with ID: ${sentenceID}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting Sentence: ", error);
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

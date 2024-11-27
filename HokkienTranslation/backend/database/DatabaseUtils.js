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
    englishInput = englishInput
      .toLowerCase()
      .replace(/[^a-z0-9\s,.!?_:"\-]/gi, "");
  } else if (inputLanguage === "EN") {
    englishInput = query;
  }
  chineseInput = await fetchTranslation(query, "ZH");
  const hokkienTranslation = await fetchTranslation(query, "HAN");
  // console.log(englishInput, chineseInput, hokkienTranslation);

  return { englishInput, chineseInput, hokkienTranslation };
}

export async function getStoredHokkien(prompt, language) {
  // language is the language of the prompt
  try {
    const flashcardRef = collection(db, 'flashcard');
    // firebase does not allow queries with multiple '!='s
    // so this assumes that if it has audioUrl, it has romanization
    let q;
    if (!prompt) {
      return null;
    }
    if (language === "English") {
      q = query(flashcardRef, 
        where('destination', '==', prompt),
        where("audioUrl", "!=", null)); 
    } else { // Hokkien
      q = query(flashcardRef, 
        where('origin', '==', prompt),
        where("audioUrl", "!=", null)); 
    }
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const flashcard = querySnapshot.docs[0].data();
      const romanization = flashcard.romanization;
      const audioUrl = flashcard.audioUrl;
      const origin = flashcard.origin;
      if (audioUrl && romanization) {
        return { audioUrl, romanization, origin };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting stored Hokkien: ", error);
    throw error;
  }
}

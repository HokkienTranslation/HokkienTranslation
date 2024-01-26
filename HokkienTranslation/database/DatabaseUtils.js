import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import firebase from "./Firebase.js";
import {
  determineLanguage,
  HokkienTranslationTool,
} from "../screens/components/HokkienTranslationTool.js";

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

<<<<<<< HEAD
// Return englishInput, chineseInput, and hokkienTranslation
export async function translateToThree(query) {
  const inputLanguage = useMemo(() => determineLanguage(query), [query]);
  const inputStoreLanguage = inputLanguage === "ZH" ? "EN" : "ZH";
  const englishInput = "";
  const chineseInput = "";

  if (inputLanguage === "ZH") {
    englishInput = inputStoreLanguage;
    chineseInput = inputLanguage;
  } else if (inputLanguage === "EN") {
    englishInput = inputLanguage;
    chineseInput = inputStoreLanguage;
  }

  return englishInput, chineseInput, HokkienTranslationTool(query, "HAN");
}

checkIfTranslationExists("Thank you", "谢谢");
=======
  return !querySnapshot.empty;
}
>>>>>>> parent of 578f933 (Updated HokkienTranslationTool to translate ENG->HAN & HAN->ENG)

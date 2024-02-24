import {
  translateToThree,
  checkIfTranslationExists,
  checkIfSentenceExists,
} from "./database/DatabaseUtils.js";

async function CheckDatabase(query) {
  if (!query) return null;

  try {
    const threeTranslations = await translateToThree(query);
    const translation = await checkIfTranslationExists(
      threeTranslations.englishInput,
      threeTranslations.chineseInput
    );
    if (translation) {
      const sentence = await checkIfSentenceExists(translation.sentence);
      if (sentence) {
        console.log(translation);
        return { translation, sentence };
      } else {
        console.log("No sentence found in database");
      }
    } else {
      console.log("No translation and sentence found in database");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export { CheckDatabase };

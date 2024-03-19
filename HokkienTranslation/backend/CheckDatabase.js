import {
  translateToThree,
  checkIfTranslationExists,
  checkIfSentenceExists,
} from "./database/DatabaseUtils.js";

async function CheckDatabase(query) {
  if (!query) return null;

  try {
    let threeTranslations = await translateToThree(query);
    threeTranslations.englishInput = threeTranslations.englishInput
      .toLowerCase()
      .replace(/[^a-z\s]/gi, "");
    const translation = await checkIfTranslationExists(
      threeTranslations.englishInput,
      threeTranslations.chineseInput
    );
    if (translation) {
      const sentence = await checkIfSentenceExists(translation.sentence);
      if (sentence) {
        return { translation, sentence };
      } else {
        // console.log("No sentence found in database");
        return { translation };
      }
    } else {
      // console.log("No translation and sentence found in database");
      return { threeTranslations };
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export { CheckDatabase };

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
    const sentence = await checkIfSentenceExists(translation.sentence);

    // console.log(translation, sentence);
    return { translation, sentence };
  } catch (error) {
    console.error("Error:", error);
  }
}

// CheckDatabase("壁櫥");

export { CheckDatabase };

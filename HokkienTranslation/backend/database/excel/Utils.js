import { readExcelFile } from "./ExcelReader.js";
import {
  addTranslation,
  addSentence,
  uploadImage,
  updateTranslationWithSentence,
  updateSentenceWithTranslation,
} from "../Database.js";
import {
  checkIfTranslationExists,
  translateToThree,
} from "../DatabaseUtils.js";
import { fetchTranslation } from "../../API/HokkienTranslationToolService.js";

// TODO: Check how to implement adding different word, but same sentence
// TODO: Check if entries are correctly added
export async function formatedData(row) {
  let word = row.word;
  let hokkienSentence = row.sentence;
  let englishSentence = row.english_sentence;
  let definitions = row.definition;
  let imagePath = await uploadImage(row.gpt4_image_path);

  let threeTranslations = await translateToThree(word);
  let chineseSentence = await fetchTranslation(hokkienSentence, "ZH");

  const exist = await checkIfTranslationExists(
    threeTranslations.englishInput,
    threeTranslations.chineseInput
  );
  console.log("-------------------------------");
  console.log(exist);

  if (!exist) {
    console.log("Adding new Translation and Sentence");
    let TranslationData = {
      englishInput: threeTranslations.englishInput,
      chineseInput: threeTranslations.chineseInput,
      hokkienTranslation: threeTranslations.hokkienTranslation,
      definitions: definitions,
      sentence: "",
    };

    let SentenceData = {
      translationList: [],
      sentences: [hokkienSentence, englishSentence, chineseSentence],
      imageURL: imagePath,
    };

    // Create a new Translation
    const translationId = await addTranslation(TranslationData);

    // Link the sentence ID to the Translation
    TranslationData.sentence = await addSentence(SentenceData);

    // Update the Translation with the linked sentence ID
    await updateTranslationWithSentence(
      translationId,
      TranslationData.sentence
    );

    // Link the translation ID to the Sentence
    SentenceData.translationList.push(translationId);

    // Update the Sentence with the linked translation ID
    await updateSentenceWithTranslation(
      TranslationData.sentence,
      SentenceData.translationList
    );

    return { TranslationData, SentenceData };

    //   }
  } else {
    console.log("Translation already exists in the database.");
  }
}

// Function to store excel data in the database if not present already
export async function storeExcelDataInDatabase() {
  const data = readExcelFile();
  for (let row of data) {
    await formatedData(row);
  }
}
storeExcelDataInDatabase();

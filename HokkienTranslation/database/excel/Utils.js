import readExcelFile from "./ExcelReader.js";
import { addTranslation } from "../Database.js";
import { checkIfTranslationExists } from "../DatabaseUtils.js";

async function storeDataInDatabase() {
  const data = readExcelFile();
  const row = data[0];
  const chineseInput = "多谢";
  const englishInput = "Thank you";
  if (!checkIfTranslationExists(chineseInput, englishInput)) {
    await addTranslation(data[0]);
    //   for (let row of data) {
    //     await addTranslation(row);
    //   }
  } else {
    console.log("Translation already exists in the database.");
  }
}

storeDataInDatabase();

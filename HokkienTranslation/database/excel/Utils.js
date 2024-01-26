import { readExcelFile } from "./ExcelReader.js";
import { addTranslation } from "../Database.js";
import { checkIfTranslationExists } from "../DatabaseUtils.js";

// Function to store excel data in the database if not present already
export async function storeExcelDataInDatabase() {
  const data = readExcelFile();
  const row = data[0];
  const chineseInput = "多谢";
  const englishInput = "Thank you";
  // console.log(row);
  const exist = checkIfTranslationExists(englishInput, chineseInput);
  console.log(exist);
  if (!exist) {
    console.log("Adding new Translation");
    await addTranslation(row);
    //   for (let row of data) {
    //     await addTranslation(row);
    //   }
  } else {
    console.log("Translation already exists in the database.");
  }
}
storeExcelDataInDatabase();

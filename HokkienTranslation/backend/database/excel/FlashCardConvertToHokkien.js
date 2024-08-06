import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { promises as fs } from "fs";
import { fetchTranslation } from "../../API/HokkienTranslationToolService.js";

const inputFilePath = "../../../data/flashcard_data_samples.csv";
const outputFilePath = "../../../data/modified_flashcard_data_samples.csv";

const loadAndModifyCSV = async () => {
  try {
    // Read
    const csvString = await fs.readFile(inputFilePath, "utf-8");

    // Parse
    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
    });

    // Modify
    for (const record of records) {
      try {
        const hokkienTranslation = await fetchTranslation(record.origin);
        record.origin = hokkienTranslation;
      } catch (error) {
        console.error(`Error translating "${record.origin}":`, error);
        record.origin = `Error: ${record.origin}`; // Mark the translation as failed
      }
    }

    // Convert to CSV format
    const modifiedCSV = stringify(records, {
      header: true,
    });

    // Save
    await fs.writeFile(outputFilePath, modifiedCSV, "utf-8");

    console.log("CSV data has been successfully modified and saved.");
  } catch (error) {
    console.error("Error loading or modifying CSV data:", error);
  }
};

loadAndModifyCSV();

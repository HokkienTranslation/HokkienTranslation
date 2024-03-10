// ExcelReader.js
import fs from "fs";
import XLSX from "xlsx";

const readExcelFile = () => {
  const filePath = "../../../data/df_with_eng_definition.csv";
  const fileContents = fs.readFileSync(filePath, "utf8");
  const workbook = XLSX.read(fileContents, { type: "string" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  // console.log(jsonData[3]);
  return jsonData;
};
export { readExcelFile };

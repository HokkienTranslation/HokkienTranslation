import fs from "fs";
import csvParser from "csv-parser";
import { fetchTranslation } from "../API/HokkienTranslationToolService.js";
import { collection, addDoc, doc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./Firebase.js"

const updateContextSentence = async (querySnapshot2, sentenceId) => {
    try {
      const promises = querySnapshot2.docs.map(async (docSnapshot) => {
        const docRef = doc(db, "flashcard", docSnapshot.id); // Replace "flashcard" with your collection name
  
        // Update the document with the new contextSentence field
        await updateDoc(docRef, {
          contextSentence: sentenceId, // Set the contextSentence field to sentenceId
        });
  
        console.log(`Updated document ID: ${docSnapshot.id}`);
      });
  
      // Wait for all updates to complete
      await Promise.all(promises);
  
      console.log("All documents updated successfully.");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
};

const processCsv = async () => {

    const inputFilePath = "./scripts/sentence_20241018.csv"; 
    let headers = [];
    let rows = [];

    // Step 1: Read and Parse the CSV File
    await new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(csvParser())
            .on("headers", (headerList) => {
                headers = headerList;
            })
            .on("data", (row) => rows.push(row))
            .on("end", resolve)
            .on("error", reject);
    });

    const translationCollection = collection(db, "translation");
    const sentenceCollection = collection(db, "sentence");
    const flashcardCollection = collection(db, "flashcard");

    // Step 2: Process each row
    for (const row of rows) {
        if (row["Sentence"] && row["Sentence"].trim() !== "") {

            try {
                // 1. Get Translations
                let engTranslation = await fetchTranslation(row.Sentence, "EN");
                let chiTranslation = await fetchTranslation(row.Sentence, "ZH");

                // 2. Match with translation (if exists)
                let q1 = query(translationCollection, where("hokkienTranslation", "==", row.Hokkien));
                const querySnapshot1 = await getDocs(q1);

                const matchingTranslations = [];
                querySnapshot1.forEach((doc) => {
                    matchingTranslations.push(doc.id); // Add each document ID to the list
                });
               
                // 3. Upload to firebase
                const newEntry = {
                    imageURL: null,
                    sentences: [
                        row.Sentence,
                        engTranslation,
                        chiTranslation
                    ],
                    translationList: matchingTranslations,
                };

                const docRef = await addDoc(sentenceCollection, newEntry);


                // 4. Match with flashcard
                let q2 = query(flashcardCollection, where("origin", "==", row.Hokkien));
                const querySnapshot2 = await getDocs(q2);
                await updateContextSentence(querySnapshot2, docRef.id);

                console.log("Document successfully added with ID: ", docRef.id);

            } catch (error) {
                console.error(`Error in translating/uploading sentence "${row.sentence}":`, error.message);
            }

        }
    }

};

processCsv();

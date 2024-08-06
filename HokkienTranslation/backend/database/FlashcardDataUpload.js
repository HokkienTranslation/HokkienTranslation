import { parse } from "csv-parse";
import { promises as fs } from "fs";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./Firebase.js";

const categories = [
  "Daily Conversations",
  "Dining and Food",
  "Travel and Transportation",
  "Work and Business",
  "Shopping",
  "Health and Medicine",
  "Family and Relationships",
  "Education and Learning",
  "Hobbies and Leisure",
  "Emergency Situations",
  "Other",
];

const createdBy = "vincenthero16@gmail.com";

const uploadData = async () => {
  try {
    const path = "../../data/flashcard_data_samples.csv";
    const csvString = await fs.readFile(path, "utf-8");

    parse(
      csvString,
      {
        columns: true,
        skip_empty_lines: true,
      },
      async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        for (const category of categories) {
          const categoryId = category.replace(/\s+/g, "_");
          const flashcardListName = `${category} Starter`;
          const flashcardListRef = doc(collection(db, "flashcardList"));
          const flashcardList = {
            name: flashcardListName,
            cardList: [],
            categoryId,
            shared: true,
            createdBy: createdBy,
            createdAt: new Date().toISOString(),
          };

          await setDoc(flashcardListRef, flashcardList);

          for (let i = 0; i < 10; i++) {
            const flashcardData = data.shift();
            if (!flashcardData) break;

            const flashcardRef = doc(collection(db, "flashcard"));
            const flashcard = {
              origin: flashcardData.origin,
              destination: flashcardData.destination,
              otherOptions: flashcardData.otherOptions.split(";"),
              type: flashcardData.type,
              categoryId,
              createdBy: createdBy,
              createdAt: new Date().toISOString(),
            };

            await setDoc(flashcardRef, flashcard);

            flashcardList.cardList.push(flashcardRef.id);
          }

          await setDoc(
            flashcardListRef,
            { cardList: flashcardList.cardList },
            { merge: true }
          );

          const flashcardQuizRef = doc(collection(db, "flashcardQuiz"));
          const flashcardQuiz = {
            flashcardListId: flashcardListRef.id,
            scores: {
              [createdBy]: [],
            },
            card_score: {},
          };

          await setDoc(flashcardQuizRef, flashcardQuiz);
        }
      }
    );
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

uploadData();


import { collection, getDocs } from "firebase/firestore";




async function getFlashcardList(db, currentUser) {
    const flashcardCol = collection(db, "flashcardList");
    const flashcardSnapshot = await getDocs(flashcardCol);

    const flashcardList = flashcardSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Print: ", flashcardList)

    flashcardList.forEach((deck) => {
      if (deck.createdBy !== currentUser && !deck.shared) {
        flashcardList.splice(flashcardList.indexOf(deck), 1);
      }
    });

    return flashcardList;
  }
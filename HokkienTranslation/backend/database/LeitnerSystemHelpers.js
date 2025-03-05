import { db } from "./Firebase.js";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp,
    arrayUnion
} from "firebase/firestore";

/* Function for initializing Leitner Box for a new user or flashcard. 
    Called when a new user registers or a new flashcard is created. */
export const initializeLeitnerBox = async (userId, flashcardId) => {
    try {
        const docRef = await addDoc(collection(db, "leitnerBoxes"), {
            userId: userId,
            flashcardId: flashcardId,
            boxNum: 1,
            correctAns: 0,
            incorrectAns: 0,
            lastUpdated: serverTimestamp(),
        });
        console.log("LeitnerBox document successfully created with ID:", docRef.id);
    } catch (error) {
        console.error("Error initializing Leitner Box: ", error);
    }
};

/* Function for updating Leitner Box based on user answer to the flashcard. 
    Called when a user answers a quiz question. */
export const updateLeitnerBox = async (userId, flashcardId, isCorrect) => {
    try {
        const q = query(
            collection(db, "leitnerBoxes"),
            where("userId", "==", userId),
            where("flashcardId", "==", flashcardId)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No matching document found.");
        }

        // Retrieve the document reference (assume only one document exists)
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
        let newBox = docData.boxNum;

        // Find the new boxNum
        if (isCorrect) {
            // Move to next box if correct
            newBox = Math.min(newBox + 1, 3);
        } else {
            newBox = 1;
        }

        // Update the document with new data
        await updateDoc(docRef, {
            boxNum: newBox,
            correctAns: isCorrect ? docData.correctAns + 1 : docData.correctAns,
            incorrectAns: isCorrect ? docData.incorrectAns : docData.incorrectAns + 1,
            lastUpdated: serverTimestamp(),
        });

        console.log("Document updated successfully with ID:", docRef.id);
    } catch (error) {
        console.error("Error updating Leitner Box:", error);
    }
};

/* Function for counting points user earns based on user answer to the flashcard. 
    Called when a user answers a quiz question. */
export const countPointsByFlashcard = async (userId, flashcardId, isCorrect) => {
    try {
        const q = query(
            collection(db, "leitnerBoxes"),
            where("userId", "==", userId),
            where("flashcardId", "==", flashcardId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No matching document found.");
        }

        // Retrieve the document reference (assume only one document exists)
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();

        if (isCorrect) {
            if (docData.boxNum === 1) {
                return 4;
            } else if (docData.boxNum === 2) {
                return 2;
            } else { // boxNum === 3
                return 1;
            }
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error counting points by flashcard:", error);
        return null;
    }
};

/* Function for computing the weighted score the user can receive after a quiz if they answer all questions correctly. 
   Called when displaying decks (aka. flashcard lists). */
export const weightedScoreByDeck = async (userId, flashcardListId) => {
    try {
        // Get the flashcardIds from the flashcardList document
        const flashcardListRef = doc(db, "flashcardList", flashcardListId)
        const flashcardListDoc = await getDoc(flashcardListRef);

        if (!flashcardListDoc.exists()) {
            throw new Error("Flashcard list not found.");
        }

        const flashcardIds = flashcardListDoc.data().cardList;
        if (!flashcardIds || flashcardIds.length === 0) throw new Error("flashcard list contains no flashcards");

        // Query the leitnerBoxes collection for all flashcards in the list
        const q = query(
            collection(db, "leitnerBoxes"),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const filteredDocs = querySnapshot.docs.filter(doc => flashcardIds.includes(doc.data().flashcardId));

        let weightedScore = 0;
        filteredDocs.forEach((doc) => {
            const data = doc.data();
            if (data.boxNum === 1) weightedScore += 4;
            if (data.boxNum === 2) weightedScore += 2;
            if (data.boxNum === 3) weightedScore += 1;
        });

        return weightedScore;

    } catch (error) {
        console.error("Error computing weighted score by deck:", error);
        return null;
    }
};

/* Function for adding points to user after a quiz. 
   Called when a user finishes a quiz. */
export const updateUserPoints = async (userId, pointsToAdd) => {
    try {
        // Get the userPoints doc corresponding to userId
        const q = query(
            collection(db, "pointsLevelProgress"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No matching user found");
        }

        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
        let newPoints = docData.points + pointsToAdd;

        // Update the document with new data
        await updateDoc(docRef, {
            points: newPoints
        });

        console.log("User points updated successfully with ID:", docRef.id);
    } catch (error) {
        console.error("Error updating user points:", error);
    }
};

/* Function for computing user level given userId and points per level (e.g. 30 points per level). */
export const getUserLevel = async (userId, pointsPerLevel) => {
    try {

        // Get the userPoints doc corresponding to userId
        const q = query(
            collection(db, "pointsLevelProgress"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No matching user found");
        }

        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();

        const currPoints = docData.points;
        const level = Math.floor(currPoints / pointsPerLevel) + 1;

        return level;

    } catch (error) {
        console.error("Error getting user level:", error);
        return null;
    }
};

/* Function for computing user points given userId and points per level (e.g. 30 points per level). */
export const getUserPoints = async (userId) => {
    try {

        // Get the userPoints doc corresponding to userId
        const q = query(
            collection(db, "pointsLevelProgress"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No matching user found");
        }

        const docData = querySnapshot.docs[0].data();

        const currPoints = docData.points;
        return currPoints;

    } catch (error) {
        console.error("Error getting user level:", error);
        return null;
    }
};

/* Function for initializing LeitnerBoxes for users when they just registered. */
export const initializeLeitnerBoxesForUser = async (userId) => {
    try {
        console.log("Fetching all flashcards for user:", userId);

        // Step 1: Query all flashcards from the "flashcard" collection
        const flashcardCollectionRef = collection(db, "flashcard");
        const flashcardSnapshot = await getDocs(flashcardCollectionRef);

        console.log("Found", flashcardSnapshot.docs.length, "flashcards.");

        // Step 2: Initialize Leitner Box for each flashcard
        for (const doc of flashcardSnapshot.docs) {
            const flashcardId = doc.id;
            await initializeLeitnerBox(userId, flashcardId);
        }

        console.log("Leitner Boxes initialized for all flashcards.");
    } catch (error) {
        console.error("Error initializing Leitner Boxes:", error);
    }
};

/* Function for initializing user point level progress object for a new user. 
  Called when a new user registers.*/
export const initializePointLevelProgress = async (userId) => {
    try {
        const docRef = await addDoc(collection(db, "pointsLevelProgress"), {
            userId: userId,
            points: 0,
            learnedDecks: [],
        });
        console.log("PointsLevelProgress document successfully created with ID:", docRef.id);
    } catch (error) {
        console.error("Error initializing PointsLevelProgress: ", error);
    }
};

/* Function for adding a learned deck to a user's learned decks array. 
  Called when a new deck is learned.*/
export const appendToLearnedDecks = async (userId, newDeck) => {
    try {
        const pointsLevelProgressRef = collection(db, "pointsLevelProgress");
        const q = query(pointsLevelProgressRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No pointsLevelProgress document found for user: ", userId);
        }

        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(db, "pointsLevelProgress", userDoc.id);

        await updateDoc(userDocRef, {
            learnedDecks: arrayUnion(newDeck)
        });

        console.log("Successfully added new deck to learnedDecks for user: ", userId, "with deck ", newDeck);
    } catch (error) {
        console.error("Error appending to learned decks: ", error)
    }
}

/* Function for determining if the user first quizzes on this deckId. 
  Called when a new deck is learned.*/
export const isFirstTimeQuiz = async (userId, deckId) => {
    try {
        const pointsLevelProgressRef = collection(db, "pointsLevelProgress");
        const q = query(pointsLevelProgressRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("No pointsLevelProgress document found for user: ", userId);
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        return !(userData.learnedDecks && userData.learnedDecks.includes(deckId));
    } catch (error) {
        console.error("Error checking if ", deckId, " is first time quiz for user ", userId);
        return null;
    }
};
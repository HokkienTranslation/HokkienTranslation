import { initializeApp } from "firebase/app";
import { getFirestore, deleteDoc, collection, doc, getDocs } from "firebase/firestore";
import {
    initializeLeitnerBox,
    updateLeitnerBox,
    countPointsByFlashcard,
    weightedScoreByDeck,
    updateUserPoints,
    getUserLevel,
    initializeLeitnerBoxesForUser,
    initializePointLevelProgress,
    appendToLearnedDecks,
    isFirstTimeQuiz,
    getUserPoints
} from "./backend/database/LeitnerSystemHelpers.js";

// ✅ Initialize Firebase App (Replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyDXUQYIqoMXKCvuC_Htz4hykUnaZI_tFPM",
    authDomain: "hokkientranslationapp.firebaseapp.com",
    databaseURL: "https://hokkientranslationapp-default-rtdb.firebaseio.com",
    projectId: "hokkientranslationapp",
    storageBucket: "hokkientranslationapp.appspot.com",
    messagingSenderId: "813107102392",
    appId: "1:813107102392:web:43a8f096ae961be234ea4d",
    measurementId: "G-ERE55KCSP9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Test Data
const testUserId = "jasmine.tsoi@mail.utoronto.ca";
const testFlashcardId = "0IGBp4TQeEWkYz1Yj3Pz";
const testFlashcardListId = "prices";
const pointsPerLevel = 30; // Customize as needed

// ✅ Run Tests
const runTests = async () => {
    try {
        /*
        console.log("\n🔥 [1] Initializing Leitner Box...");
        await initializeLeitnerBox(testUserId, testFlashcardId);

        console.log("\n✅ [2] Updating Leitner Box (Correct Answer)...");
        await updateLeitnerBox(testUserId, testFlashcardId, true);

        console.log("\n❌ [3] Updating Leitner Box (Incorrect Answer)...");
        await updateLeitnerBox(testUserId, testFlashcardId, false);

        console.log("\n📊 [4] Counting Points by Flashcard (Correct Answer)...");
        const points = await countPointsByFlashcard(testUserId, testFlashcardId, true);
        console.log("🔢 Earned Points:", points);

        console.log("\n📈 [5] Calculating Weighted Score for Deck...");
        const score = await weightedScoreByDeck("jasmine_test@mail.utoronto.ca", "Test");
        console.log("📊 Weighted Score:", score);

        console.log("\n💰 [6] Updating User Points...");
        await updateUserPoints(testUserId, 40);

        console.log("\n🏆 [7] Fetching User Level...");
        const level = await getUserLevel(testUserId, pointsPerLevel);
        console.log("⭐ User Level:", level);
        
        console.log("\n🔥 [8] Initializng Leitner Boxes for all flashcards...")
        await initializeLeitnerBoxesForUser(testUserId);

        console.log("\n🔥 [9] Initializing pointsLevelProgress...");
        await initializePointLevelProgress("testuserid");
        
        
        console.log("\n⭐ [10] Appending to learnedDecks...");
        await appendToLearnedDecks("jasmine_test@mail.utoronto.ca", "appendDeck");
        

        console.log("\n⭐ [11] Checking first time quiz...");
        const firstTime1 = await isFirstTimeQuiz("jasmine_test@mail.utoronto.ca", "appendDeck");
        const firstTime2 = await isFirstTimeQuiz("jasmine_test@mail.utoronto.ca", "Shopping Starter");
        console.log(firstTime1); // Expected: true
        console.log(firstTime2); // Expected: false
        */
        console.log("\n📈 [5] Calculating Weighted Score for Deck...");
        const score = await getUserPoints("jasmine_test@mail.utoronto.ca")
        console.log("📊 Level: ", score);

        console.log("Test done.")

        return;
    } catch (error) {
        console.error("\n❌ Test Failed:", error);
    }
};

// Delete documents
const deleteAllDocuments = async (collectionName) => {
    try {
        console.log(`🔍 Fetching all documents from '${collectionName}'...`);

        // Get all documents from the collection
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        if (querySnapshot.empty) {
            console.log("🚀 No documents found in the collection.");
            return;
        }

        // Delete each document
        for (const document of querySnapshot.docs) {
            await deleteDoc(doc(db, collectionName, document.id));
            console.log(`🗑️ Deleted document ID: ${document.id}`);
        }

        console.log(`✅ Successfully deleted all documents in '${collectionName}'.`);

    } catch (error) {
        console.error("❌ Error deleting documents:", error);
    }
};

// 🔥 Execute Tests
runTests();

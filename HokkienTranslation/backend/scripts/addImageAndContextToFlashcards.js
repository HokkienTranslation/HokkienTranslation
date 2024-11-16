


// should get all flashcards from database, check if has an downloadurl field do nothing, if not add a context sentence and download url

const firestore = require('@react-native-firebase/firestore');

const getStorage = require("firebase/storage").getStorage;
const ref = require("firebase/storage").ref;
const uploadBytes = require("firebase/storage").uploadBytes;
const getDownloadURL = require("firebase/storage").getDownloadURL;

const getContextSentence = require('../../screens/components/contextSentence.js').getContextSentence;
const generateImage = require("../API/TextToImageService.js").generateImage;


const fetchFlashcards = async () => {
  try {
    const snapshot = await firestore().collection('flashcard').get();
    snapshot.forEach(doc => {
      flashcards.push({ id: doc.id, ...doc.data() });
    });
    return flashcards;
  } catch (error) {
    console.error("Error fetching flashcards: ", error);
    return [];
  }
};



const fetchImage = async (prompt) => {
    try {
      const { imgBase64, error } = await generateImage(prompt);
      if (imgBase64) {
        image = `data:image/jpeg;base64,${imgBase64}`;
        console.log("Image fetched successfully");
        return image; // Return the image to pass it directly to uploadBase64Image
      } else if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log("Error fetching image:", error);
    }
  };



const uploadBase64Image = async (base64Image, userId, word) => {
    try {
      console.log("Uploading image for user:", userId);
      
      const storage = getStorage(); // Assumes Firebase app is already initialized
      console.log(word);
      const storageRef = ref(storage, `images/${userId}/${word}.jpg`);
      
      // Decode the base64 image
      const base64Response = await fetch(base64Image);
      const imageBlob = await base64Response.blob();
      
      // Upload the image to Firebase Storage
      const snapshot = await uploadBytes(storageRef, imageBlob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded successfully, URL:", downloadURL);
      
      return downloadURL; // Return URL for further usage
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };
  
  // Usage example
const processImage = async (contextSentence, currentUser, word) => {
    const base64Image = await fetchImage(contextSentence);
    if (base64Image) {
      const downloadURL = await uploadBase64Image(base64Image, currentUser, word);
      console.log("Final download URL:", downloadURL);
      return downloadURL;
    }
  };
var downloadURL;
  // Call the function with necessary parameters
  // works just noting a bug, enteredword reads as object object as opposed to the actual word, idk why tha is
//downloadURL = await processImage(contextSentence, currentUser, enteredWord);

const updateFlashcards = async () => {
const flashcards = await fetchFlashcards(); // Wait for the fetched data

var contextSentence;
for (const flashcard of flashcards) {
    // find if there is a word
    contextSentence = undefined;
    downloadURL = undefined;
    word = flashcard.destination; // english word
    if (flashcard.downloadURL === undefined) {
    if (word === undefined) {
        console.log("No word found in flashcard")
    }
    else {
        contextSentence = await getContextSentence(word);
        flashcard.contextSentence = contextSentence;
    }
    if (contextSentence === undefined ) {
        console.log("No context sentence generated");
    }
    else {
        downloadURL = await processImage(contextSentence, currentUser, word);
        flashcard.downloadURL = downloadURL;

    }
    if (downloadURL === undefined) {
        console.log("No download URL generated");
    }
    else {
        // update the flashcard with the downloadURL
        // update the flashcard with the context sentence

    }
    }
}
}

export default updateFlashcards;





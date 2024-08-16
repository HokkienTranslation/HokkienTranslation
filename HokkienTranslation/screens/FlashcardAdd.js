import { useEffect } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../backend/database/Firebase";
import { HStack, Switch } from "native-base";

var categoryID = "";
var ID = "";
async function getFlashcardsforCategory(db, category) {
  const categoryRef = collection(db, "category");

  const q = query(categoryRef, where("name", "==", category));

  const querySnapshot = await getDocs(q);
  var flashcardList = [];
  var decks = [];
  console.log(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    decks = doc.data().flashcardList;
    categoryID = doc.id;
  });

  for (const deck of decks) {
    const deckRef = doc(db, "flashcardList", deck);
    const deckDoc = await getDoc(deckRef);
    const deckData = deckDoc.data();
    for (const card of deckData.cardList) {
      flashcardList.push(card);
    }
  }

  var flashcards = [];

  // filter duplicates (by same id)
  for (const flashcard of flashcardList) {
    const flashcardRef = doc(db, "flashcard", flashcard);
    const flashcardDoc = await getDoc(flashcardRef);
    const flashcardData = flashcardDoc.data();
    console.log(flashcardData);
    // step could be taken here to ensured we are not accessing other users flashcards

    flashcards.push({
      word: flashcardData.destination,
      translation: flashcardData.origin,
      id: flashcardRef.id,
    });
  }

  // ensure unique flashcard id
  flashcards = flashcards.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );
  return flashcards;
}

const FlashcardAdd = ({ route }) => {
  const navigation = useNavigation();
  const [deckName, setDeckName] = useState(route.params.deckName || "");
  const [selectedFlashcards, setSelectedFlashcards] = useState(
    route.params.selectedFlashcards || []
  );
  const [flashcards, setFlashcards] = useState([]);
  const [shared, setShared] = useState(route.params.shared || false);

  useEffect(() => {
    getFlashcardsforCategory(db, route.params.curCategory)
      .then((flashcardList) => {
        setFlashcards(flashcardList);
      })
      .catch((error) => {
        console.error("Error fetching flashcards: ", error);
      });
  }, []);

  const toggleSelection = (id) => {
    if (selectedFlashcards.includes(id)) {
      setSelectedFlashcards(
        selectedFlashcards.filter((flashcardId) => flashcardId !== id)
      );
    } else {
      setSelectedFlashcards([...selectedFlashcards, id]);
    }
  };

  const handleSubmission = async () => {
    var cardList = selectedFlashcards;

    if (route.params.update) {
      var serverTimestamps;
      const oldFlashcardListRef = doc(
        db,
        "flashcardList",
        route.params.deckName
      );

      await getDoc(oldFlashcardListRef).then((doc) => {
        if (doc.exists()) {
          serverTimestamps = doc.data().createdAt;
          console.log(serverTimestamps);
        }
      });

      // Set the new FlashcardList with updated data
      const newFlashcardListRef = doc(db, "flashcardList", deckName);
      await setDoc(newFlashcardListRef, {
        name: deckName,
        cardList: cardList,
        createdAt: serverTimestamps,
        categoryID: categoryID,
        createdBy: route.params.currentUser,
        shared: shared,
      });

      const categoryRef2 = doc(db, "category", categoryID);
      const categoryDoc2 = await getDoc(categoryRef2);
      const categoryData2 = categoryDoc2.data();
      var flashcardList = categoryData2.flashcardList;
      flashcardList.splice(flashcardList.indexOf(route.params.deckName), 1);
      flashcardList.push(deckName);

      await updateDoc(categoryRef2, {
        flashcardList: flashcardList,
      });
    } else {
      // new FlashcardList
      const flashcardListRef = doc(db, "flashcardList", deckName);
      await setDoc(flashcardListRef, {
        name: deckName,
        cardList: cardList,
        createdAt: serverTimestamp(),
        categoryID: categoryID,
        createdBy: route.params.currentUser,
        shared: shared,
      });

      // Update the category
      const categoryRef = doc(db, "category", categoryID);
      const categoryDoc = await getDoc(categoryRef);
      const categoryData = categoryDoc.data();
      var flashcardList = categoryData.flashcardList;
      flashcardList.push(deckName);
      await updateDoc(categoryRef, {
        flashcardList: flashcardList,
      });

      // new flashcardQuiz
      const flashcardQuizRef = doc(collection(db, "flashcardQuiz"));
      await setDoc(flashcardQuizRef, {
        flashcardListId: flashcardListRef.id,
        scores: {},
      });

      console.log("FlashcardQuiz created for", flashcardListRef.id);
    }

    var flashcardList = cardList;
    cardList = [];
    for (const card of flashcardList) {
      const cardRef = doc(db, "flashcard", card);
      const cardDoc = await getDoc(cardRef);

      if (cardDoc.exists()) {
        const cardData = cardDoc.data();
        cardList.push({
          word: cardData.destination,
          translation: cardData.origin,
        });
      }
    }
    navigation.navigate("Flashcard", { cardList });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter deck name"
        value={deckName}
        onChangeText={setDeckName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <HStack style={{ flex: 1, marginBottom: 20 }}>
        <Text>Share</Text>
        <Switch
          title="Share"
          isChecked={shared}
          onToggle={() => {
            setShared(!shared);
          }}
          style={{ marginLeft: 10 }}
        />
      </HStack>
      <Button
        title="Submit"
        onPress={() => {
          handleSubmission();
        }}
      />
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelection(item.id)}>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
                backgroundColor: selectedFlashcards.includes(item.id)
                  ? "lightblue"
                  : "white",
              }}
            >
              <Text style={{ flex: 1 }}>{item.word}</Text>
              <Text style={{ flex: 1 }}>{item.translation}</Text>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: selectedFlashcards.includes(item.id)
                    ? "green"
                    : "gray",
                  backgroundColor: selectedFlashcards.includes(item.id)
                    ? "green"
                    : "white",
                }}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FlashcardAdd;

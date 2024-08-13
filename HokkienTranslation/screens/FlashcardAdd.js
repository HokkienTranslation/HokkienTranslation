import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from "react-native";
import { doc, getDocs, getDoc, setDoc, collection, query, where, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../backend/database/Firebase";

var categoryID = "";
async function getFlashcardsforCategory(db, category) {
    
    const categoryRef = collection(db, 'category');

    const q = query(categoryRef, where("name", "==", category));

    const querySnapshot = await getDocs(q);
    var flashcardList = [];
    var decks = [];
    console.log(q)
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        decks = doc.data().flashcardList;
        categoryID = doc.id;
      });
    
     
      for (const deck of decks) {
        const deckRef = doc(db, 'flashcardList', deck);
        const deckDoc = await getDoc(deckRef);
        const deckData = deckDoc.data();
        for (const card of deckData.cardList) {
            flashcardList.push(card);
        }
      }

    var flashcards = [];

    // filter duplicates (by same id)
    for (const flashcard of flashcardList) {
      const flashcardRef = doc(db, 'flashcard', flashcard);
      const flashcardDoc = await getDoc(flashcardRef);
      const flashcardData = flashcardDoc.data();
      console.log(flashcardData)
      // step could be taken here to ensured we are not accessing other users flashcards


      flashcards.push({word: flashcardData.destination, translation: flashcardData.origin, id: flashcardRef.id});
    }
    
    // ensure unique flashcard id
    flashcards = flashcards.filter((item, index, self) => 
        index === self.findIndex((t) => t.id === item.id));    
    return flashcards;
  }

  

const FlashcardAdd = ({ route }) => {

    const navigation = useNavigation();
  const [deckName, setDeckName] = useState('');
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);
const [flashcards, setFlashcards] = useState([]);





  useEffect(() => {
    getFlashcardsforCategory(db, route.params.curCategory).then((flashcardList) => {
      setFlashcards(flashcardList);
    }).catch((error) => {
      console.error("Error fetching flashcards: ", error);
    });
  }, []);

  const toggleSelection = (id) => {
    if (selectedFlashcards.includes(id)) {
      setSelectedFlashcards(selectedFlashcards.filter(flashcardId => flashcardId !== id));
    } else {
      setSelectedFlashcards([...selectedFlashcards, id]);
    }
  };

  const handleSubmission = async () => {
    // add logic

    var cardList = selectedFlashcards;

    setDoc(doc(db, 'flashcardList', deckName), {
        name: deckName,
        cardList: cardList,
        createdAt: serverTimestamp(),
        categoryID: categoryID,
        createdBy: "vincent", // TODO: placeholder get from auth
        shared: true //add a shared setting to this later.
    });

    // have to add a new deck to the category


    const categoryRef = doc(db, 'category', categoryID);
    const categoryDoc = await getDoc(categoryRef);
    const categoryData = categoryDoc.data();
    var flashcardList = categoryData.flashcardList;
    flashcardList.push(deckName);
    updateDoc(categoryRef, {
        flashcardList: flashcardList,
    });


    // manipualted selectedFlashcards to get ids
    console.log(selectedFlashcards);


    // await setDoc(doc(db, 'flashcardList', deckName), {
    //     name: deckName,
    //     flashcardList: selectedFlashcards
    // });
    


    navigation.navigate('Category');
  }


  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter deck name"
        value={deckName}
        onChangeText={setDeckName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Submit" onPress={() => {handleSubmission()}} />
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelection(item.id)}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: selectedFlashcards.includes(item.id) ? 'lightblue' : 'white' }}>
              <Text style={{ flex: 1 }}>{item.word}</Text>
              <Text style={{ flex: 1 }}>{item.translation}</Text>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: selectedFlashcards.includes(item.id) ? 'green' : 'gray',
                  backgroundColor: selectedFlashcards.includes(item.id) ? 'green' : 'white',
                }}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default FlashcardAdd;
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native-web';
import { Box, Center, Container, Heading, Icon, Text, VStack, HStack, Modal, View, ScrollView, Checkbox} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native-web';
import { useState } from 'react';
import app, {db} from '../backend/database/Firebase';
import { collection, doc, getDocs, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import CategoryModal from './CategoryModal';
// list of categories use api


var index = 0;
var titleList = ["Categories", "Decks"]
var decks = []
var categories = [];
var alldecks = [];
var curCategory = '';
const FlashcardCategory = () => {
  const navigation = useNavigation();
  const [display, setDisplay] = useState([]);

async function getCategories(db) {
    const categoryCol = collection(db, 'category');
    const categorySnapshot = await getDocs(categoryCol);
  
    const categoryList = categorySnapshot.docs.map(doc => doc.data());
    
    return categoryList;
  }
async function getFlashcardList(db) {
    const flashcardCol = collection(db, 'flashcardList');
    const flashcardSnapshot = await getDocs(flashcardCol);

    const flashcardList = flashcardSnapshot.docs.map(doc => doc.data());

    return flashcardList;
  }
const handleBackPress = () => {
  index = 0;
  setDisplay(categories);
  curCategory = '';
};


async function getFlashcardsforCategory(db, category) {
  const categoryRef = doc(db, 'category', category);
  const categoryDoc = await getDoc(categoryRef);
  const categoryData = categoryDoc.data();
  const flashcardList = categoryData.flashcardList;
  const flashcards = [];

  for (const flashcard of flashcardList) {
    const flashcardRef = doc(db, 'flashcard', flashcard);
    const flashcardDoc = await getDoc(flashcardRef);
    const flashcardData = flashcardDoc.data();
    flashcards.push(flashcardData);
  }

  return flashcards;
}


  useEffect(() => {

    // update api here
      
    getCategories(db).then((categoryList) => {
      categories = categoryList;
      console.log(categories);
      setDisplay(categoryList);
    
    }).catch((error) => {
      console.error("Error fetching categories: ", error);
    });

    getFlashcardList(db).then((flashcardList) => {
      alldecks = flashcardList;
    }
    ).catch((error) => {
      console.error("Error fetching flashcardList: ", error);
    });

  }, []
  );
  const handleCategoryPress = async (category, navigation) => {

    // for flascard lists/decks
  
    if (index == 0) {
      console.log(category)
      var flashcardList = category.flashcardList;
      console.log(flashcardList)
      decks = []
      curCategory = category.name;
    for (const flashcard of flashcardList) {
      // get flashcardlist
      const docRef = doc(db, 'flashcardList', flashcard);
  
      // Await the document snapshot
      const ref = await getDoc(docRef);
    
      // populate with flashcardLIst
      decks.push(ref.data());
      
      
      
      index = 1;
    }
    setDisplay(decks);
    return;
    }
  
  
    console.log(index);
    var cardList = [];
    
  
    // update API here
    var flashCardList = category.cardList;
    console.log(flashCardList)
  
    for (const card of flashCardList) {
      console.log(card);
  
      // Reference to the document
        // Assuming the flashcardData has a cardList array
    
      const cardRef = doc(db, 'flashcard', card);
      const cardDoc = await getDoc(cardRef);
  
        if (cardDoc.exists()) {
          const cardData = cardDoc.data();
          cardList.push({
            word: cardData.destination,
            translation: cardData.origin
          });
        }
      }
    
    navigation.navigate('Flashcard', { cardList });
  };

  const CategoryBox = ({ category, navigation }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Pressable
        style={[styles.categoryBox, isPressed && styles.categoryBoxPressed]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => handleCategoryPress(category, navigation)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Text style={styles.categoryText}>{category.name}</Text>
        {isHovered && index === 1 && (
          <HStack style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleUpdateDeck(category)}>
              <Icon as={MaterialIcons} name="edit" size="sm" color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteDeck(category)}>
              <Icon as={MaterialIcons} name="delete" size="sm" color="red" />
            </TouchableOpacity>
          </HStack>
        )}
      </Pressable>
    );
  }
  
  const AddBox = ({  }) => {
        
    
    const [isPressed, setIsPressed] = useState(false);
    
    
    const addFlashcard = () => {
      console.log(curCategory)
      navigation.navigate('FlashcardAdd', { curCategory });
    };
    
    return (
      <Pressable
        style={[styles.addBox, isPressed && styles.categoryBoxPressed]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => addFlashcard()}
      >
        <Text style={styles.categoryText}>Add</Text>
      </Pressable>
        
    );
    
  }
  

 
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Center>
        <Container style={styles.container}>
          <HStack style={styles.headingBox}>
          <Heading style={styles.heading}>{titleList[index]}</Heading>
            {index === 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon as={Ionicons} name="arrow-back" size="lg" color="#000000" />
            </TouchableOpacity>
              )}
          </HStack>
          
           
        
          <VStack style={styles.grid}>
            {display.map((category, index) => (
              <CategoryBox key={index} category={category} navigation={navigation} />
            ))}
            {index === 1 && (<AddBox />)}
          </VStack>
        </Container>
      </Center>
      
    
      
    </SafeAreaView>
  );
};








const styles = StyleSheet.create({
  popupcontainer: {
    flex: 1,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  actionButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  addBox: {
    minWidth: "48%",
    width: "48%",
    borderStyle: 'dashed',

    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },

  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  categoryBox: {
    minWidth: "48%",
    width: "48%",

    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  categoryBoxPressed: {
    transform: [{ translateY: -5 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryText: {
    color: 'black',
    marginTop: 8,
  },
  headingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  openModalButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  openModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FlashcardCategory;

import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native-web';
import { Box, Center, Container, Heading, Icon, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native-web';
import { useState } from 'react';
import app, {db} from '../backend/database/Firebase';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
// list of categories use api




const FlashcardCategory = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {

    // update api here
      async function getCategories(db) {
      const categoryCol = collection(db, 'category');
      const categorySnapshot = await getDocs(categoryCol);
      console.log(categorySnapshot)
      const categoryList = categorySnapshot.docs.map(doc => doc.data());
      console.log(categoryList[0])
      return categoryList;
    }
    getCategories(db).then((categoryList) => {
      setCategories(categoryList);
    }).catch((error) => {
      console.error("Error fetching categories: ", error);
    });

  }, []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Center>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Categories</Heading>
          <VStack style={styles.grid}>
            {categories.map((category, index) => (
              <CategoryBox key={index} category={category} navigation={navigation} />
            ))}
          </VStack>
        </Container>
      </Center>
    </SafeAreaView>
  );

const handleBackPress = () => {
  index = 0;
  setDisplay(categories);
};

const handleCategoryPress = async (category, navigation) => {

  // for flascard lists/decks

  if (index == 0) {
    var flashcardList = category.flashcardList;
    decks = []
  for (const flashcard of flashcardList) {
    // get flashcardlist
    const docRef = doc(db, 'flashcardList', flashcard);

    // Await the document snapshot
    const ref = await getDoc(docRef);
    console.log(ref.data());
  
    // populate with flashcardLIst
    decks.push(ref.data());

    setDisplay(decks);
    index = 1;
  }
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

const handleCategoryPress = async (category, navigation) => {
  var cardList = [];
  console.log(category);

  // update API here
  var flashcardList = category.flashcardList;

  for (const flashcard of flashcardList) {
    console.log(flashcard);

    // Reference to the document
    const docRef = doc(db, 'flashcardList', flashcard);

    // Await the document snapshot
    const ref = await getDoc(docRef);
    console.log(ref.data());

    if (ref.exists()) {
      const flashcardData = ref.data();

      // Assuming the flashcardData has a cardList array
      for (const card of flashcardData.cardList) {
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
    }
  }
  navigation.navigate('Flashcard', { cardList });
};

const CategoryBox = ({ category, index, navigation }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    // add additional onClick events to transition to FlashcardScreen with the correct cards.
    return (
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => handleCategoryPress(category, navigation)}
        style={isPressed ? [styles.categoryBox, styles.categoryBoxPressed] : styles.categoryBox}
      >
        <Box key={index} alignItems="center">
          <Icon as={MaterialIcons} name={category.icon} size="lg" color="black" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </Box>
      </Pressable>
    );
  };

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
          </VStack>
        </Container>
      </Center>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
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
});

export default FlashcardCategory;

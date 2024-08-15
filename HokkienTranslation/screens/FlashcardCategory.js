import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native-web";
import {
  Box,
  Center,
  Container,
  Heading,
  Icon,
  Text,
  VStack,
  HStack,
  Modal,
  View,
  ScrollView,
  Checkbox,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native-web";
import { useState } from "react";
import { useTheme } from "./context/ThemeProvider";
import app, { db } from "../backend/database/Firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import CategoryModal from "./CategoryModal";
import getCurrentUser from "../backend/database/GetCurrentUser";
// list of categories use api

var index = 0;
var titleList = ["Categories", "Decks"];
var decks = [];
var categories = [];
var alldecks = [];
var curCategory = "";
var currentUser = "";
var deckID = "";

const FlashcardCategory = () => {
  const navigation = useNavigation();
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  const [display, setDisplay] = useState([]);

  // check for auth when getting categories
  async function getCategories(db) {
    const categoryCol = collection(db, "category");
    const categorySnapshot = await getDocs(categoryCol);

    const categoryList = categorySnapshot.docs.map((doc) => doc.data());

    return categoryList;
  }

  // check for auth when getting flashcardList
  async function getFlashcardList(db) {
    const flashcardCol = collection(db, "flashcardList");
    const flashcardSnapshot = await getDocs(flashcardCol);

    const flashcardList = flashcardSnapshot.docs.map((doc) => doc.data());

    flashcardList.forEach((deck) => {
      if (deck.createdBy !== currentUser && !deck.shared) {
        flashcardList.splice(flashcardList.indexOf(deck), 1);
      }
    });

    return flashcardList;
  }
  const handleBackPress = () => {
    index = 0;
    setDisplay(categories);
    curCategory = "";
  };

  async function getFlashcardsforCategory(db, category) {
    const categoryRef = doc(db, "category", category);
    const categoryDoc = await getDoc(categoryRef);
    const categoryData = categoryDoc.data();
    const flashcardList = categoryData.flashcardList;
    const flashcards = [];

    for (const flashcard of flashcardList) {
      const flashcardRef = doc(db, "flashcard", flashcard);
      const flashcardDoc = await getDoc(flashcardRef);
      const flashcardData = flashcardDoc.data();
      flashcards.push(flashcardData);
    }

    return flashcards;
  }
  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      currentUser = user;
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  useEffect(() => {
    // update api here
    // getCurrentUser().then((user) => {
    //   currentUser = user;
    // });

    getCategories(db)
      .then((categoryList) => {
        categories = categoryList;
        console.log("Categories: ", categories);
        setDisplay(categoryList);
      })
      .catch((error) => {
        console.error("Error fetching categories: ", error);
      });

    getFlashcardList(db)
      .then((flashcardList) => {
        alldecks = flashcardList;
      })
      .catch((error) => {
        console.error("Error fetching flashcardList: ", error);
      });
  }, []);


  const handleCategoryPress = async (category, navigation) => {
    // for flashcard lists/decks
    if (currentUser === "") {
      fetchUser();
    }

    if (index == 0) {
      console.log("Current Category: ", category);
      var flashcardList = category.flashcardList;
      console.log("List of FlashcardList: ", flashcardList);
      decks = [];
      curCategory = category.name;
      for (const flashcard of flashcardList) {
        // get flashcardlist
        const docRef = doc(db, "flashcardList", flashcard);

        // Await the document snapshot
        const ref = await getDoc(docRef);

        deckID = ref.id;
        // console.log(ref.data())

        //////////////////////////////// auth checking here!11!!!!!!!!!!!!!!!!!!!!!!
        var temp = ref.data();
        // console.log(temp)

        if (temp.createdBy === currentUser || temp.shared) {
          decks.push(ref.data());
        }

        index = 1;
      }
      setDisplay(decks);
      return;
    }

    // console.log(index);
    var cardList = [];

    // update API here
    var flashCardList = category.cardList;
    console.log("List of Flashcards: ", flashCardList);

    for (const card of flashCardList) {
      // console.log(card);

      // Reference to the document
      // Assuming the flashcardData has a cardList array

      const cardRef = doc(db, "flashcard", card);
      const cardDoc = await getDoc(cardRef);

      // TODO: check for auth
      if (cardDoc.exists()) {
        const cardData = cardDoc.data();
        cardList.push({
          word: cardData.destination,
          translation: cardData.origin,
        });
      }
    }
    
    var deckName = category.name;
    console.log("DeckName: ", deckName);
    navigation.navigate("Flashcard", { cardList, deckName });
  };
  

  const CategoryBox = ({ category, navigation }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { themes, theme } = useTheme();
    const colors = themes[theme];

    const handleUpdateDeck = async (category) => {
      var deckName = category.name;
      var selectedFlashcards = category.cardList;
      var shared = category.shared;

      var update = true;
      navigation.navigate("FlashcardAdd", {
        deckName,
        selectedFlashcards,
        shared,
        curCategory,
        currentUser,
        update,
      });
    };
    const handleDeleteDeck = async (category) => {
      const categoryRef = doc(db, "flashcardList", category.name);

      // get category data
      const categoryDoc = await getDoc(categoryRef);
      const categoryData = categoryDoc.data();
      var categoryId = categoryData.categoryID;

      await deleteDoc(categoryRef);

      // remove deck from category
      const categoryRef2 = doc(db, "category", categoryId);
      const categoryDoc2 = await getDoc(categoryRef2);
      const categoryData2 = categoryDoc2.data();
      var flashcardList = categoryData2.flashcardList;
      flashcardList.splice(flashcardList.indexOf(category.name), 1);

      // update caategory
      await updateDoc(categoryRef2, {
        flashcardList: flashcardList,
      });

      getCategories(db)
        .then((categoryList) => {
          categories = categoryList;
          console.log("Categories: ", categories);
          setDisplay(categoryList);
        })
        .catch((error) => {
          console.error("Error fetching categories: ", error);
        });
      index = 0;
    };
    return (
      <Pressable
        style={[styles.categoryBox, isPressed && styles.categoryBoxPressed]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => handleCategoryPress(category, navigation)}
        style={[
          isPressed
            ? [styles.categoryBox, styles.categoryBoxPressed]
            : styles.categoryBox,
          { backgroundColor: colors.categoriesButton },
        ]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <VStack space={1} alignItems="center">
      	<Ionicons name={category.icon} size={30} color={colors.onPrimary} />
      	<Text style={styles.categoryText}>
  			{category.name}
		</Text>
	  </VStack>
        { index === 1 && (
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
  };

  const AddBox = ({}) => {
    const [isPressed, setIsPressed] = useState(false);

    const addFlashcard = () => {
      console.log("Current curCategory: ", curCategory);
      navigation.navigate("FlashcardAdd", { curCategory, currentUser });
    };

    return (
      <Pressable
        style={[
          styles.addBox,
          isPressed && styles.categoryBoxPressed,
          { backgroundColor: colors.categoriesBox },
        ]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => addFlashcard()}
      >
        <Ionicons name="add" size={30} color={colors.onPrimary} />
        <Text style={styles.categoryText}>Add</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.surface }]}
    >
      <Center>
        <Container
          style={[
            styles.container,
            { backgroundColor: colors.categoriesContainer },
          ]}
        >
          <HStack style={styles.headingBox}>
            <Heading style={[styles.heading, { color: colors.onSurface }]}>
              {" "}
              {titleList[index]}{" "}
            </Heading>
            {index === 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
              >
                <Icon
                  as={Ionicons}
                  name="arrow-back"
                  size="lg"
                  color="#000000"
                />
              </TouchableOpacity>
            )}
          </HStack>

          <VStack style={styles.grid}>
            {display.map((category, index) => (
              <CategoryBox
                key={index}
                category={category}
                navigation={navigation}
              />
            ))}
            {index === 1 && <AddBox />}
          </VStack>
        </Container>
      </Center>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  popupcontainer: {
    flex: 1,
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  actionButtons: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textInput: {
    width: "100%",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  addBox: {
    minWidth: "48%",
    width: "48%",
    borderStyle: "dashed",

    alignItems: "center",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },

  container: {
    width: "90%",
    maxWidth: 480,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {},
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    minWidth: "100%",
  },
  categoryBox: {
    minWidth: "48%",
    width: "48%",
    minHeight: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: "relative",
    textAlignVertical: "center",
  },
  categoryBoxPressed: {
    transform: [{ translateY: -5 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryText: {
    color: "black",
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%", // Ensure the text takes up the full width of the box
    lineHeight: 20,
  },
  headingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  openModalButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  openModalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default FlashcardCategory;

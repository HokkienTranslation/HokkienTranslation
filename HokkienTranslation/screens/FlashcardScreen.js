import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Text,
  Center,
  VStack,
  HStack,
  Pressable,
  Input,
  Select,
  Modal,
  Button,
} from "native-base";
import { TouchableOpacity, Animated, PanResponder } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, collection, serverTimestamp, query, where, getDocs, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../backend/database/Firebase";
import CrudButtons from "./components/ScreenCrudButtons";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { callOpenAIChat } from "../backend/API/OpenAIChatService";

const FlashcardScreen = ({ route, navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const { languages } = useLanguage();
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isMin, setIsMin] = useState(true);
  const [isMax, setIsMax] = useState(false);
  const [isPressedLeft, setIsPressedLeft] = useState(false);
  const [isPressedRight, setIsPressedRight] = useState(false);

  const [showNewFlashcard, setShowNewFlashcard] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [enteredWord, setEnteredWord] = useState("");
  const [enteredTranslation, setEnteredTranslation] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [type, setType] = useState("");

  const flashcardListId = route.params.flashcardListId || "";
  const categoryId = route.params.categoryId || "";

  const [deckID, setDeckID] = useState("");

  const flashcardListName = route.params.deckName || "";
  const currentUser = route.params.currentUser;
  const [flashcards, setFlashcards] = useState(route.params.cardList || []);
  const [translatedText, setTranslatedText] = useState("");
  const translateText = async (text, language) => {
    try {
      const response = await callOpenAIChat(
        `Translate ${text} to ${language}. You must respond with only the translation.`
      );
      console.log("OpenAI Response:", response);
      return response;
    } catch (error) {
      console.error("Error:", error);
      return "Error with translation.";
    }
  };

  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (
          gestureState.dx > 120 ||
          gestureState.dx < -120 ||
          gestureState.dy > 120 ||
          gestureState.dy < -120
        ) {
          handleNext(gestureState);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getDeckIDByName = async (deckName) => { //function to query deck id by name
    const deckCollection = collection(db, "flashcardList");
    const q = query(deckCollection, where("name", "==", deckName));
    const querySnapshot = await getDocs(q);
        
    const deckDoc = querySnapshot.docs[0];
    const deckID = deckDoc.id;
    console.log("Deck ID:", deckID);
    console.log("Current category in FlashcardScreen is:", categoryId);
    console.log("Current deck is:", flashcardListName);
    return deckID;    
  };

  useEffect(() => {
    const fetchDeckID = async () => {
      const id = await getDeckIDByName(flashcardListName);
      if (id) {
        setDeckID(id);
      }
    };

    fetchDeckID();
  }, [flashcardListName]);

  const fetchFlashcardsByDeck = async (deckName) => {
    try {
      const deckCollection = collection(db, "flashcardList");
      const deckQuery = query(deckCollection, where("name", "==", deckName));
      const querySnapshot = await getDocs(deckQuery);

      if (!querySnapshot.empty) {
        const deckDoc = querySnapshot.docs[0];
        const flashcardIDs = deckDoc.data().cardList || [];

        // Fetch flashcards by their IDs
        const flashcardCollection = collection(db, "flashcard");
        const flashcardQuery = query(
          flashcardCollection,
          where("__name__", "in", flashcardIDs)
        );
        const flashcardSnapshot = await getDocs(flashcardQuery);

        const flashcardsWithIDs = flashcardSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Flashcards with IDs:", flashcardsWithIDs);
        setFlashcards(flashcardsWithIDs);
      } else {
        console.log("Deck not found.");
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  useEffect(() => {
    if (flashcardListName) {
      fetchFlashcardsByDeck(flashcardListName);
    }
  }, [flashcardListName]);

  useEffect(() => {
    // Log the currently displayed flashcard whenever the currentCardIndex changes
    if (flashcards.length > 0) {
      console.log("Current flashcard data: ", flashcards[currentCardIndex]);
    }
  }, [currentCardIndex, flashcards]);

  const handleNext = (gestureState = null) => {
    const value = {
      x: gestureState?.dx > 0 ? 500 : -500,
      y: gestureState?.dy > 0 ? 500 : -500,
    };
    Animated.timing(position, {
      toValue: value,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % flashcards.length;
        setIsMin(newIndex === 0);
        setIsMax(newIndex === flashcards.length - 1);
        return newIndex;
      });
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleBack = () => {
    setShowTranslation(false);
    setCurrentCardIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + flashcards.length) % flashcards.length;
      setIsMin(newIndex === 0);
      setIsMax(false);
      return newIndex;
    });
    position.setValue({ x: -500, y: -500 });
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 500,
      useNativeDriver: true,
    }).start(() => {});
  };

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleCreate = async () => {
  try {
    if (!enteredWord || !enteredTranslation || !type) {
      alert("Please fill out all required fields");
      return;
    }

    console.log("Current user is ", currentUser);
    console.log("Current categoryId is ", categoryId);
    console.log("Current deckID is ", deckID);

    const newFlashcardData = {
      origin: enteredWord,
      destination: enteredTranslation,
      otherOptions: [option1, option2, option3],
      type: type,
      categoryId: categoryId,
      createdAt: serverTimestamp(),
      createdBy: currentUser,
    };

    const flashcardRef = doc(collection(db, "flashcard"));
    console.log("FlashcardRef", flashcardRef);
    await setDoc(flashcardRef, newFlashcardData);

    const newFlashcardID = flashcardRef.id;
    console.log("Flashcard created successfully with ID:", newFlashcardID);

    const flashcardListRef = doc(db, "flashcardList", deckID);
    await updateDoc(flashcardListRef, {
      cardList: arrayUnion(newFlashcardID)
    });

    console.log("New flashcard ID added to cardList in flashcardList document");

    setEnteredWord("");
    setEnteredTranslation("");
    setOption1("");
    setOption2("");
    setOption3("");
    setType("");
    setShowNewFlashcard(false);
    setFlashcards((prev) => [
      ...prev,
      newFlashcardData,
    ]);
  } catch (error) {
    console.error("Error creating flashcard:", error.message);
    alert(`Failed to create flashcard: ${error.message}`);
  }
};

  useEffect(() => {
    const generateFlashcards = async (languages) => {
      const [lang1, lang2] = languages;

      return Promise.all(
        flashcards.map(async (flashcard) => {
          let word = flashcard.destination;
          let translation = flashcard.origin;

          // logic to reduce the need of translating to English or Chinese (Simplified)
          // will need to be changed for Hokkien
          if (lang1 === "Chinese (Simplified)") {
            word = translation;
          }
          if (lang2 === "English") {
            translation = word;
          }

          if (lang1 !== "English" && lang1 !== "Chinese (Simplified)") {
            word = await translateText(word, lang1);
          }
          if (lang2 !== "English" && lang2 !== "Chinese (Simplified)") {
            translation = await translateText(translation, lang2);
          }
          return {
            ...flashcard,
            word,
            translation,
          };
        })
      );
    };

    generateFlashcards(languages).then(setFlashcards);
  }, [languages]);

  return (
    <Box flex={1} background={colors.surface}>
      <NavigationButtons
        colors={colors}
        flashcardListName={flashcardListName}
      />
      <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
          <HStack space={4}>
            <CrudButtons 
              title="Create" 
              onPress={() => setShowNewFlashcard(true)}
              iconName="add"
            />
            <CrudButtons
              title="Update"
              onPress={() => setShowUpdates(true)}
              iconName="pencil"
            />
            <CrudButtons
              title="Delete"
              onPress={() => setShowConfirmDelete(true)}
              iconName="trash"
            />
          </HStack>

          <Box
            position="absolute"
            top="74px"
            width="299px"
            height="199px"
            bg={colors.darkerPrimaryContainer}
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            shadow={1}
            zIndex={-1}
          >
            <Text fontSize="2xl" color={colors.onSurface}>
              {flashcards[(currentCardIndex + 1) % flashcards.length].word}
            </Text>
          </Box>

          <TouchableOpacity onPress={handleFlip} accessibilityLabel="Flip Card">
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                position.getLayout(),
                {
                  transform: [
                    {
                      rotate: position.x.interpolate({
                        inputRange: [-500, 0, 500],
                        outputRange: ["-10deg", "0deg", "10deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Box
                width="300px"
                height="200px"
                bg={colors.primaryContainer}
                alignItems="center"
                justifyContent="center"
                borderRadius="10px"
                shadow={2}
              >
                <Text fontSize="2xl" color={colors.onSurface}>
                  {showTranslation
                    ? flashcards[currentCardIndex].translation
                    : flashcards[currentCardIndex].word}
                </Text>
              </Box>
            </Animated.View>
          </TouchableOpacity>

          <HStack space={4} alignItems="center">
            <Pressable
              borderRadius="50"
              onPressIn={() => setIsPressedLeft(true)}
              onPressOut={() => setIsPressedLeft(false)}
              onPress={handleBack}
              disabled={isMin}
            >
              <Ionicons
                name={
                  isPressedLeft
                    ? "chevron-back-circle"
                    : "chevron-back-circle-outline"
                }
                color={isMin ? "grey" : colors.onSurface}
                size={50}
              />
            </Pressable>
            <Text fontSize="lg" color={colors.onSurface}>
              {currentCardIndex + 1}/{flashcards.length}
            </Text>
            <Pressable
              borderRadius="50"
              onPressIn={() => setIsPressedRight(true)}
              onPressOut={() => setIsPressedRight(false)}
              onPress={handleNext}
              disabled={isMax}
            >
              <Ionicons
                name={
                  isPressedRight
                    ? "chevron-forward-circle"
                    : "chevron-forward-circle-outline"
                }
                color={isMax ? "grey" : colors.onSurface}
                size={50}
              />
            </Pressable>
          </HStack>
        </VStack>
        {/* create pop up */}
        <Modal
          isOpen={showNewFlashcard}
          onClose={() => setShowNewFlashcard(false)}
          size="lg"
        >
          <Modal.Content width="80%" maxWidth="350px">
            <Modal.CloseButton />
            <Modal.Header>Create new flashcard</Modal.Header>
            <Modal.Body>
              <VStack space={4}>
                <Input
                  placeholder="Enter word"
                  value={enteredWord}
                  onChangeText={setEnteredWord}
                />
                <Input
                  placeholder="Enter Translation"
                  value={enteredTranslation}
                  onChangeText={setEnteredTranslation}
                />
                <Input
                  placeholder="Option 1"
                  value={option1}
                  onChangeText={setOption1}
                />
                <Input
                  placeholder="Option 2"
                  value={option2}
                  onChangeText={setOption2}
                />
                <Input
                  placeholder="Option 3"
                  value={option3}
                  onChangeText={setOption3}
                />
                <Select
                  selectedValue={type}
                  placeholder="Select Type"
                  onValueChange={(itemValue) => setType(itemValue)}
                >
                  <Select.Item label="Word" value="word" />
                  <Select.Item label="Sentence" value="sentence" />
                </Select>
                
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <HStack space={2}>
                <Button onPress={handleCreate}>Save</Button>
                <Button onPress={() => setShowNewFlashcard(false)} variant="ghost">Cancel</Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* update and delete modals */}
         <Modal
          isOpen={showUpdates}
          onClose={() => setShowUpdates(false)}
          size="lg"
        >
          <Modal.Content width="80%" maxWidth="350px">
            <Modal.CloseButton />
            <Modal.Header>Update Flashcard</Modal.Header>
            <Modal.Body>
              <VStack space={4}>
              <Input
                  placeholder={flashcards[currentCardIndex].destination}
                  value={enteredWord}
                  onChangeText={setEnteredWord}
                />
                <Input
                  placeholder={flashcards[currentCardIndex].origin}
                  value={enteredTranslation}
                  onChangeText={setEnteredTranslation}
                />
                <Input
                  placeholder="Option 1 (leave blank to keep unchanged)"
                  value={option1}
                  onChangeText={setOption1}
                />
                <Input
                  placeholder="Option 2 (leave blank to keep unchanged)"
                  value={option2}
                  onChangeText={setOption2}
                />
                <Input
                  placeholder="Option 3 (leave blank to keep unchanged)"
                  value={option3}
                  onChangeText={setOption3}
                />
                <Select
                  selectedValue={type}
                  placeholder="Select Type"
                  onValueChange={(itemValue) => setType(itemValue)}
                >
                  <Select.Item label="Word" value="word" />
                  <Select.Item label="Sentence" value="sentence" />
                </Select>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <HStack space={2}>
                <Button onPress={() => setShowUpdates(false)}>Save</Button>
                <Button onPress={() => setShowUpdates(false)} variant="ghost">
                  Cancel
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </Box>
  );
};

export default FlashcardScreen;

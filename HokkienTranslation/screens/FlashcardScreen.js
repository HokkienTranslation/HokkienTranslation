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
  Switch,
} from "native-base";
import { TouchableOpacity, Animated, PanResponder } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, collection, serverTimestamp, query, where, getDoc, getDocs, arrayUnion, updateDoc, deleteDoc, arrayRemove  } from "firebase/firestore";
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
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

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
    if (flashcards.length > 0) {
      console.log("Current flashcard ID: ", flashcards[currentCardIndex].id);
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
      setFlashcards((prevFlashcards) => [
        ...prevFlashcards,
        {
          id: newFlashcardID,
          origin: enteredWord,
          destination: enteredTranslation,
          otherOptions: [option1, option2, option3],
          type: type,
          createdAt: new Date().toISOString(),
          createdBy: currentUser,
          word: enteredTranslation,
          translation: enteredWord,
        },
    ]);
  } catch (error) {
    console.error("Error creating flashcard:", error.message);
    alert(`Failed to create flashcard: ${error.message}`);
  }
};

  const handleUpdate = async () => {
    const flashcardID = flashcards[currentCardIndex].id;
  
    if (!enteredWord || !enteredTranslation || !type) {
      alert("Please fill out all required fields");
      return;
    }
  
    const flashcardRef = doc(db, "flashcard", flashcardID);
    await updateDoc(flashcardRef, {
      origin: enteredWord,
      destination: enteredTranslation,
      otherOptions: [option1, option2, option3],
      type: type,
      updatedAt: serverTimestamp(),
    });
  
    // locally update
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((flashcard, index) =>
        index === currentCardIndex
          ? {
              ...flashcard,
              origin: enteredWord,
              destination: enteredTranslation,
              otherOptions: [option1, option2, option3],
              type: type,
              word: enteredTranslation,
              translation: enteredWord,
            }
          : flashcard
      )
    );
    setShowUpdates(false);
  };

  const handleDelete = async () => {
    try {
      const flashcardID = flashcards[currentCardIndex]?.id;
  
      if (!flashcardID) {
        throw new Error("Flashcard ID not found");
      }
  
      // Step 1: Remove the flashcard locally
      setFlashcards((prevFlashcards) =>
        prevFlashcards.filter((_, index) => index !== currentCardIndex)
      );
  
      // Step 2: Remove the flashcard ID from the cardList in the current deck
      const flashcardListRef = doc(db, "flashcardList", deckID);
      await updateDoc(flashcardListRef, {
        cardList: arrayRemove(flashcardID),
      });
  
      console.log(`Flashcard ${flashcardID} removed from the current deck`);
  
      // Close the modal and adjust the current card index
      setShowConfirmDelete(false);
      setCurrentCardIndex((prevIndex) => {
        if (prevIndex === flashcards.length - 1 && prevIndex !== 0) {
          return prevIndex - 1;
        }
        return prevIndex;
      });
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert(`Failed to delete flashcard: ${error.message}`);
    }
  };

  const handlePermaDelete = async () => {
    const flashcardId = flashcards[currentCardIndex]?.id;
    if (!flashcardId) {
      throw new Error("No flashcard ID found");
    }
  
    setFlashcards((prevFlashcards) =>
      prevFlashcards.filter((_, index) => index !== currentCardIndex)
    );

    const flashcardRef = doc(db, "flashcard", flashcardId);
    await deleteDoc(flashcardRef);
    console.log("Flashcard deleted from flashcard collection");
  
    const flashcardListRef = doc(db, "flashcardList", deckID); //remove from current deck
    await updateDoc(flashcardListRef, {
      cardList: arrayRemove(flashcardId),
    });
    console.log("Flashcard ID removed from current deck's cardList");
  
    const categoriesCollectionRef = collection(db, "category");
    const categorySnapshot = await getDocs(categoriesCollectionRef);
  
    for (const categoryDoc of categorySnapshot.docs) {
      const categoryData = categoryDoc.data();
      const flashcardListNames = categoryData.flashcardList;
  
      if (Array.isArray(flashcardListNames) && flashcardListNames.length > 0) {
        for (const flashcardListName of flashcardListNames) {
          // Check if decks contain this flashcard ID
          const flashcardListRef = doc(db, "flashcardList", flashcardListName);
          const flashcardListDoc = await getDoc(flashcardListRef);
  
          if (flashcardListDoc.exists()) {
            const flashcardListData = flashcardListDoc.data();
  
            // remove if cardlist has the flashcard
            if (flashcardListData.cardList.includes(flashcardId)) {
              const updatedCardList = flashcardListData.cardList.filter((id) => id !== flashcardId);
  
              await updateDoc(flashcardListRef, {
                cardList: updatedCardList,
              });
              console.log(`Flashcard ID removed from deck: ${flashcardListName} in category: ${categoryDoc.id}`);
            }
          }
        }
      }
    }
  
    setShowConfirmDelete(false);
    console.log("Flashcard successfully deleted from all relevant decks across categories");
  };

  useEffect(() => {
  const fetchAndGenerateFlashcards = async () => {
    try {
      const deckCollection = collection(db, "flashcardList");
      const deckQuery = query(deckCollection, where("name", "==", flashcardListName));
      const querySnapshot = await getDocs(deckQuery);

      if (!querySnapshot.empty) {
        const deckDoc = querySnapshot.docs[0];
        const flashcardIDs = deckDoc.data().cardList || [];

        // fetch by ID
        const flashcardCollection = collection(db, "flashcard");
        const flashcardQuery = query(
          flashcardCollection,
          where("__name__", "in", flashcardIDs)
        );
        const flashcardSnapshot = await getDocs(flashcardQuery);

        let fetchedFlashcards = flashcardSnapshot.docs.map((doc) => ({ //add ID to flashcards
          id: doc.id,
          ...doc.data(),
        }));

        const processedFlashcards = await Promise.all(
          fetchedFlashcards.map(async (flashcard) => {
          let word = flashcard.destination;
          let translation = flashcard.origin;

            if (languages[0] === "Chinese (Simplified)") {
            word = translation;
          }
            if (languages[1] === "English") {
            translation = word;
          }

            if (languages[0] !== "English" && languages[0] !== "Chinese (Simplified)") {
              word = await translateText(word, languages[0]);
          }
            if (languages[1] !== "English" && languages[1] !== "Chinese (Simplified)") {
              translation = await translateText(translation, languages[1]);
          }

          return {
            ...flashcard,
            word,
            translation,
          };
        })
      );

        setFlashcards(processedFlashcards);
      } else {
        console.log("Deck not found.");
      }
    } catch (error) {
      console.error("Error fetching or generating flashcards:", error);
    }
  };

  if (flashcardListName) {
    fetchAndGenerateFlashcards();
  }
}, [flashcardListName, languages]);

useEffect(() => { //prefill fields
  if (showUpdates && flashcards.length > 0) {
    const currentFlashcard = flashcards[currentCardIndex];
    setEnteredWord(currentFlashcard.origin);
    setEnteredTranslation(currentFlashcard.destination);
    setOption1(currentFlashcard.otherOptions[0] || "");
    setOption2(currentFlashcard.otherOptions[1] || "");
    setOption3(currentFlashcard.otherOptions[2] || "");
    setType(currentFlashcard.type || "word");
  }
}, [showUpdates, currentCardIndex, flashcards]);

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
                <Button onPress={() => setShowNewFlashcard(false)} variant="ghost" borderWidth={1} borderColor="coolGray.200">Cancel</Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* update modal */}
         <Modal
          isOpen={showUpdates}
          onClose={() => setShowUpdates(false)}
          size="lg"
        >
          <Modal.Content width="80%" maxWidth="350px">
            <Modal.CloseButton />
            <Modal.Header>Update Flashcard</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <HStack space={2} alignItems="center">
                  <Text width="100px">Word:</Text>
              <Input
                    flex={1}                       // Ensures the input takes up remaining space
                  value={enteredWord}
                  onChangeText={setEnteredWord}
                    textAlign="left"               // Ensures left-aligned text
                />
                </HStack>
                <HStack space={2} alignItems="center">
                  <Text width="100px">Translation:</Text>
                <Input
                    flex={1}
                  value={enteredTranslation}
                  onChangeText={setEnteredTranslation}
                    textAlign="left"
                />
                </HStack>
                <HStack space={2} alignItems="center">
                  <Text width="100px">Option 1:</Text>
                <Input
                    flex={1}
                  value={option1}
                  onChangeText={setOption1}
                    textAlign="left"
                />
                </HStack>
                <HStack space={2} alignItems="center">
                  <Text width="100px">Option 2:</Text>
                <Input
                    flex={1}
                  value={option2}
                  onChangeText={setOption2}
                    textAlign="left"
                />
                </HStack>
                <HStack space={2} alignItems="center">
                  <Text width="100px">Option 3:</Text>
                <Input
                    flex={1}
                  value={option3}
                  onChangeText={setOption3}
                    textAlign="left"
                />
                </HStack>
                <HStack space={2} alignItems="center">
                  <Text width="100px">Type:</Text>
                <Select
                    flex={1}
                  selectedValue={type}
                  placeholder="Select Type"
                  onValueChange={(itemValue) => setType(itemValue)}
                >
                  <Select.Item label="Word" value="word" />
                  <Select.Item label="Sentence" value="sentence" />
                </Select>
                </HStack>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <HStack space={2}>
                <Button onPress={handleUpdate}>Save</Button>
                <Button onPress={() => setShowUpdates(false)} variant="ghost" borderWidth={1} borderColor="coolGray.200">
                  Cancel
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* delete modal */}
        <Modal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          size="lg"
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Body>
              <Text size>Are you sure you want to delete this flashcard from this deck?</Text>
              <HStack space={2} alignItems="center" marginTop={4}>
          <Switch
            isChecked={isPermanentDelete}
            onToggle={() => setIsPermanentDelete(!isPermanentDelete)}
                  size="sm"
          />
                <Text fontSize="sm">
                  Delete flashcard permanently
                </Text>
        </HStack>
            </Modal.Body>
            <Modal.Footer>
              <HStack space={4}>
                  <Button
                  onPress={isPermanentDelete ? handlePermaDelete : handleDelete}
                    colorScheme="red"
          borderWidth={1}
                  borderColor="red.500"
                  >
                    Yes
                  </Button>
                  <Button
                    variant="ghost"
                  onPress={() => setShowConfirmDelete(false)}
          borderWidth={1}
                  borderColor="coolGray.200"
                  >
                    No
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

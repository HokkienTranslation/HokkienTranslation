import React, { useState, useRef, useEffect } from "react";
import {Box, Text, Center, VStack, HStack, Pressable, Input, Select,
  Modal, Button, ScrollView, Tooltip } from "native-base";
import { TouchableOpacity, Animated, PanResponder } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {doc, setDoc, collection, serverTimestamp, query, where, getDoc, getDocs, 
  arrayUnion, updateDoc, deleteDoc, arrayRemove, } from "firebase/firestore";
import { db } from "../backend/database/Firebase";
import CrudButtons from "./components/ScreenCrudButtons";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import DeleteFlashcardModal from "./CRUD flashcard modals/DeleteFlashcardModal";
import FlashcardFormModal from "./CRUD flashcard modals/FlashcardFormModal";
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { callOpenAIChat } from "../backend/API/OpenAIChatService";
import TextToSpeech from "./components/TextToSpeech";
import { fetchTranslation } from "../backend/API/HokkienTranslationToolService";
import { fetchNumericTones, fetchAudioBlob } from "../backend/API/TextToSpeechService";
import { uploadAudioFromBlob } from "../backend/database/UploadtoDatabase";

const FlashcardScreen = ({ route, navigation }) => {
  // Theme and Language
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const { languages } = useLanguage();

  // Route Params
  const flashcardListId = route.params.flashcardListId || "";
  const categoryId = route.params.categoryId || "";
  const createdBy = route.params.createdBy || "";
  const flashcardListName = route.params.deckName || "";
  const currentUser = route.params.currentUser;

  // Flashcards
  const [flashcards, setFlashcards] = useState(route.params.cardList || []);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [deckID, setDeckID] = useState("");
  //  const [translatedText, setTranslatedText] = useState("");

  // UI Interactions
  const [showNewFlashcard, setShowNewFlashcard] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isPressedLeft, setIsPressedLeft] = useState(false);
  const [isPressedRight, setIsPressedRight] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(createdBy === "starter_words");
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const position = useRef(new Animated.ValueXY()).current;
  // const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  // Form Inputs
  const [enteredWord, setEnteredWord] = useState("");
  const [enteredTranslation, setEnteredTranslation] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [type, setType] = useState("");
  

  const translateText = async (text, language) => {
    try {
      const response = await callOpenAIChat(
        `Translate ${text} to ${language}. You must respond with only the translation.`
      );
      return response;
    } catch (error) {
      console.error("Error with translation:", error);
      setErrorMessage("Error with translation. Please try again later.");
      return "Error with translation.";
    }
  };

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

  const getDeckIDByName = async (deckName) => {
    try {
      const deckCollection = collection(db, "flashcardList");
      const q = query(deckCollection, where("name", "==", deckName));
      const querySnapshot = await getDocs(q);

      const deckDoc = querySnapshot.docs[0];
      const deckID = deckDoc.id;
      return deckID;
    } catch (error) {
      console.error("Error getting deck ID:", error);
      setErrorMessage("Error getting deck ID. Please try again later.");
      return "Error getting deck ID.";
    }
  };

  useEffect(() => {
    const fetchDeckID = async () => {
      try {
        const id = await getDeckIDByName(flashcardListName);
        if (id) {
          setDeckID(id);
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Error fetching deck ID. Please try again later.");
        return "Error fetching deck ID.";
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

        // console.log("Flashcards with IDs:", flashcardsWithIDs);
        setFlashcards(flashcardsWithIDs);
      } else {
        console.log("Deck not found.");
      }
    } catch (error) {
      console.error("Error fetching flashcards with deck name: ", deckName, "; Error message: ", error.message);
      setErrorMessage("Error fetching flashcards. Please try again later");
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

  useEffect(() => {
    console.log("Current flashcard index:", currentCardIndex);
    console.log("Flashcards array length:", flashcards.length);

    position.setValue({ x: 0, y: 0 });
  }, [currentCardIndex, flashcards]);

  useEffect(() => {
    if (tooltipOpen) {
      const timer = setTimeout(() => setTooltipOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [tooltipOpen]);

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
        return newIndex;
      });
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleBack = () => {
    setShowTranslation(false);
    setCurrentCardIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + flashcards.length) % flashcards.length;
      return newIndex;
    });
    position.setValue({ x: -500, y: -500 });
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 500,
      useNativeDriver: true,
    }).start(() => { });
  };

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleSoftRefresh = () => {
    navigation.replace("FlashcardScreen", {
      flashcardListId: flashcardListId,
      deckName: flashcardListName,
      currentUser: currentUser,
      cardList: flashcards,
      categoryId: categoryId,
    });
  };

  const handleCreate = async () => {
    try {
      if (!enteredWord || !enteredTranslation || !type) {
        alert("Please fill out all required fields");
        return;
      }

      const romanization = await fetchNumericTones(enteredWord);
      const audioBlob = await fetchAudioBlob(romanization);
      const audioUrl = await uploadAudioFromBlob(romanization, audioBlob);

      const newFlashcardData = {
        origin: enteredWord,
        destination: enteredTranslation,
        otherOptions: [option1, option2, option3],
        type: type,
        categoryId: categoryId,
        createdAt: serverTimestamp(),
        createdBy: currentUser,
        romanization: romanization,
        audioUrl: audioUrl,
      };

      const flashcardRef = doc(collection(db, "flashcard"));
      await setDoc(flashcardRef, newFlashcardData);
      const newFlashcardID = flashcardRef.id;

      const flashcardListRef = doc(db, "flashcardList", deckID);
      await updateDoc(flashcardListRef, {
        cardList: arrayUnion(newFlashcardID),
      });

      console.log(
        "New flashcard ID added to cardList in flashcardList document"
      );

      let word = newFlashcardData.destination;
      let translation = newFlashcardData.origin;

      if (languages[0] === "Hokkien") {
        word = newFlashcardData.origin;
      }
      if (languages[1] === "English") {
        translation = newFlashcardData.destination;
      }
      if (languages[0] !== "English" && languages[0] !== "Hokkien") {
        word = await translateText(newFlashcardData.destination, languages[0]);
      }
      if (languages[1] !== "English" && languages[1] !== "Hokkien") {
        translation = await translateText(newFlashcardData.destination, languages[1]);
      }

      const updatedFlashcards = [
        ...flashcards,
        {
          id: newFlashcardID,
          origin: enteredWord,
          destination: enteredTranslation,
          otherOptions: [option1, option2, option3],
          type: type,
          createdAt: new Date().toISOString(),
          createdBy: currentUser,
          word: word,
          translation: translation,
          romanization: romanization,
          audioUrl: audioUrl,
        },
      ];

      setFlashcards(updatedFlashcards);
      const updatedLength = updatedFlashcards.length;
      console.log("Updated flashcards length:", updatedLength);

      setEnteredWord("");
      setEnteredTranslation("");
      setOption1("");
      setOption2("");
      setOption3("");
      setType("");
      setShowNewFlashcard(false);

      handleSoftRefresh();
    } catch (error) {
      console.error("Error creating flashcard:", error.message);
      setErrorMessage("Error creating flashcard. Please try again later.");
    } finally {
      setShowNewFlashcard(false);
    }
  };

  const handleUpdate = async () => {
    try {
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
    } catch (error) {
      console.error("Error updating flashcard:", error.message);
      setErrorMessage("Error updating flashcard. Please try again later.");
    } finally {
      setShowUpdates(false);
    }
  };

  const handlePermaDelete = async () => {
    setDisableDeleteButton(true);

    setCurrentCardIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : 0; // doesn't go below 0
      return newIndex;
    });

    const flashcardId = flashcards[currentCardIndex]?.id;
    if (!flashcardId) {
      throw new Error("No flashcard ID found");
    }
    try {
      setFlashcards((prevFlashcards) => {
        const updatedFlashcards = prevFlashcards.filter(
          (_, index) => index !== currentCardIndex
        );
        return updatedFlashcards;
      });
      const flashcardRef = doc(db, "flashcard", flashcardId);
      const flashcardDoc = await getDoc(flashcardRef);
      const flashcardData = flashcardDoc.data();

      if (flashcardData.createdBy === currentUser) {
        await deleteDoc(flashcardRef);
        console.log("Flashcard deleted from flashcard collection");
      };

      const flashcardListRef = doc(db, "flashcardList", deckID);
      const flashcardListDoc = await getDoc(flashcardListRef);
      const flashcardListData = flashcardListDoc.data();

      if (flashcardListData.createdBy === currentUser) {
        await updateDoc(flashcardListRef, {
          cardList: arrayRemove(flashcardId),
        });
        console.log("Flashcard ID removed from current deck's cardList");
      };

      const categoriesCollectionRef = collection(db, "category");
      const categorySnapshot = await getDocs(categoriesCollectionRef);

      for (const categoryDoc of categorySnapshot.docs) {
        const categoryData = categoryDoc.data();
        const flashcardListNames = categoryData.flashcardList;

        if (
          Array.isArray(flashcardListNames) &&
          flashcardListNames.length > 0
        ) {
          for (const flashcardListName of flashcardListNames) {
            const flashcardListRef = doc(
              db,
              "flashcardList",
              flashcardListName
            );
            const flashcardListDoc = await getDoc(flashcardListRef);

            if (flashcardListDoc.exists()) {
              const flashcardListData = flashcardListDoc.data();

              if (flashcardListData.cardList.includes(flashcardId) && flashcardListData.createdBy === currentUser) {
                const updatedCardList = flashcardListData.cardList.filter(
                  (id) => id !== flashcardId
                );

                await updateDoc(flashcardListRef, {
                  cardList: updatedCardList,
                });
                console.log(
                  `Flashcard ID removed from deck: ${flashcardListName} in category: ${categoryDoc.id}`
                );
              }
            }
          }
        }
      }
      console.log(
        "Flashcard successfully deleted from all relevant decks across categories"
      );
      handleSoftRefresh();
    } catch (error) {
      console.error("Error deleting flashcard:", error.message);
      setErrorMessage("Failed to delete flashcard. Please try again later.");
    } finally {
      setShowConfirmDelete(false);
      setDisableDeleteButton(false);
    }
  };

  const generateOptions = async (options) => {
    try {
      const prompt = `Given the word(s): ${options}, provide another word that belongs to the same category. The word must be similar in type but not identical. Respond with only one word and no punctuation.`;
      const response = await callOpenAIChat(prompt);
      // console.log("OpenAI Response:", response);
      return response;
    } catch (error) {
      console.error("Error generating options:", error);
      setErrorMessage("Error generating options. Please try again later.");
      return "Error generating options.";
    }
  };

  const handleAutofill = async () => {
    try {
      const hokkien = await fetchTranslation(enteredTranslation);
      setEnteredWord(hokkien);
      const option1 = await generateOptions(enteredTranslation);
      setOption1(option1);
      const currentWords = `${enteredTranslation}, ${option1}`;
      const option2 = await generateOptions(currentWords);
      setOption2(option2);
      const currentWords2 = `${currentWords}, ${option2}`;
      const option3 = await generateOptions(currentWords2);
      setOption3(option3);
      setType('word');
    } catch (error) {
      console.error("Error with autofill:", error.message);
      setErrorMessage("Error with autofill. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchAndGenerateFlashcards = async () => {
      try {
        const deckCollection = collection(db, "flashcardList");
        const deckQuery = query(
          deckCollection,
          where("name", "==", flashcardListName)
        );
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

          let fetchedFlashcards = flashcardSnapshot.docs.map((doc) => ({
            //add ID to flashcards
            id: doc.id,
            ...doc.data(),
          }));

          const processedFlashcards = await Promise.all(
            fetchedFlashcards.map(async (flashcard) => {
              let word = flashcard.destination;
              let translation = flashcard.origin;

              if (languages[0] === "Hokkien") {
                word = flashcard.origin;
              }
              if (languages[1] === "English") {
                translation = flashcard.destination;
              }

              if (languages[0] !== "English" && languages[0] !== "Hokkien") {
                word = await translateText(flashcard.destination, languages[0]);
              }
              if (languages[1] !== "English" && languages[1] !== "Hokkien") {
                translation = await translateText(flashcard.destination, languages[1]);
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
        setErrorMessage("Error with fetching or generating flashcards. Please try again later.");
      }
    };

    if (flashcardListName) {
      fetchAndGenerateFlashcards();
    }
  }, [flashcardListName, languages]);

  useEffect(() => {
    //prefill fields
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
    <ScrollView style={{ backgroundColor: colors.surface }}>
      <Box flex={1} background={colors.surface}>
        <NavigationButtons
          colors={colors}
          flashcardListName={flashcardListName}
        />

        {errorMessage && (
          <Box
            backgroundColor="red.100"
            borderColor="red.500"
            borderWidth={1}
            p={3}
            mb={3}
            borderRadius="8"
            w="100%"
            alignItems="center"
          >
            <Text color="red.600" fontWeight="bold">
              {errorMessage}
            </Text>
            <Button
              mt={2}
              variant="outline"
              borderColor="red.500"
              _text={{ color: "red.500" }}
              onPress={() => setErrorMessage(null)} // Clear error message
            >
              Dismiss
            </Button>
          </Box>
        )}
        <Center flex={1} px="3">
          <VStack space={4} alignItems="center">
            <Tooltip
              label="You can't modify starter decks"
              placement="top"
              isOpen={tooltipOpen}
              bg={colors.onPrimaryContainer}
            >
              <HStack space={4}>
                <CrudButtons
                  title="Create"
                  onPress={() => setShowNewFlashcard(true)}
                  iconName="add"
                  isDisabled={createdBy === "starter_words"}
                />
                <CrudButtons
                  title="Update"
                  onPress={() => setShowUpdates(true)}
                  iconName="pencil"
                  isDisabled={createdBy === "starter_words"}
                />
                <CrudButtons
                  title="Delete"
                  onPress={() => setShowConfirmDelete(true)}
                  iconName="trash"
                  isDisabled={createdBy === "starter_words"}
                />
              </HStack>
            </Tooltip>

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
                  {showTranslation ? (
                    <>
                      <Text fontSize="2xl" color={colors.onSurface}>
                        {flashcards[currentCardIndex]?.translation}
                      </Text>
                      {languages[1] === "Hokkien" && (
                        <TextToSpeech prompt={flashcards[currentCardIndex].translation} type={'flashcard'} />
                      )}
                    </>
                  ) : (
                    <>
                      <Text fontSize="2xl" color={colors.onSurface}>
                        {flashcards[currentCardIndex]?.word}
                      </Text>
                      {languages[0] === "Hokkien" && (
                        <TextToSpeech prompt={flashcards[currentCardIndex].word} type={'flashcard'} />
                      )}
                    </>
                  )}
                </Box>
              </Animated.View>
            </TouchableOpacity>

            <HStack space={4} alignItems="center">
              <Pressable
                borderRadius="50"
                onPressIn={() => setIsPressedLeft(true)}
                onPressOut={() => setIsPressedLeft(false)}
                onPress={handleBack}
              >
                <Ionicons
                  name={
                    isPressedLeft
                      ? "chevron-back-circle"
                      : "chevron-back-circle-outline"
                  }
                  color={colors.onSurface}
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
              >
                <Ionicons
                  name={
                    isPressedRight
                      ? "chevron-forward-circle"
                      : "chevron-forward-circle-outline"
                  }
                  color={colors.onSurface}
                  size={50}
                />
              </Pressable>
            </HStack>
          </VStack>
          
          <FlashcardFormModal // CREATE MODAL
            isOpen={showNewFlashcard}
            onClose={() => setShowNewFlashcard(false)}
            mode="create"
            values={{
              enteredWord,
              enteredTranslation,
              option1,
              option2,
              option3,
              type,
            }}
            setters={{
              setEnteredWord,
              setEnteredTranslation,
              setOption1,
              setOption2,
              setOption3,
              setType,
            }}
            onSubmit={handleCreate}
            onAutofill={handleAutofill}
          />
          <FlashcardFormModal // UPDATE MODAL
            isOpen={showUpdates}
            onClose={() => setShowUpdates(false)}
            mode="update"
            values={{
              enteredWord,
              enteredTranslation,
              option1,
              option2,
              option3,
              type,
            }}
            setters={{
              setEnteredWord,
              setEnteredTranslation,
              setOption1,
              setOption2,
              setOption3,
              setType,
            }}
            onSubmit={handleUpdate}
          />
          <DeleteFlashcardModal
            isOpen={showConfirmDelete}
            onClose={() => setShowConfirmDelete(false)}
            onDelete={handlePermaDelete}
            word={flashcards[currentCardIndex].word}
            translation={flashcards[currentCardIndex].translation}
          />
        </Center>
      </Box>
    </ScrollView>
  );
};

export default FlashcardScreen;

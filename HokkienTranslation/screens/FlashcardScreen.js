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
  Image,
  useBreakpointValue,
  IconButton,
  ScrollView,
  Switch,
} from "native-base";
import { TouchableOpacity, Animated, PanResponder, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDoc,
  getDocs,
  arrayUnion,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../backend/database/Firebase";
import CrudButtons from "./components/ScreenCrudButtons";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";
import { useComponentVisibility } from "./context/ComponentVisibilityContext";
import { useLanguage } from "./context/LanguageProvider";
import { callOpenAIChat } from "../backend/API/OpenAIChatService";
import TextToSpeech from "./components/TextToSpeech";
import  getContextSentence  from "./components/contextSentence";
import { generateImage } from "../backend/API/TextToImageService";
import * as Clipboard from "expo-clipboard";

const FlashcardScreen = ({ route, navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const { languages } = useLanguage();
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
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

  // For responsive flashcards 
  const direction = useBreakpointValue({
    base: 'column',  
    md: 'row',   
  });
  const { height, width } = Dimensions.get("window");
  const cardWidth = width * 0.90;
  //width <= 414 ? width * 0.90 : width * 0.90;
  //const cardHeight = height * 0.60; 

  // Visability
  const { flashcardVisibilityStates } = useComponentVisibility(); 
  const shouldShowVStack =  // left side back card 
  flashcardVisibilityStates.definition ||
  flashcardVisibilityStates.englishDefinition ||
  flashcardVisibilityStates.hokkienSentence ||
  flashcardVisibilityStates.chineseSentence ||
  flashcardVisibilityStates.englishSentence;

  const copyToClipboard = (text) => Clipboard.setString(text);

  const [deckID, setDeckID] = useState("");

  const flashcardListName = route.params.deckName || "";
  const currentUser = route.params.currentUser;
  const [flashcards, setFlashcards] = useState(route.params.cardList || []);
  const [translatedText, setTranslatedText] = useState("");
  //const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);

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

  const getDeckIDByName = async (deckName) => {
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

  useEffect(() => {
    console.log("Current flashcard index:", currentCardIndex);
    console.log("Flashcards array length:", flashcards.length);

    position.setValue({ x: 0, y: 0 });
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
    }).start(() => {});
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

      console.log("Current user is ", currentUser);
      console.log("Current categoryId is ", categoryId);
      console.log("Current deckID is ", deckID);
      var word = enteredWord;
      console.log(enteredWord);
      var contextSentence = await getContextSentence(word={word});
      var image;
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
      downloadURL = await processImage(contextSentence, currentUser, enteredWord);
      if (downloadURL === null) {
        console.log("Error, download URL is null");
      }
      console.log(downloadURL)
      const newFlashcardData = {
        origin: enteredWord,
        contextSentence: contextSentence,
        iamgeURL: downloadURL,
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
        cardList: arrayUnion(newFlashcardID),
      });

      console.log(
        "New flashcard ID added to cardList in flashcardList document"
      );

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
          word: enteredTranslation,
          translation: enteredWord,
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
      await deleteDoc(flashcardRef);
      console.log("Flashcard deleted from flashcard collection");

      const flashcardListRef = doc(db, "flashcardList", deckID);
      await updateDoc(flashcardListRef, {
        cardList: arrayRemove(flashcardId),
      });
      console.log("Flashcard ID removed from current deck's cardList");

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

              if (flashcardListData.cardList.includes(flashcardId)) {
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
      alert(`Failed to delete flashcard: ${error.message}`);
    } finally {
      setShowConfirmDelete(false);
      setDisableDeleteButton(false);
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
              top="75px"
              width = "auto"
              maxWidth = {cardWidth}
              //{{ base: '100%', md: '50%' }}
              minWidth="300px"
              height= "auto"
              //{{ base: 'auto', md: '50%' }}
              minHeight="199px"
              //maxHeight="400px"
              bg={colors.darkerPrimaryContainer}
              alignItems="center"
              justifyContent="center"
              borderRadius="10px"
              shadow={1}
              p={4}
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
                
                  width= "auto"
                  maxWidth = {cardWidth}
                  minWidth="300px"
                  height= "auto"
                  //{{ base: 'auto', md: '50%' }}
                  minHeight="200px"
                  //maxHeight="400px"
                  bg={colors.primaryContainer}
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="10px"
                  shadow={2}
                  p = {4}
                  px={8}
                  spacing={4} 
                >
                  {showTranslation ? (
                    <>
                      <Text fontSize="4xl" fontWeight="bold" color={colors.onSurface}>
                        {flashcards[currentCardIndex].translation}
                      </Text>
                      {languages[1] === "Hokkien" && flashcardVisibilityStates.textToSpeech &&(
                        <TextToSpeech
                          prompt={flashcards[currentCardIndex].translation}
                        />
                      )}
                      <HStack spacing={4} p = {4} direction={direction}>
                        {shouldShowVStack && <VStack alignItems="flex-start" spacing={4} mr={4} width={{ base: '100%', md: '50%' }}>
                          {flashcardVisibilityStates.definition && <Text fontSize="md" fontWeight="bold" color={colors.onSurface}>
                            Definition
                          </Text>}
                          {flashcardVisibilityStates.definition && <Text  fontSize="sm" color={colors.onSurface}>
                            {flashcards[currentCardIndex]?.definition || "1.「啊啊啊啊」"}
                          </Text>}
                          {flashcardVisibilityStates.englishDefinition && <Text fontSize="md" fontWeight="bold" color={colors.onSurface}>
                            English Definition
                          </Text>}
                          {flashcardVisibilityStates.englishDefinition && <Text  fontSize="sm" color={colors.onSurface}>
                            {flashcards[currentCardIndex]?.englishDefinition || "1. Lorem ipsum"}
                          </Text>}
                          {flashcardVisibilityStates.hokkienSentence && <Text fontSize="md" fontWeight="bold" color={colors.onSurface}>
                            Hokkien Example Sentence
                          </Text>}
                          {flashcardVisibilityStates.hokkienSentence && <HStack>
                            <Text  fontSize="sm" color={colors.onSurface}>
                              {flashcards[currentCardIndex]?.hokkienExample || "--啊啊啊啊」啊啊啊啊」啊啊啊啊」啊啊啊啊」"}
                            </Text>
                            <IconButton
                              icon={
                                <Ionicons
                                  name="copy-outline"
                                  size={15}
                                  color={colors.onPrimaryContainer}
                                />
                              }
                              onPress={() => copyToClipboard("this does not work")}
                            />
                          </HStack>}
                          {flashcardVisibilityStates.chineseSentence && <Text fontSize="md" fontWeight="bold" color={colors.onSurface}>
                            Chinese Example Sentence
                          </Text>}
                          {flashcardVisibilityStates.chineseSentence && <HStack>
                            <Text  fontSize="sm" color={colors.onSurface}>
                              {flashcards[currentCardIndex]?.chineseExample || "--这是一个中文的占位符句子。"}
                            </Text>
                            <IconButton
                              icon={
                                <Ionicons
                                  name="copy-outline"
                                  size={15}
                                  color={colors.onPrimaryContainer}
                                />
                              }
                              onPress={() => copyToClipboard("this does not work")}
                            />
                          </HStack>}
                          {flashcardVisibilityStates.englishSentence && <Text fontSize="md" fontWeight="bold" color={colors.onSurface}>
                            English Example Sentence
                          </Text>}
                          {flashcardVisibilityStates.englishSentence && <HStack>
                            <Text  fontSize="sm" color={colors.onSurface}>
                              {flashcards[currentCardIndex]?.englishExample || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                            </Text>
                            <IconButton
                              icon={
                                <Ionicons
                                  name="copy-outline"
                                  size={15}
                                  color={colors.onPrimaryContainer}
                                />
                              }
                              onPress={() => copyToClipboard("this does not work")}
                            />
                          </HStack>}
                        </VStack>}
                        {flashcardVisibilityStates.image && <VStack spacing={4} width={{ base: '100%', md: '50%' }}>
                          <Text fontSize="md" fontWeight="bold" color={colors.onSurface}>
                            Context
                          </Text>
                            {/* <Center> makes spacing overlap*/} 
                            {flashcardVisibilityStates.image && <Box spacing={4} p={4} borderRadius="md">
                                <Image source={require("../assets/temp-image.png")} 
                                       // for size per image use: 
                                       size="2xl"  
                                       // for standarized sizes
                                      // style={{
                                      //   width: 220,
                                      //   height: 220,
                                      // }}
                                       resizeMode="contain"
                                       />
                              </Box>}
                            {/* </Center> */}
                        </VStack>}
                      </HStack>
                    </>
                  ) : (
                    <Center>
                      <Text fontSize="4xl" color={colors.onSurface}>
                        {flashcards[currentCardIndex].word}
                      </Text>
                    </Center>
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
                  <Button onPress={handleCreate}>
                    <HStack space={1} alignItems="center">
                      <Ionicons
                        name={"save-outline"}
                        size={30}
                        color={"#FFFFFF"}
                      />
                      <Text color={"#FFFFFF"}>Save</Text>
                    </HStack>
                  </Button>
                  <Button
                    onPress={() => setShowNewFlashcard(false)}
                    variant="ghost"
                    borderWidth={1}
                    borderColor="coolGray.200"
                  >
                    Cancel
                  </Button>
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
                      flex={1}
                      value={enteredWord}
                      onChangeText={setEnteredWord}
                    />
                  </HStack>
                  <HStack space={2} alignItems="center">
                    <Text width="100px">Translation:</Text>
                    <Input
                      flex={1}
                      value={enteredTranslation}
                      onChangeText={setEnteredTranslation}
                    />
                  </HStack>
                  <HStack space={2} alignItems="center">
                    <Text width="100px">Option 1:</Text>
                    <Input flex={1} value={option1} onChangeText={setOption1} />
                  </HStack>
                  <HStack space={2} alignItems="center">
                    <Text width="100px">Option 2:</Text>
                    <Input flex={1} value={option2} onChangeText={setOption2} />
                  </HStack>
                  <HStack space={2} alignItems="center">
                    <Text width="100px">Option 3:</Text>
                    <Input flex={1} value={option3} onChangeText={setOption3} />
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
                  <Button onPress={handleUpdate}>
                    <HStack space={1} alignItems="center">
                      <Ionicons
                        name={"save-outline"}
                        size={30}
                        color={"#FFFFFF"}
                      />
                      <Text color={"#FFFFFF"}>Save</Text>
                    </HStack>
                  </Button>
                  <Button
                    onPress={() => setShowUpdates(false)}
                    variant="ghost"
                    borderWidth={1}
                    borderColor="coolGray.200"
                  >
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
              <Modal.Header>
                <Text fontSize="xl" fontWeight={"bold"}>
                  Delete Confirmation
                </Text>
              </Modal.Header>
              <Modal.Body>
                <Box
                  backgroundColor={"red.200"}
                  borderWidth={1}
                  borderRadius={4}
                  borderColor={"red.300"}
                  padding={3}
                >
                  <Text color={"red.800"}>
                    Are you sure you want to delete the flashcard '
                    {flashcards[currentCardIndex].word}'?
                  </Text>
                </Box>

                <HStack space={2} alignItems="center" marginTop={4}></HStack>
              </Modal.Body>
              <Modal.Footer>
                <HStack space={4}>
                  <Button
                    variant="ghost"
                    onPress={() => setShowConfirmDelete(false)}
                    borderWidth={1}
                    borderColor="coolGray.200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={handlePermaDelete}
                    colorScheme="red"
                    borderWidth={1}
                    borderColor="red.500"
                    disabled={disableDeleteButton}
                  >
                    Delete
                  </Button>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Center>
      </Box>
    </ScrollView>
  );
};

export default FlashcardScreen;

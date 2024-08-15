import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Center,
  VStack,
  HStack,
  Pressable,
  Input,
  Select,
} from "native-base";

import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Modal, Animated, PanResponder } from "react-native";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import CrudButtons from "./components/ScreenCrudButtons";
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { callOpenAIChat } from "../backend/API/OpenAIChatService";

const FlashcardScreen = ({ route, navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [showNewFlashcard, setShowNewFlashcard] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // const [word, setWord] = useState('');
  // const [translation, setTranslation] = useState('');
  const [type, setType] = useState("");
  const [otherOpt, setOtherOpt] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState(""); // shared
  const [cardList, setCardlist] = useState("");

  const [isPressedLeft, setIsPressedLeft] = useState(false);
  const [isPressedRight, setIsPressedRight] = useState(false);
  const [isMin, setIsMin] = useState(true);
  const [isMax, setIsMax] = useState(false);
  const { languages } = useLanguage();
  const [translatedText, setTranslatedText] = useState("");

  const baseFlashcards = route.params.cardList;
  const flashcardListName = route.params.deckName;

  const [flashcards, setFlashcards] = useState(baseFlashcards);
  console.log("FlashcardScreen flashcards:", flashcards);
  console.log("FlashcardScreen flashcardListName:", flashcardListName);

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

  const handleCreate = () => {
    setShowNewFlashcard(true);
  };

  const handleUpdate = () => {
    // const currentFlashcard = flashcards[currentCardIndex];
    // navigation.navigate('UpdateFlashcard', { flashcard: currentFlashcard });
    setShowUpdates(true);
  };

  const handleDelete = () => {
    setShowConfirmDelete(false);
  };

  useEffect(() => {
    const generateFlashcards = async (languages) => {
      const [lang1, lang2] = languages;

      return Promise.all(
        baseFlashcards.map(async (flashcard) => {
          let word = flashcard.word;
          let translation = flashcard.translation;

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
          return { word, translation };
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
            <CrudButtons title="Create" onPress={handleCreate} iconName="add" />
            <CrudButtons
              title="Update"
              onPress={handleUpdate}
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
          animationType="fade"
          transparent={true}
          visible={showNewFlashcard}
          onRequestClose={() => setShowNewFlashcard(false)}
        >
          <Center
            flex={1}
            justifyContent="center"
            backgroundColor="rgba(0, 0, 0, 0.5)"
          >
            <Box
              width="300px"
              bg="white"
              alignItems="center"
              borderRadius="10px"
              shadow={2}
              padding={4}
            >
              <Text fontSize="lg" marginBottom={4}>
                Create new flashcard:
              </Text>
              <VStack space={4} alignItems="center">
                <Input placeholder="Enter word" width={200} />
                <Input placeholder="Enter Translation" width={200} />
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={otherOpt}
                    placeholder="View Other Options"
                    onValueChange={(itemValue) => setOtherOpt(itemValue)}
                  >
                    <Select.Item label="banana 1" value="word" />
                    <Select.Item label="banana 2" value="sentence" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={type}
                    placeholder="Select Type"
                    onValueChange={(itemValue) => setType(itemValue)}
                  >
                    <Select.Item label="Word" value="word" />
                    <Select.Item label="Sentence" value="sentence" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={category}
                    placeholder="Select Category"
                    onValueChange={(itemValue) => setCategory(itemValue)}
                  >
                    <Select.Item label="Shopping" value="shopping" />
                    <Select.Item label="Other" value="other" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={privacy}
                    placeholder="Set Privacy"
                    onValueChange={(itemValue) => setPrivacy(itemValue)}
                  >
                    <Select.Item label="Public" value="shopping" />
                    <Select.Item label="Private" value="other" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={cardList}
                    placeholder="Select Flashcard List"
                    onValueChange={(itemValue) => setCardlist(itemValue)}
                  >
                    <Select.Item label="list 1" value="shopping" />
                    <Select.Item label="list 2" value="other" />
                  </Select>
                </Box>
                <HStack space={4}>
                  <CrudButtons
                    title="Save"
                    iconName="save"
                    onPress={handleCreate}
                  />
                  <CrudButtons
                    title="Cancel"
                    iconName="close"
                    onPress={() => setShowNewFlashcard(false)}
                  />
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Modal>
        {/* update pop up */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showUpdates}
          onRequestClose={() => setShowUpdates(false)}
        >
          <Center
            flex={1}
            justifyContent="center"
            backgroundColor="rgba(0, 0, 0, 0.5)"
          >
            <Box
              width="300px"
              bg="white"
              alignItems="center"
              justifyContent="center"
              borderRadius="10px"
              shadow={2}
              padding={4}
            >
              <Text fontSize="lg" marginBottom={4}>
                Edit flashcard:
              </Text>
              <Text fontSize="lg" marginBottom={4}>
                Edit flashcard:
              </Text>
              <VStack space={4} alignItems="center">
                <Input
                  placeholder="Enter word"
                  width={200}
                  value={flashcards[currentCardIndex].word}
                />
                <Input
                  placeholder="Enter Translation"
                  width={200}
                  value={flashcards[currentCardIndex].translation}
                />
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={otherOpt}
                    placeholder="View Other Options"
                    onValueChange={(itemValue) => setOtherOpt(itemValue)}
                  >
                    <Select.Item label="banana 1" value="word" />
                    <Select.Item label="banana 2" value="sentence" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={type}
                    placeholder="Select Type"
                    onValueChange={(itemValue) => setType(itemValue)}
                  >
                    <Select.Item label="Word" value="word" />
                    <Select.Item label="Sentence" value="sentence" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={category}
                    placeholder="Select Category"
                    onValueChange={(itemValue) => setCategory(itemValue)}
                  >
                    <Select.Item label="Shopping" value="shopping" />
                    <Select.Item label="Other" value="other" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={privacy}
                    placeholder="Set Privacy"
                    onValueChange={(itemValue) => setPrivacy(itemValue)}
                  >
                    <Select.Item label="Public" value="shopping" />
                    <Select.Item label="Private" value="other" />
                  </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                  <Select
                    selectedValue={cardList}
                    placeholder="Select Flashcard List"
                    onValueChange={(itemValue) => setCardlist(itemValue)}
                  >
                    <Select.Item label="list 1" value="shopping" />
                    <Select.Item label="list 2" value="other" />
                  </Select>
                </Box>
                <HStack space={4}>
                  <CrudButtons
                    title="Save"
                    iconName="save"
                    />
                  <CrudButtons
                    title="Save"
                    iconName="save"
                    onPress={handleUpdate}
                  />
                  <CrudButtons
                    title="Cancel"
                    iconName="close"
                  />
                  <CrudButtons
                    title="Cancel"
                    iconName="close"
                    onPress={() => setShowUpdates(false)}
                  />
                 
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Modal>
        {/* delete pop up */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirmDelete}
          onRequestClose={() => setShowConfirmDelete(false)}
        >
          <Center
            flex={1}
            justifyContent="center"
            backgroundColor="rgba(0, 0, 0, 0.5)"
          >
            <Box
              width="300px"
              height="150px"
              bg="white"
              alignItems="center"
              justifyContent="center"
              borderRadius="10px"
              shadow={2}
              padding={4}
            >
              <Text fontSize="lg" marginBottom={4}>
                Delete this flashcard?
              </Text>
              <HStack space={4}>
                <CrudButtons
                  title="Yes"
                  iconName="checkmark"
                  onPress={handleDelete}
                />
                <CrudButtons
                  title="No"
                  iconName="close"
                  onPress={() => setShowConfirmDelete(false)}
                />
              </HStack>
            </Box>
          </Center>
        </Modal>
      </Center>
    </Box>
  );
};

export default FlashcardScreen;

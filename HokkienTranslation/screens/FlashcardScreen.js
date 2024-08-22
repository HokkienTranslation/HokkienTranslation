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
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { callOpenAIChat } from "../backend/API/OpenAIChatService";


const FlashcardScreen = ({}) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [showNewFlashcard, setShowNewFlashcard] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to store user's role
  const [message, setMessage] = useState(""); // State to store error messages

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

  const baseFlashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const [flashcards, setFlashcards] = useState(baseFlashcards);

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
    if (userRole !== "admin") {
      setMessage("You are not authorized to modify or delete this flashcard list or flashcard.");
      setShowConfirmDelete(false);
      return;
    }
    // Proceed with deletion logic here
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
      <NavigationButtons colors={colors} />
      <Center flex={1} px="3">
        <VStack space={4} alignItems="center">
          <HStack space={4}>
            <Button
              bg={colors.primaryContainer}
              _text={{ color: colors.onPrimary }}
              shadow={2}
              paddingX={4}
              paddingY={2}
              borderRadius="10px"
              onPress={handleCreate}
              _hover={{ bg: colors.darkerPrimaryContainer }}
              _pressed={{ bg: colors.evenDarkerPrimaryContainer }}
            >
              <Center>
                <HStack space={2} alignItems="center">
                  <Ionicons name="add" size={20} color={colors.onPrimary} />
                  <Text>Create</Text>
                </HStack>
              </Center>
            </Button>
            <Button
              bg={colors.primaryContainer}
              _text={{ color: colors.onPrimary }}
              shadow={2}
              paddingX={4}
              paddingY={2}
              borderRadius="10px"
              onPress={handleUpdate}
              _hover={{ bg: colors.darkerPrimaryContainer }}
              _pressed={{ bg: colors.evenDarkerPrimaryContainer }}
            >
              <Center>
                <HStack space={2} alignItems="center">
                  <Ionicons name="pencil" size={20} color={colors.onPrimary} />
                  <Text>Update</Text>
                </HStack>
              </Center>
            </Button>
            <Button
              bg={colors.primaryContainer}
              _text={{ color: colors.onPrimary }}
              shadow={2}
              paddingX={4}
              paddingY={2}
              borderRadius="10px"
              onPress={() => setShowConfirmDelete(true)}
              _hover={{ bg: colors.darkerPrimaryContainer }}
              _pressed={{ bg: colors.evenDarkerPrimaryContainer }}
            >
              <Center>
                <HStack space={2} alignItems="center">
                  <Ionicons name="trash" size={20} color={colors.onPrimary} />
                  <Text>Delete</Text>
                </HStack>
              </Center>
            </Button>
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
                  <Button
                    bg={colors.primaryContainer}
                    _text={{ color: colors.onPrimary }}
                    shadow={2}
                    paddingX={4}
                    paddingY={2}
                    borderRadius="10px"
                    onPress={handleCreate}
                  >
                    Save
                  </Button>
                  <Button
                    bg={colors.primaryContainer}
                    _text={{ color: colors.onPrimary }}
                    shadow={2}
                    paddingX={4}
                    paddingY={2}
                    borderRadius="10px"
                    onPress={() => setShowNewFlashcard(false)}
                  >
                    Cancel
                  </Button>
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
              <VStack space={4} alignItems="center">
                <Text fontSize="lg">Edit flashcard:</Text>
                <Input
                  placeholder="Word"
                  value={flashcards[currentCardIndex].word}
                  // onChangeText={setWord}
                />
                <Input
                  placeholder="Translation"
                  value={flashcards[currentCardIndex].translation}
                  // onChangeText={setTranslation}
                />
                <HStack space={4}>
                  <Button
                    bg={colors.primaryContainer}
                    _text={{ color: colors.onPrimary }}
                    shadow={2}
                    paddingX={4}
                    paddingY={2}
                    borderRadius="10px"
                    onPress={handleUpdate}
                  >
                    Save
                  </Button>
                  <Button
                    bg={colors.primaryContainer}
                    _text={{ color: colors.onPrimary }}
                    shadow={2}
                    paddingX={4}
                    paddingY={2}
                    borderRadius="10px"
                    onPress={() => setShowUpdates(false)}
                  >
                    Cancel
                  </Button>
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
      bg="white"
      alignItems="center"
      justifyContent="center"
      borderRadius="10px"
      shadow={2}
      padding={4}
    >
      {userRole === "admin" ? (
        <>
          <Text fontSize="lg" marginBottom={4}>
            Delete this flashcard?
          </Text>
          <HStack space={4}>
            <Button onPress={handleDelete}>Yes</Button>
            <Button onPress={() => setShowConfirmDelete(false)}>No</Button>
          </HStack>
        </>
      ) : (
        <Text fontSize="lg" color="red.500">
          You are not authorized to modify or delete this flashcardList or flashcard.
        </Text>
      )}
    </Box>
          </Center>
        </Modal>
      </Center>
    </Box>
  );
};

export default FlashcardScreen;

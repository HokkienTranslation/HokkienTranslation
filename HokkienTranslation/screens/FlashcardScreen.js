import React, { useState } from "react";
import { Box, Text, Button, Center, VStack, HStack } from "native-base";
import { TouchableOpacity, Modal } from "react-native";
import FlashcardNavigator from "../screens/components/FlashcardNavigator";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";

const FlashcardScreen = ({ navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleUpdate = () => {
    const currentFlashcard = flashcards[currentCardIndex];
    navigation.navigate('UpdateFlashcard', { flashcard: currentFlashcard });
  };

  const handleDelete = () => {
    // Implement delete functionality here
    setShowConfirmDelete(false);
  };

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
              onPress={() => navigation.navigate('CreateFlashcard')}
              _hover={{ bg: colors.darkerPrimaryContainer }}
              _pressed={{bg: colors.evenDarkerPrimaryContainer}} 
            >
              Create
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
              _pressed={{bg: colors.evenDarkerPrimaryContainer}}
            >
              Update
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
              _pressed={{bg: colors.evenDarkerPrimaryContainer}} 
            >
              Delete
            </Button>
          </HStack>
          <TouchableOpacity onPress={handleFlip} accessibilityLabel="Flip Card">
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
          </TouchableOpacity>
          <FlashcardNavigator
            currentCardIndex={currentCardIndex}
            flashcardsLength={flashcards.length}
            setCurrentCardIndex={setCurrentCardIndex}
            setShowTranslation={setShowTranslation}
          />
        </VStack>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirmDelete}
          onRequestClose={() => setShowConfirmDelete(false)}
        >
          <Center flex={1} justifyContent="center" backgroundColor="rgba(0, 0, 0, 0.5)">
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
                Delete the {flashcards[currentCardIndex].word} flashcard?
              </Text>
              <HStack space={4}>
                <Button onPress={handleDelete}>Yes</Button>
                <Button onPress={() => setShowConfirmDelete(false)}>No</Button>
              </HStack>
            </Box>
          </Center>
        </Modal>
      </Center>
    </Box>
  );
};

export default FlashcardScreen;
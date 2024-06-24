import React, { useState } from "react";
import { Box, Text, Center, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import FlashcardNavigator from "../screens/components/FlashcardNavigator";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";

const FlashcardScreen = () => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <Box flex={1} background={colors.surface}>
      <NavigationButtons colors={colors} />
      <Center flex={1} px="3">
        <VStack space={4} alignItems="center">
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
      </Center>
    </Box>
  );
};

export default FlashcardScreen;
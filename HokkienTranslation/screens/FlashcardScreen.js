import React, { useState } from "react";
import { Box, Text, Button, Center, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

const FlashcardScreen = () => {
  const [showTranslation, setShowTranslation] = useState(false);

  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleNext = () => {
    setShowTranslation(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  return (
    <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
        <TouchableOpacity onPress={handleFlip}>
          <Box
            width="300px"
            height="200px"
            bg="primary.500"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            shadow={2}
          >
            <Text fontSize="2xl" color="white">
              {showTranslation
                ? flashcards[currentCardIndex].translation
                : flashcards[currentCardIndex].word}
            </Text>
          </Box>
        </TouchableOpacity>
        <Button onPress={handleNext}>Next</Button>
      </VStack>
    </Center>
  );
};

export default FlashcardScreen;

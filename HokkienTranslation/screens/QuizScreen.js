import React, { useState } from "react";
import { Box, Button, Center, VStack, HStack, Text } from "native-base";
import { useTheme } from "./context/ThemeProvider";

const QuizScreen = () => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const flashcards = [
    { word: "Apple", choices: ["Banana", "Orange", "Apple", "Grape"] },
    { word: "Banana", choices: ["Peach", "Banana", "Berry", "Melon"] },
    { word: "Cat", choices: ["Dog", "Bird", "Fish", "Cat"] },
    { word: "Dog", choices: ["Cat", "Dog", "Rabbit", "Horse"] },
  ];

  const handleChoice = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  return (
    <Center flex={1} px="3" background={colors.surface}>
      <VStack space={4} alignItems="center">
        <Box
          width="350px" // Adjust width as needed
          height="250px" // Adjust height as needed
          bg={colors.primaryContainer}
          borderRadius="10px"
          shadow={2}
          p={4}
          justifyContent="center" // Center content vertically
        >
          <VStack space={4} alignItems="center" flex={1} justifyContent="center">
            <Text fontSize="2xl" color={colors.onSurface} mb={4}>
              {flashcards[currentCardIndex].word}
            </Text>
            <VStack space={3} width="100%">
              <HStack space={3} width="100%">
                <Button
                  size="lg"
                  colorScheme="secondary"
                  variant="outline"
                  flex={1}
                  onPress={handleChoice}
                >
                  {flashcards[currentCardIndex].choices[0]}
                </Button>
                <Button
                  size="lg"
                  colorScheme="secondary"
                  variant="outline"
                  flex={1}
                  onPress={handleChoice}
                >
                  {flashcards[currentCardIndex].choices[1]}
                </Button>
              </HStack>
              <HStack space={3} width="100%">
                <Button
                  size="lg"
                  colorScheme="secondary"
                  variant="outline"
                  flex={1}
                  onPress={handleChoice}
                >
                  {flashcards[currentCardIndex].choices[2]}
                </Button>
                <Button
                  size="lg"
                  colorScheme="secondary"
                  variant="outline"
                  flex={1}
                  onPress={handleChoice}
                >
                  {flashcards[currentCardIndex].choices[3]}
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
};

export default QuizScreen;

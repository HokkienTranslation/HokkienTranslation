import React, { useState } from "react";
import { Box, Button, Center, VStack, HStack, Text } from "native-base";
import { useTheme } from "./context/ThemeProvider";

const QuizScreen = () => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // TODO: Change the positions of answers to be random
  const flashcards = [
    { word: "Apple", choices: ["Banana", "Orange", "Apple", "Grape"], answer: 2 },
    { word: "Banana", choices: ["Peach", "Banana", "Berry", "Melon"], answer: 1 },
    { word: "Cat", choices: ["Dog", "Bird", "Fish", "Cat"], answer: 3 },
    { word: "Dog", choices: ["Cat", "Dog", "Rabbit", "Horse"], answer: 1 },
  ];

  const handleChoice = (index) => {
    setSelectedAnswer(index);
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 1000);
  };

  const getButtonStyle = (index) => {
    const correctAnswerIndex = flashcards[currentCardIndex].answer;

    if (selectedAnswer === null) {
      return {
        bg: colors.primaryContainer,
        borderColor: colors.buttonBorder
      };
    } else if (selectedAnswer === index) {
      return correctAnswerIndex === index
        ? { bg: 'rgba(39, 201, 36, 0.6)', borderColor: '#27c924' }
        : { bg: 'rgba(186, 34, 39, 0.6)', borderColor: '#ba2227' };
    } else if (selectedAnswer !== correctAnswerIndex && index === correctAnswerIndex) {
      return { bg: 'rgba(39, 201, 36, 0.6)', borderColor: '#27c924' };
    } else {
      return {
        bg: colors.primaryContainer,
        borderColor: colors.buttonBorder
      };
    }
  };

  return (
    <Center flex={1} px="3" background={colors.surface}>
      <VStack space={4} alignItems="center">
        <Box
          width="350px"
          height="250px"
          bg={colors.primaryContainer}
          borderRadius="10px"
          shadow={2}
          p={4}
          justifyContent="center"
        >
          <VStack space={4} alignItems="center" flex={1} justifyContent="center">
            <Text fontSize="2xl" color={colors.onSurface} mb={4}>
              {flashcards[currentCardIndex].word}
            </Text>
            <VStack space={3} width="100%">
              <HStack space={3} width="100%">
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(0)}
                  _hover={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  flex={1}
                  onPress={() => handleChoice(0)}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[0]}</Text>
                </Button>
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(1)}
                  _hover={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  flex={1}
                  onPress={() => handleChoice(1)}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[1]}</Text>
                </Button>
              </HStack>
              <HStack space={3} width="100%">
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(2)}
                  _hover={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  flex={1}
                  onPress={() => handleChoice(2)}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[2]}</Text>
                </Button>
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(3)}
                  _hover={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{ 
                    bg: colors.primaryContainer, 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  flex={1}
                  onPress={() => handleChoice(3)}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[3]}</Text>
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

import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Center, VStack, HStack, Text, Progress } from "native-base";
import { useTheme } from "./context/ThemeProvider";
import { Animated, Easing } from 'react-native';

const QuizScreen = () => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // TODO: Change the positions of answers to be random
  const flashcards = [
    { word: "Apple", choices: ["Banana", "Orange", "Apple", "Grape"], answer: 2 },
    { word: "Banana", choices: ["Peach", "Banana", "Berry", "Melon"], answer: 1 },
    { word: "Cat", choices: ["Dog", "Bird", "Fish", "Cat"], answer: 3 },
    { word: "Dog", choices: ["Cat", "Dog", "Rabbit", "Horse"], answer: 1 },
  ];

  // Timer to move to next question
  const handleChoice = (index) => {
    setSelectedAnswer(index);
    setIsDisabled(true);
    if (index === flashcards[currentCardIndex].answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setTimeout(() => {
      slideOut();
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsDisabled(false);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        slideIn();
      }, 300);
    }, 1000);
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  const slideIn = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
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
        <Text fontSize="lg" color={colors.onSurface}>
          Question {currentCardIndex + 1} of {flashcards.length}
        </Text>
        <Progress 
          value={(currentCardIndex + 1) / flashcards.length * 100} 
          width="90%" 
          colorScheme="green" 
          mb={4}
        />
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <Box
          width="400px"
          height="250px"
          bg={colors.primaryContainer}
          borderRadius="10px"
          shadow={2}
          p={6}
          justifyContent="center"
        >
          <VStack space={10} alignItems="center" flex={1} justifyContent="center">
            <Text fontSize="2xl" color={colors.onSurface} mb={0}>
              {flashcards[currentCardIndex].word}
            </Text>
            <VStack space={5} width="100%">
              <HStack space={9} width="100%">
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(0)}
                  _hover={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _disabled={{
                    opacity: 1,
                  }}
                  flex={1}
                  onPress={() => handleChoice(0)}
                  isDisabled={isDisabled}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[0]}</Text>
                </Button>
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(1)}
                  _hover={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _disabled={{
                    opacity: 1,
                  }}
                  flex={1}
                  onPress={() => handleChoice(1)}
                  isDisabled={isDisabled}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[1]}</Text>
                </Button>
              </HStack>
              <HStack space={9} width="100%">
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(2)}
                  _hover={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _disabled={{
                    opacity: 1,
                  }}
                  flex={1}
                  onPress={() => handleChoice(2)}
                  isDisabled={isDisabled}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[2]}</Text>
                </Button>
                <Button
                  size="lg"
                  colorScheme={colors.onSurface}
                  variant="outline"
                  {...getButtonStyle(3)}
                  _hover={{
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _pressed={{ 
                    borderColor: colors.highlightButtonBorder,
                  }}
                  _disabled={{
                    opacity: 1,
                  }}
                  flex={1}
                  onPress={() => handleChoice(3)}
                  isDisabled={isDisabled}
                >
                  <Text color={colors.onSurface}>{flashcards[currentCardIndex].choices[3]}</Text>
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        </Animated.View>
      </VStack>
      <Text fontSize="lg" color={colors.onSurface} mt={4}>
          Score: {score}
        </Text>
    </Center>
  );
};

export default QuizScreen;
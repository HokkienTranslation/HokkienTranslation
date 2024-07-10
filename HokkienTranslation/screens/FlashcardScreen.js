import React, { useState, useRef } from "react";
import { Box, Text, Center, VStack, HStack, Button } from "native-base";
import { TouchableOpacity, Animated, PanResponder } from "react-native-web";
import FlashcardNavigator from "../screens/components/FlashcardNavigator";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { callOpenAIChat } from "../backend/API/OpenAIChatService";

const FlashcardScreen = ({ route, navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isMin, setIsMin] = useState(true);
  const [isMax, setIsMax] = useState(false);
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState("");

  const flashcards = route.params.cardList;
  console.log(flashcards);

  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx > 120 || gestureState.dx < -120 || 
            gestureState.dy > 120 || gestureState.dy < -120) {
          swipeGesture(gestureState);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
      setIsMin(false);
      setShowTranslation(false);
      if (currentCardIndex === flashcards.length - 2) {
        setIsMax(true);
      }
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prevIndex) => prevIndex - 1);
      setIsMax(false);
      setShowTranslation(false);
      if (currentCardIndex === 1) {
        setIsMin(true);
      }
    }
  };

  const handleUpdate = () => {
    const currentFlashcard = flashcards[currentCardIndex];
    navigation.navigate('UpdateFlashcard', { flashcard: currentFlashcard });
  };

  const handleDelete = () => {
    // Implement delete functionality here
    setShowConfirmDelete(false);
  };

  const swipeGesture = (gestureState = null) => {
  const value = {
    x: gestureState.dx > 0 ? 500 : -500,
    y: gestureState.dy > 0 ? 500 : -500,
  };

  Animated.timing(position, {
    toValue: value,
    duration: 500,
    useNativeDriver: true,
  }).start(() => {
    setShowTranslation(false);
    position.setValue({ x: 0, y: 0 });

    // TODO: Fix bug, where if currentCardIndex reaches end, stop increment (Crash)
    if (currentCardIndex < flashcards.length - 1) {
      handleNext();
    }
    else{
      currentCardIndex = 1
    }
  });
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
              _pressed={{ bg: colors.evenDarkerPrimaryContainer }}
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
              _pressed={{ bg: colors.evenDarkerPrimaryContainer }}
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
              _pressed={{ bg: colors.evenDarkerPrimaryContainer }}
            >
              Delete
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
              style={[position.getLayout(), 
              { transform: [{ rotate: position.x.interpolate({
                inputRange: [-500, 0, 500],
                outputRange: ['-10deg', '0deg', '10deg']
              }) }] }
            ]}>
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
                    ? translatedText
                    : flashcards[currentCardIndex].word}
                </Text>
              </Box>
            </Animated.View>
          </TouchableOpacity>
          <FlashcardNavigator
            currentCardIndex={currentCardIndex}
            flashcardsLength={flashcards.length}
            handleNext={handleNext}
            handleBack={handleBack}
            isMin={isMin}
            isMax={isMax}
          />
        </VStack>
      </Center>
    </Box>
  );
};

export default FlashcardScreen;

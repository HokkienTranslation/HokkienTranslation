import React, { useState, useRef } from "react";
import { Box, Text, Button, Center, VStack, HStack, Pressable } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Modal, Animated, PanResponder } from "react-native";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";

const FlashcardScreen = ({ navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isPressedLeft, setIsPressedLeft] = useState(false);
  const [isPressedRight, setIsPressedRight] = useState(false);
  const [isMin, setIsMin] = useState(true);
  const [isMax, setIsMax] = useState(false);

  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

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
    const value = { x: gestureState?.dx > 0 ? 500 : -500, y: gestureState?.dy > 0 ? 500 : -500 };
    Animated.timing(position, {
      toValue: value,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % flashcards.length;
        setIsMin(false);
        setIsMax(newIndex === flashcards.length - 1);
        return newIndex;
      });
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => {
        const newIndex = (prevIndex - 1 + flashcards.length) % flashcards.length;
        setIsMin(newIndex === 0);
        setIsMax(false);
        return newIndex;
      });
    }
  };

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
                name={isPressedLeft ? "chevron-back-circle" : "chevron-back-circle-outline"}
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
                name={isPressedRight ? "chevron-forward-circle" : "chevron-forward-circle-outline"}
                color={isMax ? "grey" : colors.onSurface}
                size={50}
              />
            </Pressable>
          </HStack>
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

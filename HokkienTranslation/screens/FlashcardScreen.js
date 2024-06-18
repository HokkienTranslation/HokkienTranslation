import React, { useState, useRef } from "react";
import { Box, Text, Button, Center, VStack } from "native-base";
import { TouchableOpacity, Animated, PanResponder } from "react-native";

const FlashcardScreen = () => {
  const [showTranslation, setShowTranslation] = useState(false);

  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx > 120 || gestureState.dx < -120 || gestureState.dy > 120 || gestureState.dy < -120) {
          Animated.timing(position, {
            toValue: { x: gestureState.dx > 0 ? 500 : -500, y: gestureState.dy > 0 ? 500 : -500 },
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setShowTranslation(false);
            setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
            position.setValue({ x: 0, y: 0 });
          });
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
    Animated.timing(position, {
      toValue: { x: 500, y: -500 },
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      position.setValue({ x: 0, y: 0 });
    });
  };
  
  return (
    <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
        <TouchableOpacity onPress={handleFlip}>
          <Animated.View {...panResponder.panHandlers} 
            style={[position.getLayout(), 
            { transform: [{ rotate: position.x.interpolate({
              inputRange: [-500, 0, 500],
              outputRange: ['-10deg', '0deg', '10deg']
            }) }] }
          ]}
          >
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
          </Animated.View>
        </TouchableOpacity>
        <Button onPress={handleNext}>Next</Button>
      </VStack>
    </Center>
  );
};

export default FlashcardScreen;

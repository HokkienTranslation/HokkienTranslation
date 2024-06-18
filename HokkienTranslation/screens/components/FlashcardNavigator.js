import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { HStack, Button, Pressable,  Text } from "native-base";
import { useTheme } from "../context/ThemeProvider";

const FlashcardNavigator = ({ currentCardIndex, flashcardsLength, setCurrentCardIndex, setShowTranslation }) => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];
  const [isPressedLeft, setIsPressedLeft] = useState(false);
  const [isPressedRight, setIsPressedRight] = useState(false);
  const [isMin, setIsMin] = useState(true);
  const [isMax, setIsMax] = useState(false);

  const handleBack = () => { //TODO: Definitely needs optimization
    if(currentCardIndex > 0){
      setIsMin(false);
      setIsMax(false);
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcardsLength) % flashcardsLength);
    }
    if(currentCardIndex == 1){
      setIsMin(true);
    }
  };

  const handleNext = () => { //TODO: Definitely needs optimization
    if(currentCardIndex < flashcardsLength - 1){
      setIsMin(false);
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardsLength);
    }
    if(currentCardIndex == flashcardsLength - 2){
      setIsMax(true)
    }     
  };

  return (
      <HStack space={4} alignItems="center">
        <Pressable
          borderRadius="50"
          onPressIn={() => setIsPressedLeft(true)}
          onPressOut={() => setIsPressedLeft(false)}
          onPress={handleBack}
          >
            <Ionicons
              name={
                  isPressedLeft ? "chevron-back-circle" : "chevron-back-circle-outline"
                  }
              color={
                isMin ? "grey" : ""
              }
              size={50}
              
            />
        </Pressable>
        <Text fontSize="lg" color={colors.onSurface}>
          {currentCardIndex + 1}/{flashcardsLength}
        </Text>
        <Pressable
          borderRadius="50"
          onPressIn={() => setIsPressedRight(true)}
          onPressOut={() => setIsPressedRight(false)}
          onPress={handleNext}
          >
            <Ionicons
              name={
                  isPressedRight ? "chevron-forward-circle" : "chevron-forward-circle-outline"
                  }
              color={
                isMax ? "grey" : ""
              }
              size={50}
              
            />
        </Pressable>
      </HStack>
    );
  };

export default FlashcardNavigator;
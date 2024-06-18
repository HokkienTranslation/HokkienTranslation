import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { HStack, Button, Text } from "native-base";
import { useTheme } from "../context/ThemeProvider";

const FlashcardNavigator = ({ currentCardIndex, flashcardsLength, setCurrentCardIndex, setShowTranslation }) => {
    const { themes, theme } = useTheme();
    const colors = themes[theme];
    const [isPressedLeft, setIsPressedLeft] = useState(false);
    const [isPressedRight, setIsPressedRight] = useState(false);

    const handleBack = () => {
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcardsLength) % flashcardsLength);
    };
  
    const handleNext = () => {
      setShowTranslation(false);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardsLength);
    };

    return (
        <HStack space={4} alignItems="center">
          <Button
            borderRadius="50"
            background={""}
            onPressIn={() => setIsPressedLeft(true)}
            onPressOut={() => setIsPressedLeft(false)}
            onPress={handleBack}
            leftIcon={
              <Ionicons
                name={
                    isPressedLeft ? "chevron-back-circle" : "chevron-back-circle-outline"
                    }
                size={50}
                
              />
            }
          >
          </Button>
          <Text fontSize="lg">
            {currentCardIndex + 1}/{flashcardsLength}
          </Text>
          <Button
            borderRadius="50"
            background={""}
            onPressIn={() => setIsPressedRight(true)}
            onPressOut={() => setIsPressedRight(false)}
            onPress={handleNext}
            rightIcon={
              <Ionicons
              name={
                isPressedRight ? "chevron-forward-circle" : "chevron-forward-circle-outline"
                }
                size={50}
              />
            }
          >
          </Button>
        </HStack>
      );
};

export default FlashcardNavigator;
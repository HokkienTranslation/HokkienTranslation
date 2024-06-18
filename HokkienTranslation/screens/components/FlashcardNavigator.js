import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { HStack, Button, Text } from "native-base";

const FlashcardNavigator = ({ currentCardIndex, flashcardsLength, setCurrentCardIndex, setShowTranslation }) => {

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
            onPress={handleBack}
            leftIcon={
              <Ionicons
                name="chevron-back-circle-outline"
                size={24}
              />
            }
          >
            Back
          </Button>
          <Text fontSize="lg">
            {currentCardIndex + 1}/{flashcardsLength}
          </Text>
          <Button
            onPress={handleNext}
            rightIcon={
              <Ionicons
                name="chevron-forward-circle-outline"
                size={24}
              />
            }
          >
            Next
          </Button>
        </HStack>
      );
};

export default FlashcardNavigator;
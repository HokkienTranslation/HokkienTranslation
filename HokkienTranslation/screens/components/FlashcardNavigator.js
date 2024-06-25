import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { HStack, Pressable, Text } from "native-base";
import { useTheme } from "../context/ThemeProvider";

const FlashcardNavigator = ({ currentCardIndex, flashcardsLength, handleNext, handleBack, isMin, isMax }) => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];
  const [isPressedLeft, setIsPressedLeft] = useState(false);
  const [isPressedRight, setIsPressedRight] = useState(false);

  return (
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
        {currentCardIndex + 1}/{flashcardsLength}
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
  );
};

export default FlashcardNavigator;
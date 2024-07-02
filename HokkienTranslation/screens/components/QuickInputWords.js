import React from "react";
import { Button, Flex, Text } from "native-base";
import { useTheme } from "../context/ThemeProvider";

const QuickInputWords = ({ label, words, onWordPress }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Flex direction="row" wrap="wrap" mt={4}>
      <Text
        fontSize="md"
        fontWeight="bold"
        color={colors.onSurface}
        mr={2}
        alignSelf="center"
      >
        {label}
      </Text>
      {words.map((word, index) => (
        <Button
          key={index}
          onPress={() => onWordPress(word)}
          borderRadius="full"
          backgroundColor={colors.primaryContainer}
          _pressed={{
            backgroundColor: colors.onPrimaryContainer,
            opacity: 0.8,
            _text: {
              color: colors.primaryContainer,
            },
          }}
          _text={{
            color: colors.onPrimaryContainer,
            fontSize: "xs",
            fontWeight: "bold",
          }}
          paddingX={2}
          marginX={1}
          marginY={1}
        >
          {capitalizeFirstLetter(word)}
        </Button>
      ))}
    </Flex>
  );
};

export default QuickInputWords;

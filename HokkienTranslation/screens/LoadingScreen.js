import React, { useState, useEffect, useRef } from "react";
import { Box, Text } from "native-base";
import * as Progress from "react-native-progress";
import { Animated } from "react-native";
import { useTheme } from "./context/ThemeProvider";
import { useWindowDimensions } from 'react-native';

const LoadingScreen = ({ progress }) => {
  const texts = [
    "Hang tight! Magic in progress...",
    "Good things take time, loading your images...",
  ];
  const [loadingText, setLoadingText] = useState(texts[0]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { theme, themes } = useTheme();
  const colors = themes[theme];

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setLoadingText((prevText) =>
        prevText === texts[0] ? texts[1] : texts[0]
      );
      fadeIn();
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fadeOut();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [fadeAnim]);

  
  const window = useWindowDimensions();

  let width = window.width;
  width = Math.min(width * 0.7, 500);

  return (
    <Box
      flex={1}
      paddingTop={'35vh'}
      alignItems="center"
      bg={colors.surface}
      position={'relative'}
    >
      <Progress.Bar
        progress={progress}
        width={width}
        borderRadius={24}
        height={24}
        color={colors.primaryContainer}
      />
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text fontSize="xl" marginTop="3" color={colors.onPrimaryContainer}>
          {loadingText}
        </Text>
      </Animated.View>
    </Box>
  );
};

export default LoadingScreen;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { useTheme } from "./context/ThemeProvider";

const LoadingScreen = ({ progress }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  return (
    <View
        style={{
        margin: "20%",
        justifyContent: "center",
        alignItems: "center",
        }}
    >
      <Progress.Bar progress={progress} width={500} />
      <Text style={{
        fontSize: 20,
        marginTop: "20px",
        color: colors.onSurfaceVariant,
        fontWeight: "bold"
        }}>
          Hold on, the result is loading...
      </Text>
    </View>
  );
};

export default LoadingScreen;
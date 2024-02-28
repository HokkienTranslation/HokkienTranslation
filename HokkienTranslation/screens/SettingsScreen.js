import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../styles/ThemeProvider";

const SettingsScreen = () => {
  const { theme, toggleTheme, themes } = useTheme();
  const colors = themes[theme];

  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        rowGap: 10,
        columnGap: 10,
        flexShrink: 0,
        backgroundColor: colors.surface,
        paddingLeft: 20,
      }}
    >
      {/* Appearance section */}
      <View
        style={{
          marginLeft: 20,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 15,
            marginBottom: 10,
            color: colors.onSurface,
          }}
        >
          Theme
        </Text>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={toggleTheme}
        >
          <Ionicons
            name={theme === "light" ? "radio-button-on" : "radio-button-off"}
            size={24}
            color={colors.onPrimaryContainer}
          />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              color: colors.onSurface,
            }}
          >
            Light
          </Text>
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={toggleTheme}
        >
          <Ionicons
            name={theme === "dark" ? "radio-button-on" : "radio-button-off"}
            size={24}
            color={colors.onPrimaryContainer}
          />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              color: colors.onSurface,
            }}
          >
            Dark
          </Text>
        </Pressable>
      </View>

      {/* TODO: Models section */}
      <View
        style={{
          marginLeft: 20,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 15,
            marginBottom: 10,
            color: colors.onSurface,
          }}
        >
          Model
        </Text>
      </View>

      {/* TODO: Versions section */}
    </View>
  );
};

export default SettingsScreen;

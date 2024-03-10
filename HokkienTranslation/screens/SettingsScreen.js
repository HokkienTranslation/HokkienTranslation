import React from "react";
import { Pressable } from "react-native";
import { Switch, HStack, VStack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./context/ThemeProvider";
import { useComponentVisibility } from "./context/ComponentVisibilityContext";

const SettingsScreen = () => {
  const { theme, toggleTheme, themes } = useTheme();
  const colors = themes[theme];
  const { visibilityStates, toggleVisibility } = useComponentVisibility();

  const ThemeOption = ({ themeName, iconName }) => (
    <Pressable
      onPress={toggleTheme}
      hitSlop={10} //Increase the pressable area
    >
      <HStack space={2} alignItems="center">
        <Ionicons name={iconName} size={24} color={colors.onPrimaryContainer} />
        <Text style={{ fontSize: 16, color: colors.onSurface }}>
          {themeName}
        </Text>
      </HStack>
    </Pressable>
  );

  const VisibilityToggle = ({ label, stateKey }) => (
    <HStack
      p={3}
      bg={colors.primaryContainer}
      borderRadius="lg"
      justifyContent="space-between"
      alignItems={"center"}
    >
      <Text fontSize="md" color={colors.onSurface}>
        {label}
      </Text>
      <Switch
        isChecked={visibilityStates[stateKey]}
        onToggle={() => toggleVisibility(stateKey)}
        onTrackColor={colors.onPrimaryContainer}
        offTrackColor={colors.light}
        onThumbColor={colors.primaryContainer}
        offThumbColor={colors.dark}
      />
    </HStack>
  );

  return (
    <VStack
      style={{
        height: "100%",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: colors.surface,
        padding: 20,
      }}
    >
      <VStack space={4} w="90%" alignSelf="center">
        {/* Appearance section */}
        <VStack space={2}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.onSurface,
            }}
          >
            Theme
          </Text>

          <VStack space={2} alignItems="start">
            <ThemeOption
              themeName="Light"
              iconName={
                theme === "light" ? "radio-button-on" : "radio-button-off"
              }
            />
            <ThemeOption
              themeName="Dark"
              iconName={
                theme === "dark" ? "radio-button-on" : "radio-button-off"
              }
            />
          </VStack>
        </VStack>

        {/* Models section */}
        <VStack space={2}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.onSurface,
            }}
          >
            Display Options
          </Text>
          <VisibilityToggle label="Image" stateKey="image" />
          <VisibilityToggle label="Definition" stateKey="definition" />
          <VisibilityToggle
            label="English Definition"
            stateKey="englishDefinition"
          />
          <VisibilityToggle
            label="Hokkien Sentence"
            stateKey="hokkienSentence"
          />
          <VisibilityToggle
            label="Chinese Sentence"
            stateKey="chineseSentence"
          />
          <VisibilityToggle
            label="English Sentence"
            stateKey="englishSentence"
          />
          <VisibilityToggle label="Pronunciation" stateKey="textToSpeech" />
        </VStack>
      </VStack>
    </VStack>
  );
};

export default SettingsScreen;

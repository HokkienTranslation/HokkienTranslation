import React from "react";
import { Pressable } from "react-native";
import { Switch, HStack, VStack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { useComponentVisibility } from "./context/ComponentVisibilityContext";
import { SelectList } from "react-native-dropdown-select-list";

const SettingsScreen = () => {
  const { theme, toggleTheme, themes } = useTheme();
  const colors = themes[theme];
  const { visibilityStates, toggleVisibility } = useComponentVisibility();
  const { language, setLanguage } = useLanguage();

  const languages = [
    { key: '1', value: "Arabic" },
    { key: '2', value: "Chinese (Simplified)" },
    { key: '3', value: "Chinese (Traditional)" },
    { key: '4', value: "Czech" },
    { key: '5', value: "Danish" },
    { key: '6', value: "Dutch" },
    { key: '7', value: "French" },
    { key: '8', value: "German" },
    { key: '9', value: "Greek" },
    { key: '10', value: "Hindi" },
    { key: '11', value: "Indonesian" },
    { key: '12', value: "Italian" },
    { key: '13', value: "Japanese" },
    { key: '14', value: "Korean" },
    { key: '15', value: "Polish" },
    { key: '16', value: "Portuguese" },
    { key: '17', value: "Russian" },
    { key: '18', value: "Spanish" },
    { key: '19', value: "Turkish" },
    { key: '20', value: "Vietnamese" }
  ];

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

        {/* Language section */}
        <VStack space={2}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.onSurface,
            }}
          >
            Language Options
          </Text>
          <SelectList
            setSelected={(val) => setLanguage(val)}
            data={languages}
            save="value"
            // search={false}
            defaultOption={{ key:'2', value:'Chinese (Simplified)' }}
          />  
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

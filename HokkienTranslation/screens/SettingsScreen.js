import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native"; // Overflow fix
import { Pressable } from "react-native";
import { Switch, HStack, VStack, Text, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./context/ThemeProvider";
import { useLanguage } from "./context/LanguageProvider";
import { useComponentVisibility } from "./context/ComponentVisibilityContext";
import SignOut from "./Signout"; // Adjust the path if necessary
import { SelectList } from "react-native-dropdown-select-list";

const SettingsScreen = () => {
  const { theme, toggleTheme, themes } = useTheme();
  const colors = themes[theme];
  const { visibilityStates, toggleVisibility } = useComponentVisibility();
  const { languages, setLanguages } = useLanguage();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (languages[0] === languages[1]) {
      setErrorMessage('The selected languages must be different.');
    } else {
      setErrorMessage('');
    }
  }, [languages]);

  const languageList = [
    { key: 'Arabic', value: "Arabic" },
    { key: 'Chinese (Simplified)', value: "Chinese (Simplified)" },
    { key: 'Chinese (Traditional)', value: "Chinese (Traditional)" },
    { key: 'Czech', value: "Czech" },
    { key: 'Danish', value: "Danish" },
    { key: 'Dutch', value: "Dutch" },
    { key: 'English', value: "English" },
    { key: 'French', value: "French" },
    { key: 'German', value: "German" },
    { key: 'Greek', value: "Greek" },
    { key: 'Hindi', value: "Hindi" },
    { key: 'Indonesian', value: "Indonesian" },
    { key: 'Italian', value: "Italian" },
    { key: 'Japanese', value: "Japanese" },
    { key: 'Korean', value: "Korean" },
    { key: 'Polish', value: "Polish" },
    { key: 'Portuguese', value: "Portuguese" },
    { key: 'Russian', value: "Russian" },
    { key: 'Spanish', value: "Spanish" },
    { key: 'Turkish', value: "Turkish" },
    { key: 'Vietnamese', value: "Vietnamese" }
  ];

  const ThemeOption = ({ themeName, iconName }) => (
    <Pressable onPress={toggleTheme} hitSlop={10}>
      <HStack space={2} alignItems="center">
        <Ionicons name={iconName} size={24} color={colors.onPrimaryContainer} />
        <Text style={{ fontSize: 16, color: colors.onSurface }}>{themeName}</Text>
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack
        style={{
          flex: 1,
          width: "100%",
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
            <HStack space={2} alignItems="center">
              <Text style={{ marginRight: 10, fontSize: 16 }}>Language 1 (card front):</Text>
              <SelectList
                setSelected={(key) => setLanguages([key, languages[1]])}
                data={languageList}
                save="key"
                defaultOption={{ key:'English', value:'English' }}
              />
            </HStack>
            <HStack space={2} alignItems="center">
              <Text style={{ marginRight: 10, fontSize: 16 }}>Language 2 (card back):</Text>
              <SelectList
                setSelected={(key) => setLanguages([languages[0], key])}
                data={languageList}
                save="key"
                defaultOption={{ key:'Chinese (Simplified)', value:'Chinese (Simplified)' }}
              />
            </HStack>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
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
            <VisibilityToggle label="English Definition" stateKey="englishDefinition" />
            <VisibilityToggle label="Hokkien Sentence" stateKey="hokkienSentence" />
            <VisibilityToggle label="Chinese Sentence" stateKey="chineseSentence" />
            <VisibilityToggle label="English Sentence" stateKey="englishSentence" />
            <VisibilityToggle label="Pronunciation" stateKey="textToSpeech" />
          </VStack>

          {/* Sign Out section */}
          <SignOut />
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default SettingsScreen;

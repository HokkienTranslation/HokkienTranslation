import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Input,
  IconButton,
  ScrollView,
  VStack,
  Button,
  Wrap,
  Flex,
  Text,
} from "native-base";
import { useTheme } from "./context/ThemeProvider";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../backend/database/Firebase";
import QuickInputWords from "./components/QuickInputWords";

export default function HomeScreen({ navigation }) {
  const [queryText, setQueryText] = useState("");
  const [randomInputs, setRandomInputs] = useState([]);
  const { theme, themes } = useTheme();
  const colors = themes[theme];

  const handleTextChange = (text) => {
    const cleanedText = text.replace(/\n/, "");
    setQueryText(cleanedText);
  };

  const fetchRandomInputs = async () => {
    try {
      const translationCollection = collection(db, "translation");
      const querySnapshot = await getDocs(translationCollection);
      const inputs = querySnapshot.docs.map((doc) => doc.data().englishInput);
      setRandomInputs(inputs.sort(() => 0.5 - Math.random()).slice(0, 5));
    } catch (error) {
      console.error("Error fetching random inputs: ", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchRandomInputs();
  }, []);

  return (
    <ScrollView
      bg={colors.surface}
      flex={1}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <VStack space={4} alignItems="center" w="100%" mt={5}>
        {/* Header */}
        <Box
          w="80%"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <IconButton
            icon={
              <Ionicons
                name="settings-outline"
                size={25}
                color={colors.onSurfaceVariant}
              />
            }
            _hover={{ bg: "transparent" }}
            _pressed={{ bg: "transparent" }}
            onPress={() => navigation.navigate("Settings")}
          />
        </Box>

        {/* Random Words and Input Box */}
        <Box w="80%">
          <QuickInputWords
            label="Try:"
            words={randomInputs}
            onWordPress={setQueryText}
          />
          {/* Input */}
          <Box position="relative" mt={3}>
            <Input
              variant="outline"
              placeholder="Type English or Chinese..."
              onChangeText={handleTextChange}
              value={queryText}
              multiline={true}
              h={40}
              paddingX={1}
              paddingY={2}
              style={{
                fontSize: 20,
                color: colors.onSurface,
              }}
            />
            {queryText.length > 0 && (
              <IconButton
                icon={
                  <Ionicons
                    name="close-outline"
                    size={30}
                    color={colors.onSurfaceVariant}
                  />
                }
                position="absolute"
                top={0}
                right={0}
                _hover={{ bg: "transparent" }}
                _pressed={{ bg: "transparent" }}
                onPress={() => setQueryText("")}
              />
            )}
          </Box>
        </Box>

        {/* Submit Button */}
        {queryText.length > 0 && (
          <Box w="80%" flexDirection="row" justifyContent="flex-end">
            <IconButton
              icon={
                <Ionicons
                  name="checkbox"
                  size={40}
                  color={colors.primaryContainer}
                />
              }
              onPress={() =>
                navigation.navigate("Result", { query: queryText })
              }
              _hover={{ bg: "transparent" }}
              _pressed={{ bg: "transparent" }}
            />
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
}

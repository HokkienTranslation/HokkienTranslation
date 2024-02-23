import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Box, Input, IconButton, ScrollView, VStack } from "native-base";
import colors from "../styles/Colors";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");

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

        {/* Input */}
        <Box position="relative" w="80%">
          <Input
            variant="outline"
            placeholder="Type English or Chinese..."
            onChangeText={setQuery}
            value={query}
            multiline={true}
            h={40}
            paddingX={1}
            paddingY={2}
            style={{
              fontSize: 20,
            }}
          />
          {query.length > 0 && (
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
              onPress={() => setQuery("")}
            />
          )}
        </Box>

        {/* Submit Button */}
        {query.length > 0 && (
          <Box w="80%" flexDirection="row" justifyContent="flex-end">
            <IconButton
              icon={
                <Ionicons
                  name="checkbox"
                  size={40}
                  color={colors.primaryContainer}
                />
              }
              onPress={() => navigation.navigate("Result", { query })}
              _hover={{ bg: "transparent" }}
              _pressed={{ bg: "transparent" }}
            />
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
} 

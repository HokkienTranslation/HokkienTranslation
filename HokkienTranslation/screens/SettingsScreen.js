import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../styles/Colors"; // Ensure this path is correct
// Adjust the path as needed

const SettingsScreen = ({ navigation }) => {
  const [appearance, setAppearance] = useState("light");

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
          }}
        >
          Appearance
        </Text>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={() => setAppearance("system")}
        >
          <Ionicons
            name={
              appearance === "system" ? "radio-button-on" : "radio-button-off"
            }
            size={24}
            color={appearance === "system" ? "blue" : "grey"}
          />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
            }}
          >
            System default
          </Text>
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={() => setAppearance("light")}
        >
          <Ionicons
            name={
              appearance === "light" ? "radio-button-on" : "radio-button-off"
            }
            size={24}
            color={appearance === "light" ? "blue" : "grey"}
          />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
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
          onPress={() => setAppearance("dark")}
        >
          <Ionicons
            name={
              appearance === "dark" ? "radio-button-on" : "radio-button-off"
            }
            size={24}
            color={appearance === "dark" ? "blue" : "grey"}
          />
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
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

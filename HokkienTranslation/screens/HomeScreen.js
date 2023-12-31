import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/Colors";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = React.useState("");

  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        rowGap: 10,
        columnGap: 10,
        flexShrink: 0,
        backgroundColor: colors.surface,
      }}
    >
      {/* Header */}
      <View
        style={{
          width: "100%",
          height: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: 20,
          marginRight: 20,
        }}
      >
        {query.length > 0 && (
          <Ionicons
            name="close-outline"
            size={40}
            color={colors.onPrimaryContainer}
            onPress={() => setQuery("")}
          />
        )}

        <Ionicons
          name="settings-outline"
          size={25}
          color={colors.onSurfaceVariant}
          onPress={() => navigation.navigate("Settings")}
        />
      </View>

      {/* Input */}
      <View
        style={{
          width: "80%",
          height: "80%",
        }}
      >
        <TextInput
          style={{
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            marginTop: 20,
            borderColor: colors.onSurfaceVariant,
            borderRadius: 5,
            borderWidth: 1,
            height: "100%",
          }}
          placeholder="Enter Query"
          onChangeText={setQuery}
          value={query}
          multiline={true}
        />
      </View>

      {/* Submit Button */}
      {query.length > 0 && (
        <View
          style={{
            width: "80%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="checkbox"
            size={40}
            color={colors.onPrimaryContainer}
            onPress={() => navigation.navigate("Result", { query })}
          />
        </View>
      )}
    </View>
  );
}

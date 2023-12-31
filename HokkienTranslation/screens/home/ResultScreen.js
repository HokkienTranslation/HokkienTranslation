import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../styles/Colors"; // Ensure this path is correct

const ResultScreen = ({ route, navigation }) => {
  return (
    <ScrollView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        rowGap: 10,
        columnGap: 10,
      }}
    >
      {/* Header */}
      <View
        style={{
          width: "80%",
          height: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 80,
        }}
      >
        <Ionicons
          name="arrow-back-outline"
          size={40}
          color={colors.onPrimaryContainer}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Query */}
      <View
        style={{
          width: "80%",
          height: "5%",
          justifyContent: "left",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.onSurfaceVariant,
          }}
        >
          Query
        </Text>
      </View>
      <View
        style={{
          width: "80%",
          height: "10%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "light",
              color: colors.onSurfaceVariant,
            }}
          >
            {route.params.query}
          </Text>
        </View>
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons
            name="copy-outline"
            size={20}
            color={colors.onPrimaryContainer}
            // TODO: Implement onPress
            // onPress=
          />
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          width: "80%",
          borderBottomColor: colors.onSurfaceVariant,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      {/* Result */}
      <View
        style={{
          width: "80%",
          height: "5%",
          justifyContent: "left",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.onSurfaceVariant,
          }}
        >
          Translation
        </Text>
      </View>

      <View
        style={{
          width: "80%",
          height: "10%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "light",
              color: colors.onSurfaceVariant,
            }}
          >
            Translation Output
          </Text>
        </View>
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons
            name="copy-outline"
            size={20}
            color={colors.onPrimaryContainer}
            // TODO: Implement onPress
            // onPress=
          />
        </View>
      </View>

      {/* Definition */}
      <View
        style={{
          width: "80%",
          flexDirection: "column",
          backgroundColor: colors.primaryContainer,
          padding: 10,
          borderRadius: 10,
          paddingBottom: 20,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.onPrimaryContainer,
          }}
        >
          Definition
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "light",
            color: colors.onPrimaryContainer,
          }}
        >
          This is the definition output. The quick brown fox jumps over the lazy
          dog. The quick brown fox jumps over the lazy dog. This is the
          definition output. The quick brown fox jumps over the lazy dog. The
          quick brown fox jumps over the lazy dog.
        </Text>
      </View>

      {/* Context */}
      <View
        style={{
          width: "80%",
          flexDirection: "column",
          backgroundColor: colors.primaryContainer,
          padding: 10,
          borderRadius: 10,
          paddingBottom: 20,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.onPrimaryContainer,
          }}
        >
          Context
        </Text>

        {/* Image */}
        <View
          style={{
            width: "100%",
            height: "50%",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <Ionicons
            name="image-outline"
            size={100}
            color={colors.onPrimaryContainer}
          />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.onPrimaryContainer,
          }}
        >
          Example Sentence
        </Text>

        <Text
          style={{
            paddingTop: 10,
            fontSize: 20,
            fontWeight: "light",
            color: colors.onPrimaryContainer,
          }}
        >
          Test Chinese Sentence.
        </Text>

        <Text
          style={{
            paddingTop: 10,
            fontSize: 20,
            fontWeight: "light",
            color: colors.onPrimaryContainer,
          }}
        >
          Test Pronounciation.
        </Text>

        {/* Divider */}
        {/* <View
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            width: '100%',
            borderBottomColor: colors.onSurfaceVariant,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        /> */}

        {/* TODO: Fix the layout on the English sentence */}
        {/* <Text style={{
          paddingTop: 10,
          fontSize: 20,
          fontWeight: 'light',
          color: colors.onPrimaryContainer,
        }}>
          Test English Sentence.
        </Text> */}
      </View>
    </ScrollView>
  );
};

export default ResultScreen;

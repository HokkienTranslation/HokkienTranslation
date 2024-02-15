import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../styles/Colors";
import HokkienTranslationTool from "./components/HokkienTranslationTool";
import HokkienHanziRomanizer from "./components/HokkienHanziRomanizer";
import TextToImage from "./components/TextToImage";
import TextToSpeech from "./components/TextToSpeech";
import { CheckDatabase } from "../backend/CheckDatabase";

const ResultScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [hokkienTranslation, setHokkienTranslation] = useState("");
  const [hokkienRomanized1, setHokkienRomanized1] = useState("");
  const [hokkienRomanized2, setHokkienRomanized2] = useState("");
  const [dataFromDatabase, setDataFromDatabase] = useState(null);

  const handleHokkienTranslation = (translation) => {
    setHokkienTranslation(translation);
  };

  const handleHokkienRomanized1 = (romanized) => {
    setHokkienRomanized1(romanized);
  };

  const handleHokkienRomanized2 = (romanized) => {
    setHokkienRomanized2(romanized);
  };

  useEffect(() => {
    const checkData = async () => {
      // Attempt to fetch data from database
      const { translation, sentence } = await CheckDatabase(query);
      if (translation && sentence) {
        setDataFromDatabase({ translation, sentence });
      }
    };
    checkData();
  }, [query]);

  console.log(dataFromDatabase);

  return (
    <ScrollView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
      }}
    >
      {/* Header */}
      <View
        style={{
          width: "80%",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
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

      {/* Translation && Sentence & Romanizer & TTS */}
      {dataFromDatabase ? (
        <View
          style={{
            width: "80%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: colors.onSurfaceVariant,
                marginBottom: 8,
              }}
            >
              {dataFromDatabase.translation.hokkienTranslation}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.onSurfaceVariant,
                marginBottom: 10,
              }}
            >
              <HokkienHanziRomanizer
                hokkien={dataFromDatabase.translation.hokkienTranslation}
                romanizedResult={handleHokkienRomanized1}
              />
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "light",
                color: colors.onSurfaceVariant,
              }}
            >
              <TextToSpeech prompt={hokkienRomanized1} />
            </Text>
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
                {dataFromDatabase.translation.definitions}
              </Text>
            </View>
            <View
              style={{
                width: "80%",
                flexDirection: "column",
                backgroundColor: colors.primaryContainer,
                padding: 10,
                borderRadius: 10,
                paddingBottom: 20,
                paddingTop: 20,
                marginBottom: 20,
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
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={{ uri: dataFromDatabase.sentence.imageURL }}
                  style={{ width: 300, height: 300 }}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.onPrimaryContainer,
                  marginBottom: 10,
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
                  marginBottom: 10,
                }}
              >
                {dataFromDatabase.sentence.sentences[0]}
              </Text>

              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 20,
                  fontWeight: "light",
                  color: colors.onPrimaryContainer,
                  marginBottom: 10,
                }}
              >
                <HokkienHanziRomanizer
                  hokkien={dataFromDatabase.sentence.sentences[0]}
                  romanizedResult={handleHokkienRomanized2}
                />
              </Text>

              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 20,
                  fontWeight: "light",
                  color: colors.onPrimaryContainer,
                  marginBottom: 10,
                }}
              >
                <TextToSpeech prompt={hokkienRomanized2} />
              </Text>

              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 20,
                  fontWeight: "light",
                  color: colors.onPrimaryContainer,
                  marginBottom: 10,
                }}
              >
                {dataFromDatabase.sentence.sentences[1]}
              </Text>

              <Text
                style={{
                  paddingTop: 10,
                  fontSize: 20,
                  fontWeight: "light",
                  color: colors.onPrimaryContainer,
                  marginBottom: 10,
                }}
              >
                {dataFromDatabase.sentence.sentences[2]}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View
            style={{
              width: "80%",
              height: "10%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginVertical: "auto",
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
                <HokkienTranslationTool
                  query={query}
                  translationResult={handleHokkienTranslation}
                />
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "light",
                  color: colors.onSurfaceVariant,
                }}
              >
                <HokkienHanziRomanizer
                  hokkien={hokkienTranslation}
                  romanizedResult={handleHokkienRomanized1}
                />
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "light",
                  color: colors.onSurfaceVariant,
                }}
              >
                <TextToSpeech prompt={hokkienRomanized1} />
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "80%",
              flexDirection: "column",
              backgroundColor: colors.primaryContainer,
              padding: 10,
              borderRadius: 10,
              paddingBottom: 20,
              paddingTop: 20,
              marginBottom: 20,
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
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <TextToImage prompt={query} />
            </View>
          </View>
        </View>
      )}

      {/* <View
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
      </View> */}
    </ScrollView>
  );
};

export default ResultScreen;

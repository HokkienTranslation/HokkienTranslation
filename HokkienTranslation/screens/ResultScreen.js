import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import {
  ScrollView,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Icon,
  IconButton,
  View,
  Divider,
  Spacer,
} from "native-base";
import colors from "../styles/Colors";
import HokkienTranslationTool from "./components/HokkienTranslationTool";
import HokkienHanziRomanizer from "./components/HokkienHanziRomanizer";
import { fetchRomanizer } from "../backend/API/HokkienHanziRomanizerService";
import TextToImage from "./components/TextToImage";
import TextToSpeech from "./components/TextToSpeech";
import { CheckDatabase } from "../backend/CheckDatabase";

const ResultScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [hokkienTranslation, setHokkienTranslation] = useState("");
  const [hokkienRomanized, setHokkienRomanized] = useState("");
  const [hokkienSentenceRomanized, setHokkienSentenceRomanized] = useState("");
  const [dataFromDatabase, setDataFromDatabase] = useState(null);

  const handleHokkienTranslation = (translation) => {
    setHokkienTranslation(translation);
  };

  const fetchAndSetRomanization = async (hokkienText, type) => {
    try {
      const romanizedText = await fetchRomanizer(hokkienText);
      if (romanizedText) {
        if (type === 1) setHokkienRomanized(romanizedText);
        else if (type === 2) setHokkienSentenceRomanized(romanizedText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text) => Clipboard.setString(text);

  useEffect(() => {
    const fetchRomanization = async () => {
      if (hokkienTranslation && !dataFromDatabase) {
        await fetchAndSetRomanization(hokkienTranslation, 1);
      }
    };
    fetchRomanization();
  }, [hokkienTranslation, dataFromDatabase]);

  useEffect(() => {
    const checkData = async () => {
      const { translation, sentence } = await CheckDatabase(query);
      if (translation && sentence) {
        setDataFromDatabase({ translation, sentence });
        await fetchAndSetRomanization(translation.hokkienTranslation, 1);
        await fetchAndSetRomanization(sentence.sentences[0], 2);
      }
    };
    checkData();
  }, [query]);

  return (
    <ScrollView
      flex={1}
      bg={colors.surface}
      _contentContainerStyle={{
        px: "4",
        mb: "4",
        minW: "72",
      }}
    >
      <VStack alignItems="flex-start">
        <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
          Query
        </Text>
        <HStack alignItems="center" space={2}>
          <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
            {query}
          </Text>
          <IconButton
            icon={
              <Ionicons
                name="copy-outline"
                size={20}
                color={colors.onPrimaryContainer}
              />
            }
            onPress={() => copyToClipboard(query)}
          />
        </HStack>
        <Divider />
        <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
          Translation
        </Text>
        {dataFromDatabase ? (
          <VStack>
            <HStack>
              <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
                {dataFromDatabase.translation.hokkienTranslation}
              </Text>
              <IconButton
                icon={
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={colors.onPrimaryContainer}
                  />
                }
                onPress={() =>
                  copyToClipboard(
                    dataFromDatabase.translation.hokkienTranslation
                  )
                }
              />
            </HStack>
          </VStack>
        ) : (
          <VStack>
            <HStack alignItems="center">
              <Box flex={1}>
                <HokkienTranslationTool
                  query={query}
                  translationResult={handleHokkienTranslation}
                />
              </Box>
              <IconButton
                icon={
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={colors.onPrimaryContainer}
                  />
                }
                onPress={() => copyToClipboard(hokkienTranslation)}
              />
            </HStack>
            <TextToSpeech prompt={hokkienRomanized} />
            <Box
              width="80%"
              backgroundColor={colors.primaryContainer}
              p="3"
              borderRadius="10"
              paddingBottom="5"
              paddingTop="5"
              marginBottom="5"
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={colors.onPrimaryContainer}
              >
                Context
              </Text>

              {/* Image */}
              <Box
                width="100%"
                justifyContent="center"
                alignItems="center"
                paddingTop="2.5"
                paddingBottom="2.5"
              >
                <TextToImage prompt={query} />
              </Box>
            </Box>
          </VStack>
        )}
      </VStack>
    </ScrollView>
  );
};

const TextSection = ({ title, content, onCopy }) => (
  <VStack>
    <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
      {title}
    </Text>
    <HStack alignItems="center" space={2}>
      <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
        {content}
      </Text>
      <IconButton
        icon={
          <Ionicons
            name="copy-outline"
            size={20}
            color={colors.onPrimaryContainer}
          />
        }
        onPress={onCopy}
      />
    </HStack>
  </VStack>
);

const TranslationTool = ({ query, onTranslation }) => (
  <HokkienTranslationTool query={query} translationResult={onTranslation} />
);

const ImageSection = ({ query }) => (
  <Box
    width="80%"
    backgroundColor={colors.primaryContainer}
    p={3}
    borderRadius="10"
    my={5}
  >
    <Text fontSize="lg" fontWeight="bold" color={colors.onPrimaryContainer}>
      Context
    </Text>
    <TextToImage prompt={query} />
  </Box>
);

export default ResultScreen;

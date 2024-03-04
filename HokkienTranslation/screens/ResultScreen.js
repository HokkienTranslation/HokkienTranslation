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
  IconButton,
  View,
  Divider,
} from "native-base";
import { fetchRomanizer } from "../backend/API/HokkienHanziRomanizerService";
import TextToImage from "./components/TextToImage";
import TextToSpeech from "./components/TextToSpeech";
import LoadingScreen from "./LoadingScreen";
import { CheckDatabase } from "../backend/CheckDatabase";
import { useTheme } from "./context/ThemeProvider";
import { useComponentVisibility } from "./context/ComponentVisibilityContext";

const ResultScreen = ({ route }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const { query } = route.params;
  const [hokkienTranslation, setHokkienTranslation] = useState("");
  const [hokkienRomanized, setHokkienRomanized] = useState("");
  const [hokkienSentenceRomanized, setHokkienSentenceRomanized] = useState("");
  const [dataFromDatabase, setDataFromDatabase] = useState(null);
  const { visibilityStates } = useComponentVisibility();

  const [progress, setProgress] = useState(0);

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

  const BoldWordInSentence = ({ sentence, wordToBold }) => {
    if (!wordToBold) return <Text>{sentence}</Text>;

    const parts = sentence.split(new RegExp(`(${wordToBold})`, "gi"));
    return (
      <Text fontSize="lg" color={colors.onSurface}>
        {parts.map((part, index) =>
          part.toLowerCase() === wordToBold.toLowerCase() ? (
            <Text key={index} bold>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const copyToClipboard = (text) => Clipboard.setString(text);

  const updateProgress = (progress, amount) => setProgress(progress + amount);

  useEffect(() => {
    const checkData = async () => {
      const result = await CheckDatabase(query);
      // setProgress(0.5);
      if (result.translation && result.sentence) {
        setDataFromDatabase(result);
        setHokkienTranslation(result.translation.hokkienTranslation);
        await fetchAndSetRomanization(result.translation.hokkienTranslation, 1);
        setProgress(progress => progress + 0.25);
        await fetchAndSetRomanization(result.sentence.sentences[0], 2);
        setProgress(progress => progress + 0.25);
      } else {
        setHokkienTranslation(result.threeTranslations.hokkienTranslation);
        await fetchAndSetRomanization(hokkienTranslation, 1);
        setProgress(progress => progress + 0.5);
      }
    };
    checkData();
    console.log('p', progress);
  }, [query, hokkienTranslation]);

  if (progress < 1.0) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <ScrollView
      flex={1}
      bg={colors.surface}
      _contentContainerStyle={{
        px: "4",
        my: "4",
        minW: "72",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <VStack width="90%" maxWidth="400px">
        {/* Query */}
        <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
          Query
        </Text>
        <HStack alignItems="center">
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
        <Divider my={2} />
        {/* Translation */}
        <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
          Hokkien Translation
        </Text>
        {/* Result */}
        {dataFromDatabase &&
        dataFromDatabase.translation &&
        dataFromDatabase.sentence ? (
          <View justifyContent="center" width="100%">
            {/* Hokkien Translation */}
            <HStack>
              <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
                {hokkienTranslation}
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
            {visibilityStates.textToSpeech && (
              <TextToSpeech prompt={hokkienRomanized} />
            )}
            {/* Definition */}
            {visibilityStates.definition && (
              <Box
                backgroundColor={colors.primaryContainer}
                p={3}
                mb={5}
                borderRadius="10"
                w="100%"
                alignSelf="center"
              >
                <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
                  Definition
                </Text>
                <Text fontSize="md" my={2} color={colors.onSurface}>
                  {dataFromDatabase.translation.definitions}
                </Text>
              </Box>
            )}
            {/* Image */}
            {visibilityStates.image && (
              <Box
                backgroundColor={colors.primaryContainer}
                p={3}
                mb={5}
                borderRadius="10"
                w="100%"
                alignSelf="center"
              >
                <Text
                  mb={2}
                  fontSize="lg"
                  fontWeight="bold"
                  color={colors.onSurface}
                >
                  Context
                </Text>
                <Box alignItems="center" justifyContent="center">
                  <Image
                    source={{ uri: dataFromDatabase.sentence.imageURL }}
                    size="2xl"
                    resizeMode="contain"
                  />
                </Box>
              </Box>
            )}
            {/* Example Sentence */}
            <Box
              backgroundColor={colors.primaryContainer}
              p={3}
              borderRadius="10"
              w="100%"
              alignSelf="center"
            >
              {/* Hokkien Sentence */}
              {visibilityStates.hokkienSentence && (
                <VStack>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.onSurface}
                  >
                    Hokkien Example Sentence
                  </Text>
                  <HStack alignItems={"center"}>
                    <BoldWordInSentence
                      sentence={dataFromDatabase.sentence.sentences[0]}
                      wordToBold={
                        dataFromDatabase.translation.hokkienTranslation
                      }
                    />
                    <IconButton
                      icon={
                        <Ionicons
                          name="copy-outline"
                          size={20}
                          color={colors.onPrimaryContainer}
                        />
                      }
                      onPress={() =>
                        copyToClipboard(dataFromDatabase.sentence.sentences[0])
                      }
                    />
                  </HStack>
                  {visibilityStates.textToSpeech && (
                    <TextToSpeech prompt={hokkienSentenceRomanized} />
                  )}
                </VStack>
              )}

              {/* Chinese Sentence */}
              {visibilityStates.chineseSentence && (
                <VStack>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.onSurface}
                  >
                    Chinese Example Sentence
                  </Text>
                  <HStack alignItems={"center"}>
                    <Text fontSize="lg" color={colors.onSurface}>
                      {dataFromDatabase.sentence.sentences[2]}
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
                        copyToClipboard(dataFromDatabase.sentence.sentences[2])
                      }
                    />
                  </HStack>
                </VStack>
              )}

              {/* English Sentence */}
              {visibilityStates.englishSentence && (
                <VStack>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={colors.onSurface}
                  >
                    English Example Sentence
                  </Text>
                  <HStack alignItems={"center"}>
                    <Text fontSize="lg" color={colors.onSurface}>
                      {dataFromDatabase.sentence.sentences[1]}
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
                        copyToClipboard(dataFromDatabase.sentence.sentences[1])
                      }
                    />
                  </HStack>
                </VStack>
              )}
            </Box>
          </View>
        ) : (
          <View justifyContent="center" width="100%">
            <HStack>
              <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
                {hokkienTranslation}
              </Text>
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
            {visibilityStates.textToSpeech && (
              <TextToSpeech prompt={hokkienRomanized} />
            )}
            {visibilityStates.image && (
              <Box
                backgroundColor={colors.primaryContainer}
                p={3}
                borderRadius="10"
                w="100%"
                alignSelf="center"
              >
                <Text
                  fontSize="lg"
                  my={2}
                  fontWeight="bold"
                  color={colors.onSurface}
                >
                  Context
                </Text>
                <TextToImage m={2} prompt={query} />
              </Box>
            )}
          </View>
        )}
      </VStack>
    </ScrollView>
  );
};

export default ResultScreen;

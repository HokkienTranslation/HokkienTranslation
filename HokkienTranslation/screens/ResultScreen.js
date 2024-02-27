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
import HokkienTranslationTool from "./components/HokkienTranslationTool";
import { fetchRomanizer } from "../backend/API/HokkienHanziRomanizerService";
import TextToImage from "./components/TextToImage";
import TextToSpeech from "./components/TextToSpeech";
import { CheckDatabase } from "../backend/CheckDatabase";
import { useTheme } from "../styles/ThemeProvider";

const ResultScreen = ({ route }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
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
      console.log(
        "----------------In fetchAndSetRomanization-----------------"
      );
      console.log("dataFromDatabase: " + dataFromDatabase);
      console.log("hokkienTranslation: " + hokkienTranslation);
      console.log("hokkienRomanized: " + hokkienRomanized);
      console.log("hokkienSentenceRomanized: " + hokkienSentenceRomanized);
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

  useEffect(() => {
    const checkData = async () => {
      const result = await CheckDatabase(query);
      if (result.translation && result.sentence) {
        // const { translation = {}, sentence = {} } = result;
        setDataFromDatabase(result);
        // setDataFromDatabase({ translation, sentence });
        setHokkienTranslation(result.translation.hokkienTranslation);
        await fetchAndSetRomanization(result.translation.hokkienTranslation, 1);
        await fetchAndSetRomanization(result.sentence.sentences[0], 2);
        console.log("-----------In CheckDatabase: data-----------");
        console.log("dataFromDatabase: " + dataFromDatabase);
        console.log("hokkienTranslation: " + hokkienTranslation);
        console.log("hokkienRomanized: " + hokkienRomanized);
        console.log("hokkienSentenceRomanized: " + hokkienSentenceRomanized);
      } else {
        setHokkienTranslation(result.threeTranslations.hokkienTranslation);
        await fetchAndSetRomanization(hokkienTranslation, 1);
        console.log("-----------In CheckDatabase: no data-----------");
        console.log("dataFromDatabase: " + dataFromDatabase);
        console.log("hokkienTranslation: " + hokkienTranslation);
        console.log("hokkienRomanized: " + hokkienRomanized);
        console.log("hokkienSentenceRomanized: " + hokkienSentenceRomanized);
      }
    };
    checkData();
  }, [query, hokkienTranslation]);

  // useEffect(() => {
  //   const fetchRomanization = async () => {
  //     if (hokkienTranslation && !dataFromDatabase) {
  //       await fetchAndSetRomanization(hokkienTranslation, 1);
  //       console.log("----------------In fetchRomanization-----------------");
  //       console.log("dataFromDatabase: " + dataFromDatabase);
  //       console.log("hokkienTranslation: " + hokkienTranslation);
  //       console.log("hokkienRomanized: " + hokkienRomanized);
  //       console.log("hokkienSentenceRomanized: " + hokkienSentenceRomanized);
  //     }
  //   };
  //   fetchRomanization();
  // }, [hokkienTranslation, dataFromDatabase]);

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
                {/* Database */}
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
            <TextToSpeech prompt={hokkienRomanized} />
            {/* Definition */}
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
            {/* Image */}
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
            {/* Example Sentence */}
            <Box
              backgroundColor={colors.primaryContainer}
              p={3}
              borderRadius="10"
              w="100%"
              alignSelf="center"
            >
              {/* Hokkien Sentence */}
              <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
                Hokkien Example Sentence
              </Text>
              <HStack alignItems={"center"}>
                <BoldWordInSentence
                  sentence={dataFromDatabase.sentence.sentences[0]}
                  wordToBold={dataFromDatabase.translation.hokkienTranslation}
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
              <TextToSpeech prompt={hokkienSentenceRomanized} />

              {/* Chinese Sentence */}
              <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
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

              {/* English Sentence */}
              <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
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
            </Box>
          </View>
        ) : (
          <View justifyContent="center" width="100%">
            <HStack>
              {/* <HokkienTranslationTool
                query={query}
                translationResult={handleHokkienTranslation}
              /> */}
              <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
                {hokkienTranslation}
                {/* Poop */}
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
            <TextToSpeech prompt={hokkienRomanized} />
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
          </View>
        )}
      </VStack>
    </ScrollView>
  );
};

export default ResultScreen;

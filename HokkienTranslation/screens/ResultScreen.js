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
  // const [hokkienSentenceRomanized, setHokkienSentenceRomanized] = useState("");
  const [dataFromDatabase, setDataFromDatabase] = useState(null);

  const handleHokkienTranslation = (translation) => {
    setHokkienTranslation(translation);
  };

  // const handletemp = (translation) => {
  //   setHokkienRomanized(translation);
  // };

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
        {/* Translation */}
        <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
          Hokkien Translation
        </Text>
        {/* Result */}
        {dataFromDatabase ? (
          <View justifyContent="center" width="100%">
            {/* Hokkien Translation */}
            <HStack space={2}>
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
            {/* Text To Speech */}
            {/* <HokkienHanziRomanizer
              hokkien={dataFromDatabase.translation.hokkienTranslation}
              romanizedResult={handletemp}
            /> */}
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
              {/* English Sentence */}
              <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
                English Example Sentence
              </Text>
              <HStack space={2} alignItems={"center"}>
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

              {/* Chinese Sentence */}
              <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
                Chinese Example Sentence
              </Text>
              <HStack space={2} alignItems={"center"}>
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

              {/* Hokkien Sentence */}
              <Text fontSize="lg" fontWeight="bold" color={colors.onSurface}>
                Hokkien Example Sentence
              </Text>
              <HStack space={2} alignItems={"center"}>
                <Text fontSize="lg" color={colors.onSurface}>
                  {dataFromDatabase.sentence.sentences[0]}
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
                    copyToClipboard(dataFromDatabase.sentence.sentences[0])
                  }
                />
              </HStack>
              {/* Text To Speech */}
              {/* <HokkienHanziRomanizer
                hokkien={dataFromDatabase.sentence.sentences[0]}
                romanizedResult={handletemp}
              /> */}
              <TextToSpeech prompt={dataFromDatabase.sentence.sentences[0]} />
            </Box>
          </View>
        ) : (
          <View justifyContent="center" width="100%">
            <HStack space={2}>
              <HokkienTranslationTool
                query={query}
                translationResult={handleHokkienTranslation}
              />
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

// return (
//   <ScrollView
//     flex={1}
//     bg={colors.surface}
//     _contentContainerStyle={{ px: 4, mb: 4, minW: "72" }}
//   >
//     <VStack space={4} alignItems="flex-start">
//       <TextSection title="Query" content={query} onCopy={() => copyToClipboard(query)} />
//       <Divider my="2" />
//       <TextSection title="Translation" content={dataFromDatabase?.translation.hokkienTranslation} onCopy={() => copyToClipboard(dataFromDatabase?.translation.hokkienTranslation)} />
//       {!dataFromDatabase && (
//         <TranslationTool query={query} onTranslation={setHokkienTranslation} />
//       )}
//       <TextToSpeech prompt={hokkienRomanized} />
//       <ImageSection query={query} />
//     </VStack>
//   </ScrollView>
// );

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

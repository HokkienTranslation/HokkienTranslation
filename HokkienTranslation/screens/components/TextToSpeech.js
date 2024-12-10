import React, { useState, useEffect } from "react";
import { HStack, Text, IconButton } from "native-base";
import { Feather } from "@expo/vector-icons";
// import { TONE_API_URL, SPEECH_API_URL } from "@env";
import { useTheme } from "../context/ThemeProvider";
import { fetchNumericTones, fetchAudioUrl } from "../../backend/API/TextToSpeechService";
import { getStoredHokkien } from "../../backend/database/DatabaseUtils.js";

const TextToSpeech = ({ prompt }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [error, setError] = useState();
  const [numericTones, setNumericTones] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  // const NUMERIC_TONES_API = TONE_API_URL;
  // const TEXT_TO_SPEECH_API = SPEECH_API_URL;
  const NUMERIC_TONES_API = process.env.TONE_API_URL;
  const TEXT_TO_SPEECH_API = process.env.SPEECH_API_URL;

  let params = new URLSearchParams({
    text0: prompt,
  });

  useEffect(() => {
    async function fetchWav() {
      try {
        const flashcard = await getStoredHokkien(prompt, "Hokkien");
        if (flashcard) {
          console.log(flashcard);
          setNumericTones(flashcard.romanization);
          setAudioUrl(flashcard.audioUrl);
          console.log("Fetched audio from storage");
      } else {
          const numericTones = await fetchNumericTones(prompt);
          setNumericTones(numericTones);

          const audioUrl = await fetchAudioUrl(numericTones);
          setAudioUrl(audioUrl);
      } 
    }
    catch (error) {
        console.log(error);
        setError(error);
      }
    }

    if (prompt) {
      fetchWav();
    }
  }, [prompt]);

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <HStack alignItems="center">
      <Text fontSize="lg" color={colors.onSurfaceVariant}>
        [{numericTones}]
      </Text>
      <IconButton
        icon={
          <Feather
            name="volume-2"
            size={20}
            color={colors.onPrimaryContainer}
          />
        }
        onPress={playAudio}
        isDisabled={!audioUrl}
      />
    </HStack>
  );
};

export default TextToSpeech;

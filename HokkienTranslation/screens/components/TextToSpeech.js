import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { TONE_API_URL, SPEECH_API_URL } from "@env";

const TextToSpeech = ({ prompt }) => {
  const [error, setError] = useState();
  const [numericTones, setNumericTones] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const NUMERIC_TONES_API = TONE_API_URL;
  const TEXT_TO_SPEECH_API = SPEECH_API_URL;

  let params = new URLSearchParams({
    text0: prompt,
  });

  useEffect(() => {
    async function fetchWav() {
      let url = `${NUMERIC_TONES_API}?${params.toString()}`;

      let numeric_tones;
      await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          numeric_tones = data;
          setNumericTones(numeric_tones);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error);
        });

      params = new URLSearchParams({
        text1: numeric_tones,
        gender: "女聲",
        accent: "強勢腔（高雄腔）",
      });

      url = `${TEXT_TO_SPEECH_API}?${params.toString()}`;

      await fetch(url)
        .then((response) => response.blob())
        .then((data) => {
          const blob = new Blob([data], { type: "audio/wav" });
          const url = window.URL.createObjectURL(blob);
          setAudioUrl(url);
          // audio.play();
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error);
        });
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
    <View>
      <Text>{numericTones}</Text>
      <Button title="Play Audio" onPress={playAudio} disabled={!audioUrl} />
    </View>
  );
};

export default TextToSpeech;

import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

const TextToSpeech = ({ prompt }) => {
  const [error, setError] = useState();
  const [numericTones, setNumericTones] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const NUMERIC_TONES_API = "http://tts001.iptcloud.net:8804/display2";
  const TEXT_TO_SPEECH_API = "http://tts001.iptcloud.net:8804/synthesize_TLPA";

  const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Proxy server URL

  let params = new URLSearchParams({
    text0: prompt,
  });

  const options = {
    method: "GET",
    mode: "cors", // Set the mode to 'cors'
    headers: {
      // Add the necessary headers
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    async function fetchWav(prompt) {
      let url = `${NUMERIC_TONES_API}?${params.toString()}`;
      let proxiedUrl = proxyUrl + url; // Append the proxy server URL to the original URL

      let numeric_tones;
      await fetch(proxiedUrl, options)
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
      proxiedUrl = proxyUrl + url; // Append the proxy server URL to the original URL

      await fetch(proxiedUrl, options)
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
      fetchWav(prompt);
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

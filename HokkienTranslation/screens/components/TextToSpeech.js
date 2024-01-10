import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";

const TextToSpeech = ({ prompt }) => {
  const axios = require("axios");
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState();
  const apiUrl = "https://535f-203-145-219-124.ngrok-free.app/generateImage";
  const requestData = {};
  const headers = {};

  useEffect(() => {
    if (prompt) {
      axios
        .post(apiUrl, requestData, { headers })
        .then((response) => {})
        .catch((error) => {
          console.error("Error:", error);
          setError(error);
        });
    }
  }, [prompt]);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return <View></View>;
};

export default TextToSpeech;

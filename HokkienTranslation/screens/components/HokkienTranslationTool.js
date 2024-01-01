import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

const HokkienTranslationTool = ({ query }) => {
  const axios = require("axios");
  const [translation, setTranslation] = useState();
  const apiUrl = "http://203.145.216.157:56238/generate";
  const requestData = {
    inputs: "[TRANS]\n${query}\n[/TRANS]\n[HAN]\n",
    parameters: {
      max_new_tokens: 128,
      repetition_penalty: 1.1,
    },
  };

  try {
    const response = axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTranslation(response.data);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }

  return (
    <Text
      style={{
        fontSize: 20,
        fontWeight: "bold",
        color: colors.onSurfaceVariant,
      }}
    >
      {translation}
    </Text>
  );
};

export default HokkienTranslationTool;

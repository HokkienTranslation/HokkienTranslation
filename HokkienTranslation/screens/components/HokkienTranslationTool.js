import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import colors from "../../styles/Colors";
import axios from "axios";

const HokkienTranslationTool = ({ query, onTranslationComplete }) => {
  const [translation, setTranslation] = useState("");
  const apiUrl = "http://203.145.216.157:56238/generate";

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const requestData = {
          inputs: `[TRANS]\n${query}\n[/TRANS]\n[HAN]\n`,
          parameters: {
            max_new_tokens: 128,
            repetition_penalty: 1.1,
          },
        };

        const response = await axios.post(apiUrl, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Accessing response
        if (response.data && response.data.generated_text) {
          const translationText = response.data.generated_text.split("\n")[0];
          setTranslation(translationText);
          onTranslationComplete(translationText);
          // console.log(response.data.generated_text.split("\n")[0]);
        }
      } catch (error) {
        console.error("Error:", error);
        setTranslation("Error in translation.");
      }
    };

    if (query) {
      fetchTranslation();
    }
  }, [query, onTranslationComplete]);

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

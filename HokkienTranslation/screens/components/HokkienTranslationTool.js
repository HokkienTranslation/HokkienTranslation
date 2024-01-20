import React, { useState, useEffect, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../styles/Colors";
import axios from "axios";

const apiUrl = "http://203.145.216.157:56238/generate";

// Return input language type ZH (Chinese) / EN (English)
const determineLanguage = (query) => {
  const chineseCharPattern = /[\u3400-\u9FBF]/;
  return chineseCharPattern.test(query) ? "ZH" : "EN";
};

// outputLanguage = "ZH" (Chinese) / "EN" (English) / "HAN" (Hokkien)
// default "HAN" (Hokkien)
const HokkienTranslationTool = ({ query, outputLanguage = "HAN" }) => {
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchTranslation = async () => {
      if (!query) return;

      try {
        const requestData = {
          inputs: `[TRANS]\n${query}\n[/TRANS]\n${outputLanguage}}\n`,
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

        if (response.data && response.data.generated_text) {
          const translationText = response.data.generated_text.split("\n")[0];
          if (outputLanguage === "EN") {
            translationText = translationText.substring(
              0,
              translationText.length - 1
            );
          }
          setTranslation(translationText);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error in translation.");
      }
    };
    fetchTranslation();
  }, [query, translation]);

  return <Text style={styles.text}>{translation}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.onSurfaceVariant,
  },
});

export default HokkienTranslationTool;
export { determineLanguage };

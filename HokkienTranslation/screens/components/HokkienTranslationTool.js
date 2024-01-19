import React, { useState, useEffect, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../styles/Colors";
import axios from "axios";

const apiUrl = "http://203.145.216.157:56238/generate";

const determineLanguage = (query) => {
  const chineseCharPattern = /[\u3400-\u9FBF]/;
  return chineseCharPattern.test(query) ? "HAN" : "ENG";
};

// outputLanguage = "HAN" or "ENG"
const HokkienTranslationTool = ({
  query,
  onTranslationComplete,
  outputLanguage,
}) => {
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState("");

  const inputLanguage = useMemo(() => determineLanguage(query), [query]);
  const storeLanguage = inputLanguage === "HAN" ? "ENG" : "HAN";
  console.log(inputLanguage);
  console.log(storeLanguage);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!query) return;

      try {
        const requestData = {
          inputs: `[TRANS]\n${query}\n[/TRANS]\n${language}}\n`,
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
          setTranslation(translationText);
          onTranslationComplete(translationText);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error in translation.");
      }
    };

    fetchTranslation();
  }, [query, onTranslationComplete]);

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

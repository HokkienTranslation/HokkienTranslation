import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../styles/Colors";
import { fetchTranslation } from "../../backend/API/HokkienTranslationToolService";

// outputLanguage = "ZH" (Chinese) / "EN" (English) / "HAN" (Hokkien)
// default "HAN" (Hokkien)
const HokkienTranslationTool = ({
  query,
  translationResult,
  outputLanguage = "HAN",
}) => {
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    const getTranslation = async () => {
      const translationText = await fetchTranslation(query, outputLanguage);
      if (translationText) {
        setTranslation(translationText);
        if (translationResult) {
          translationResult(translationText);
        }
      }
    };
    getTranslation();
  }, [query, outputLanguage, translationResult]);

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

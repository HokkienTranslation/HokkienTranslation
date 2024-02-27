import React, { useState, useEffect } from "react";
import { Text } from "native-base";
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
      console.log("------------In API-----------");
      console.log("translationText: " + translationText);
    };
    getTranslation();
  }, [query, outputLanguage]);

  return (
    <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
      {translation}
    </Text>
  );
};

export default HokkienTranslationTool;

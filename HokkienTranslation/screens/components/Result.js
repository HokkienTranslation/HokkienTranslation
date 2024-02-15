import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { CheckDatabase } from "../../backend/CheckDatabase";

const Result = ({ query, inDatabase }) => {
  const data = CheckDatabase(query);

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

  return <Text>{translation}</Text>;
};

export default Result;

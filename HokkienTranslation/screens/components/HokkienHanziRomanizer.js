import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../styles/Colors";
import axios from "axios";

const apiUrl = "https://e402-203-145-219-124.ngrok-free.app/translateHAN2KIP";
const apiKey = "iisriisra305";

const HokkienHanziRomanizer = ({ hokkien, romanizedResult }) => {
  const [romanized, setRomanized] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRomanized = async () => {
      if (!hokkien) return;

      try {
        const requestData = {
          sentence: hokkien,
        };

        const response = await axios.post(apiUrl, requestData, {
          headers: {
            "API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.result) {
          const romanizedText = response.data.result;
          setRomanized(romanizedText);
          if (romanizedResult) {
            romanizedResult(romanized);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error in romanized.");
      }
    };

    fetchRomanized();
  }, [hokkien, romanized, romanizedResult]);

  return <Text style={styles.text}>{romanized || error}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.onSurfaceVariant,
  },
});

export default HokkienHanziRomanizer;

import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../styles/Colors";
import { fetchRomanizer } from "../../backend/API/HokkienHanziRomanizerService";

const HokkienHanziRomanizer = ({ hokkien, romanizedResult }) => {
  const [romanized, setRomanized] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getRomanized = async () => {
      try {
        const romanizedText = await fetchRomanizer(hokkien);
        if (romanizedText) {
          setRomanized(romanizedText);
          if (romanizedResult) {
            romanizedResult(romanizedText);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    getRomanized();
  }, [hokkien, romanizedResult]);

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

import React, { useState, useEffect } from "react";
import { Text } from "native-base";
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

  return (
    <Text fontSize="2xl" bold color={colors.onSurfaceVariant}>
      {romanized || error}
    </Text>
  );
};

export default HokkienHanziRomanizer;

import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";

const TextToImage = ({ prompt }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prompt) {
      const OpenAI = require("openai");
      const openai = new OpenAI({
        // TODO: add api key & store in env for security
        apiKey: "",
      });

      openai
        .createImage({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        })
        .then((response) => {
          setImageUrl(response.data.data[0].url);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
    }
  }, [prompt]);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!imageUrl) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default TextToImage;

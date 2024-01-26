import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";
import { generateImage } from "../../backend/API/TextToImageService";

const TextToImage = ({ prompt }) => {
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      const { imgBase64, error } = await generateImage(prompt);
      if (imgBase64) {
        setImageUrl(`data:image/jpeg;base64,${imgBase64}`);
      }
      if (error) {
        setError(error);
      }
    };

    if (prompt) {
      fetchImage();
    }
  }, [prompt]);

  if (!imageUrl && !error) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      )}
      {error && <Text>Error loading image: {error.message}</Text>}
    </View>
  );
};

export default TextToImage;

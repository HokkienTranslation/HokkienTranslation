import React, { useState, useEffect } from "react";
import { Image, Box, Text } from "native-base";
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
    <Box alignItems="center" justifyContent="center">
      {imageUrl && (
        <Image source={{ uri: imageUrl }} size="2xl" resizeMode="contain" />
      )}
      {error && <Text>Error loading image: {error.message}</Text>}
    </Box>
  );
};

export default TextToImage;

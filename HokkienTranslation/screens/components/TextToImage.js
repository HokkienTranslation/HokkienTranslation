import React, { useState, useEffect } from "react";
import { Image, Box, Text } from "native-base";

const TextToImage = ({ prompt }) => {
  const [imageUrl, setImageUrl] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { imgBase64, error } = await generateImage(prompt);
        if (imgBase64) {
          setImageUrl(`data:image/jpeg;base64,${imgBase64}`);
        } else if (error) {
          setError(error);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchImage();
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

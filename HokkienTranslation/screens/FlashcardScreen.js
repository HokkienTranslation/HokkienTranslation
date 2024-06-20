import React, { useState } from "react";
import { Box, Text, Button, Center, VStack, HStack } from "native-base";
import { TouchableOpacity, Modal } from "react-native"; 

const FlashcardScreen = ({ navigation }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleNext = () => {
    setShowTranslation(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handleUpdate = () => {
    const currentFlashcard = flashcards[currentCardIndex];
    navigation.navigate('UpdateFlashcard', { flashcard: currentFlashcard });
  };

  const handleDelete = () => {
    //
    setShowConfirmDelete(false);
  };

  return (
    <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
        <HStack space={4}>
          <Button onPress={() => navigation.navigate('CreateFlashcard')}>Create</Button>
          <Button onPress={handleUpdate}>Update</Button>
          <Button onPress={() => setShowConfirmDelete(true)}>Delete</Button> 
        </HStack>
        <TouchableOpacity onPress={handleFlip}>
          <Box
            width="300px"
            height="200px"
            bg="primary.500"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            shadow={2}
          >
            <Text fontSize="2xl" color="white">
              {showTranslation
                ? flashcards[currentCardIndex].translation
                : flashcards[currentCardIndex].word}
            </Text>
          </Box>
        </TouchableOpacity>
        <Button onPress={handleNext}>Next</Button>
      </VStack>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmDelete}
        onRequestClose={() => setShowConfirmDelete(false)}
      >
        <Center flex={1} justifyContent="center" backgroundColor="rgba(0, 0, 0, 0.5)">
          <Box 
            width="400px"
            height="100px"
            bg="white"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            shadow={2}>

            <Text fontSize="lg">
              Delete the {flashcards[currentCardIndex].word} flashcard?
            </Text>
            <HStack space={4}>
              <Button onPress={handleDelete}>Yes</Button>
              <Button onPress={handleDelete}>No</Button>
            </HStack>
          </Box>
        </Center>
      </Modal>
    </Center>
  );
};

export default FlashcardScreen;

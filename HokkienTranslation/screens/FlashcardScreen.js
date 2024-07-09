import React, { useState } from "react";
import { Box, Text, Button, Center, VStack, HStack, Input, Select} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Modal } from "react-native";
import FlashcardNavigator from "../screens/components/FlashcardNavigator";
import NavigationButtons from "../screens/components/ScreenNavigationButtons";
import { useTheme } from "./context/ThemeProvider";

const FlashcardScreen = ({ navigation }) => {
  const { theme, themes } = useTheme();
  const colors = themes[theme];
  const [showTranslation, setShowTranslation] = useState(false);
  // const [word, setWord] = useState('');
  // const [translation, setTranslation] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showNewFlashcard, setShowNewFlashcard] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [type, setType] = useState("");
  const [tempCat, setTempCat] = useState("");
  const [privacy, setPrivacy] = useState("");


  const flashcards = [
    { word: "Apple", translation: "苹果 (Píngguǒ)" },
    { word: "Banana", translation: "香蕉 (Xiāngjiāo)" },
    { word: "Cat", translation: "猫 (Māo)" },
    { word: "Dog", translation: "狗 (Gǒu)" },
  ];

  const handleFlip = () => {
    setShowTranslation(!showTranslation);
  };

  const handleCreate = () => {
    setShowNewFlashcard(true);
  };

  const handleUpdate = () => {
    // const currentFlashcard = flashcards[currentCardIndex];
    // navigation.navigate('UpdateFlashcard', { flashcard: currentFlashcard });
    setShowUpdates(true);
  };

  const handleDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <Box flex={1} background={colors.surface}>
      <NavigationButtons colors={colors} />
      <Center flex={1} px="3">
        <VStack space={4} alignItems="center">
          <HStack space={4}>
            <Button
              bg={colors.primaryContainer}
              _text={{ color: colors.onPrimary }}
              shadow={2}
              paddingX={4}
              paddingY={2}
              borderRadius="10px"
              onPress={handleCreate}
            >
              <Center>
                <HStack space={2} alignItems="center">
                  <Ionicons name="add" size={20} color={colors.onPrimary} />
                  <Text>Create</Text>
                </HStack>
              </Center>
            </Button>
            <Button
              bg={colors.primaryContainer}
              _text={{ color: colors.onPrimary }}
              shadow={2}
              paddingX={4}
              paddingY={2}
              borderRadius="10px"
              onPress={handleUpdate}
            >
              <Center>
                <HStack space={2} alignItems="center">
                  <Ionicons name="pencil" size={20} color={colors.onPrimary} />
                  <Text>Update</Text>
                </HStack>
              </Center>
            </Button>
            <Button
              bg={colors.primaryContainer}
              _text={{ color: colors.onPrimary }}
              shadow={2}
              paddingX={4}
              paddingY={2}
              borderRadius="10px"
              onPress={() => setShowConfirmDelete(true)}
            >
              <Center>
                <HStack space={2} alignItems="center">
                  <Ionicons name="trash" size={20} color={colors.onPrimary} />
                  <Text>Delete</Text>
                </HStack>
              </Center>
            </Button>
          </HStack>
          <TouchableOpacity onPress={handleFlip} accessibilityLabel="Flip Card">
            <Box
              width="300px"
              height="200px"
              bg={colors.primaryContainer}
              alignItems="center"
              justifyContent="center"
              borderRadius="10px"
              shadow={2}
            >
              <Text fontSize="2xl" color={colors.onSurface}>
                {showTranslation
                  ? flashcards[currentCardIndex].translation
                  : flashcards[currentCardIndex].word}
              </Text>
            </Box>
          </TouchableOpacity>
          <FlashcardNavigator
            currentCardIndex={currentCardIndex}
            flashcardsLength={flashcards.length}
            setCurrentCardIndex={setCurrentCardIndex}
            setShowTranslation={setShowTranslation}
          />
        </VStack>
        {/* create pop up */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showNewFlashcard}
          onRequestClose={() => setShowNewFlashcard(false)}>
          <Center flex={1} justifyContent="center" backgroundColor="rgba(0, 0, 0, 0.5)">
            <Box
              width="300px"
              bg="white"
              alignItems="center"
              borderRadius="10px"
              shadow={2}
              padding={4}>
              <Text fontSize="lg" marginBottom={4}>
                Create new flashcard:
              </Text>
              <VStack space={4} alignItems="center">
                <Input placeholder="Enter word" width={200}/>
                <Input placeholder="Enter Translation" width={200}/>
                <Box space={4} alignItems="center" width={200}>
                    <Select
                      selectedValue={type}
                      placeholder="Select Type"
                      onValueChange={(itemValue) => setType(itemValue)}
                    >
                      <Select.Item label="Word" value="word" />
                      <Select.Item label="Sentence" value="sentence" />
                    </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                    <Select
                      selectedValue={tempCat}
                      placeholder="Select Category"
                      onValueChange={(itemValue) => setTempCat(itemValue)}
                    >
                      <Select.Item label="Shopping" value="shopping" />
                      <Select.Item label="Other" value="other" />
                    </Select>
                </Box>
                <Box space={4} alignItems="center" width={200}>
                    <Select
                      selectedValue={privacy}
                      placeholder="Set Privacy"
                      onValueChange={(itemValue) => setPrivacy(itemValue)}
                    >
                      <Select.Item label="Public" value="shopping" />
                      <Select.Item label="Private" value="other" />
                    </Select>
                </Box>
                <HStack space={4}>
                  <Button 
                   bg={colors.primaryContainer}
                   _text={{ color: colors.onPrimary }}
                   shadow={2}
                   paddingX={4}
                   paddingY={2}
                   borderRadius="10px"
                   onPress={handleCreate}>Save</Button>
                  <Button 
                      bg={colors.primaryContainer}
                      _text={{ color: colors.onPrimary }}
                      shadow={2}
                      paddingX={4}
                      paddingY={2}
                      borderRadius="10px"
                    onPress={() => setShowNewFlashcard(false)}>Cancel</Button>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Modal>
        {/* update pop up */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showUpdates}
          onRequestClose={() => setShowUpdates(false)}
        >
          <Center flex={1} justifyContent="center" backgroundColor="rgba(0, 0, 0, 0.5)">
            <Box
              width="300px"
              bg="white"
              alignItems="center"
              justifyContent="center"
              borderRadius="10px"
              shadow={2}
              padding={4}
            >
              <VStack space={4} alignItems="center">
              <Text fontSize="lg">
                Edit flashcard:
              </Text>
                <Input
                  placeholder="Word"
                  value={flashcards[currentCardIndex].word}
                  // onChangeText={setWord}
                />
                <Input
                  placeholder="Translation"
                  value={flashcards[currentCardIndex].translation}
                  // onChangeText={setTranslation}
                />
                <HStack space={4}>
                  <Button 
                      bg={colors.primaryContainer}
                      _text={{ color: colors.onPrimary }}
                      shadow={2}
                      paddingX={4}
                      paddingY={2}
                      borderRadius="10px"
                    onPress={handleUpdate}>Save</Button>
                  <Button 
                      bg={colors.primaryContainer}
                      _text={{ color: colors.onPrimary }}
                      shadow={2}
                      paddingX={4}
                      paddingY={2}
                      borderRadius="10px"
                    onPress={() => setShowUpdates(false)}>Cancel</Button>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Modal>
        {/* delete pop up */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirmDelete}
          onRequestClose={() => setShowConfirmDelete(false)}
        >
          <Center flex={1} justifyContent="center" backgroundColor="rgba(0, 0, 0, 0.5)">
            <Box
              width="300px"
              height="150px"
              bg="white"
              alignItems="center"
              justifyContent="center"
              borderRadius="10px"
              shadow={2}
              padding={4}
            >
              <Text fontSize="lg" marginBottom={4}>
                Delete this flashcard?
              </Text>
              <HStack space={4}>
                <Button onPress={handleDelete}>Yes</Button>
                <Button onPress={() => setShowConfirmDelete(false)}>No</Button>
              </HStack>
            </Box>
          </Center>
        </Modal>
      </Center>
    </Box>
  );
};

export default FlashcardScreen;
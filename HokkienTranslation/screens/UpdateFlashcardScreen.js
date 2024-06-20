import React from 'react';
import { Center, VStack, HStack, Input, Button, Text } from 'native-base';

const UpdateFlashcardScreen = ({ navigation, route }) => {
  const { flashcard } = route.params; 

  const [word, setWord] = React.useState(flashcard.word);
  const [translation, setTranslation] = React.useState(flashcard.translation);

  return (
    <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
        <Text fontSize="2xl" mb={4}>Edit flashcard</Text>
        <Input
          placeholder="Word"
          value={word}
          onChangeText={setWord}
        />
        <Input
          placeholder="Translation"
          value={translation}
          onChangeText={setTranslation}
        />
        <HStack space={4}>
          <Button onPress={() => navigation.navigate('Flashcard')}>Save</Button>
          <Button onPress={() => navigation.navigate('Flashcard')}>Cancel</Button>
        </HStack>
      </VStack>
    </Center>
  );
};

export default UpdateFlashcardScreen;

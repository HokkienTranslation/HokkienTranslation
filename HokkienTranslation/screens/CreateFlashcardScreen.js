import React from 'react';
import { Center, VStack, HStack, Input, Button, Text } from 'native-base';

const CreateFlashcardScreen = ({ navigation }) => {

  return (
    <Center flex={1} px="3">
      <VStack space={4} alignItems="center">
        <Text fontSize="2xl" mb={4}>Create new flashcard</Text>
        <Input placeholder="Word" />
        <Input placeholder="Translation" />
        <HStack space={4}>
            <Button onPress={() => navigation.navigate('Flashcard')}>Save</Button>
            <Button onPress={() => navigation.navigate('Flashcard')}>Cancel</Button>
        </HStack>
      </VStack>
    </Center>
  );
};

export default CreateFlashcardScreen;

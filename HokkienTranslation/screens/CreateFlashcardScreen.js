import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Center, VStack, HStack, Input, Button, Text } from 'native-base';

const CreateFlashcardScreen = ({ navigation }) => {
  const navigation = useNavigation();
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
    </SafeAreaView>
  );
};

export default CreateFlashcardScreen;
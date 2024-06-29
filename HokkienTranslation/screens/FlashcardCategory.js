import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Box, Center, Container, Heading, Icon, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { useTheme } from './context/ThemeProvider';

// list of categories use api
const categories = [
  { name: 'Family', icon: 'group' },
  { name: 'Business', icon: 'business' },
  { name: 'Tax', icon: 'account-balance' },
  { name: 'Labour', icon: 'build' },
  { name: 'Labour', icon: 'build' },
  { name: 'Labour', icon: 'build' },
  { name: 'Labour', icon: 'build' },
];

const FlashcardCategory = () => {
  const navigation = useNavigation();
  const { themes, theme } = useTheme();
  const colors = themes[theme];
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Center>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Categories</Heading>
          <VStack style={styles.grid}>
            {categories.map((category, index) => (
              <CategoryBox key={index} category={category} navigation={navigation} />
            ))}
          </VStack>
        </Container>
      </Center>
    </SafeAreaView>
  );
};

const CategoryBox = ({ category, index, navigation }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    // add additional onClick events to transition to FlashcardScreen with the correct cards.
    return (
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => navigation.navigate('Flashcard')}
        style={isPressed ? [styles.categoryBox, styles.categoryBoxPressed] : styles.categoryBox}
      >
        <Box key={index} alignItems="center">
          <Icon as={MaterialIcons} name={category.icon} size="lg" color="black" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </Box>
      </Pressable>
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryBoxPressed: {
    transform: [{ translateY: -5 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryText: {
    color: 'black',
    marginTop: 8,
  },
});

export default FlashcardCategory;

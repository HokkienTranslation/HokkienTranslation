import React from 'react';
import { SafeAreaView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Center, Text, VStack, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './context/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';

const BoxList = [
  { id: 1, name: 'Flashcard list 1', icon: 'build'  },
  { id: 2, name: 'Flashcard list 2', icon: 'build'  },
  { id: 3, name: 'Flashcard list 3', icon: 'build'  },
];

const FlashcardListScreen = () => {
  const navigation = useNavigation();
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  const { width } = Dimensions.get('window');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <Center>
        {/* Create Flashcard Box */}
        <Pressable
          onPress={() => navigation.navigate('Flashcard')}
          style={({ pressed }) => [
            styles.createBox,
            pressed && styles.createBoxPressed,
            { backgroundColor: colors.primaryContainer, width: width - 400 }
          ]}
        >
          <Center flexDirection="row" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Text style={[styles.createText, { color: colors.onPrimary }]}>Create new list</Text>
            <Icon as={MaterialIcons} name="add" size="lg" color={colors.onPrimary} style={styles.createIcon} />
          </Center>
        </Pressable>

        <VStack>
          {BoxList.map((box) => (
            <Pressable
              key={box.id}
              onPress={() => navigation.navigate('Flashcard', { boxId: box.id })}
              style={({ pressed }) => [
                styles.categoryBox,
                pressed && styles.categoryBoxPressed,
                { backgroundColor: colors.categoriesButton, width: width - 400 }
              ]}
            >
              <Center flexDirection="row" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Text style={[styles.categoryText, { color: colors.onSurface }]}>{box.name}</Text>
                <Icon as={MaterialIcons} name={box.icon} size="md" color={colors.onSurface} style={styles.categoryIcon} />
              </Center>
            </Pressable>
          ))}
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  createBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  createBoxPressed: {
    transform: [{ translateY: -5 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  createText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginRight: 10, // Adjust this margin as needed
  },
  createIcon: {
    marginLeft: 10,
  },
  categoryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
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
    fontSize: 18,
    textAlign: 'left',
    marginRight: 10, // Adjust this margin as needed
  },
  categoryIcon: {
    marginLeft: 10,
  },
});

export default FlashcardListScreen;

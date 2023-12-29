import React from 'react';
import { Button, TextInput, View, Text, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import colors from './Colors';
import SettingsScreen from './Settings';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="settings-outline"
          size={25}
          color={colors.onSurfaceVariant}
          style={{ marginRight: 20 }}
          onPress={() => navigation.navigate('Settings')}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: colors.surface
      }}>
      <TextInput
        style={{ 
          paddingLeft: 10, 
          height: 40, 
          borderColor: colors.onSurfaceVariant, 
          borderWidth: 1, 
          borderRadius: 5,
          width: '80%', 
          marginBottom: 20
        }}
        placeholder="Enter Query"
        onChangeText={setQuery}
        value={query}
      />

      <Pressable
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 5,
          elevation: 3,
          backgroundColor: colors.primaryContainer,
        }}
        title="Go to Settings"
        onPress={() => navigation.navigate('Result', { query })}
      >
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
};

const ResultScreen = ({ route, navigation }) => {
  return (
    <View style={{ 
        flex: 1, 
        alignItems: 
        'center', 
        justifyContent: 'center', 
        backgroundColor: colors.surface
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
        }}>You entered query: {route.params.query}
      </Text>

      <Pressable
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 5,
          elevation: 3,
          backgroundColor: colors.primaryContainer,
        }}
        title="Go back to Home"
        onPress={() => navigation.goBack()}
      >
        <Text>Go back</Text>
      </Pressable>
    </View>
  );
};

export default function App () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

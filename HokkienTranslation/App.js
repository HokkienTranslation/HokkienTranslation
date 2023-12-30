import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import colors from './Colors';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = React.useState('');

  return (
    <View style={{ 
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 10,
        columnGap: 10,
        flexShrink: 0,
        backgroundColor: colors.surface,
      }}>

      {/* Header */}
      <View style={{
        width: '100%',
        height: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        marginRight: 20,
      }}>
        {query.length > 0 &&
          <Ionicons
          name="close-outline"
          size={40}
          color={colors.onPrimaryContainer}
          onPress={() => setQuery('')}
        />
        }

        <Ionicons
          name="settings-outline"
          size={25}
          color={colors.onSurfaceVariant}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
      
      {/* Input */}
      <View style={{
        width: '80%',
        height: '80%',
      }}>
        <TextInput
          style={{ 
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            marginTop: 20,
            borderColor: colors.onSurfaceVariant,
            borderRadius: 5,
            borderWidth: 1,
            height: '100%',
          }}
          placeholder="Enter Query"
          onChangeText={setQuery}
          value={query}
          multiline={true}
        />
      </View>

      {/* Submit Button */}
      {query.length > 0 && (
        <View style={{
          width: '80%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <Ionicons
            name="checkbox"
            size={40}
            color={colors.onPrimaryContainer}
            onPress={() => navigation.navigate('Result', { query })}
          />
        </View>
      )}
    </View>
  );
};

const ResultScreen = ({ route, navigation }) => {
  return (
    <ScrollView
      style={{
        height: '100%',
        width: '100%', 
        backgroundColor: colors.surface,
      }}
      contentContainerStyle={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 10,
        columnGap: 10,
      }}
    >
      {/* Header */}
      <View style={{
        width: '80%',
        height: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 80,
      }}>
        <Ionicons
          name="arrow-back-outline"
          size={40}
          color={colors.onPrimaryContainer}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Query */}
      <View style={{
        width: '80%',
        height: '5%', 
        justifyContent: 'left',
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.onSurfaceVariant,
        }}>Query</Text>
      </View>
      <View style={{
        width: '80%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
        <View style={{
          width: '80%',
          height: '100%',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'light',
            color: colors.onSurfaceVariant,
          }}>
            {route.params.query}
          </Text>
        </View>
        <View style={{
          width: '20%', 
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
          <Ionicons
            name="copy-outline"
            size={20}
            color={colors.onPrimaryContainer}
            // TODO: Implement onPress
            // onPress=
          />
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          width: '80%',
          borderBottomColor: colors.onSurfaceVariant,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      {/* Result */}
      <View style={{
        width: '80%',
        height: '5%', 
        justifyContent: 'left',
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.onSurfaceVariant,
        }}>Translation</Text>
      </View>

      <View style={{
        width: '80%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
        <View style={{
          width: '80%',
          height: '100%',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'light',
            color: colors.onSurfaceVariant,
          }}>
            Translation Output
          </Text>
        </View>
        <View style={{
          width: '20%', 
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
          <Ionicons
            name="copy-outline"
            size={20}
            color={colors.onPrimaryContainer}
            // TODO: Implement onPress
            // onPress=
          />
        </View>
      </View>

      {/* Definition */}
      <View style={{
        width: '80%',
        flexDirection: 'column',
        backgroundColor: colors.primaryContainer,
        padding: 10,
        borderRadius: 10,
        paddingBottom: 20,
        paddingTop: 20,
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.onPrimaryContainer,
        }}>Definition</Text>
        <Text style={{
          fontSize: 20,
          fontWeight: 'light',
          color: colors.onPrimaryContainer,
        }}>
          This is the definition output. 
          The quick brown fox jumps over the lazy dog. 
          The quick brown fox jumps over the lazy dog. 
          This is the definition output. 
          The quick brown fox jumps over the lazy dog. 
          The quick brown fox jumps over the lazy dog. 
        </Text>
      </View>

      {/* Context */}
      <View style={{
        width: '80%',
        flexDirection: 'column',
        backgroundColor: colors.primaryContainer,
        padding: 10,
        borderRadius: 10,
        paddingBottom: 20,
        paddingTop: 20,
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.onPrimaryContainer,
        }}>Context</Text>

        {/* Image */}
        <View style={{
          width: '100%',
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
          <Ionicons
            name="image-outline"
            size={100}
            color={colors.onPrimaryContainer}/>
        </View>

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.onPrimaryContainer,
        }}>
          Example Sentence
        </Text>

        <Text style={{
          paddingTop: 10,
          fontSize: 20,
          fontWeight: 'light',
          color: colors.onPrimaryContainer,
        }}>
          Test Chinese Sentence. 
        </Text>

        <Text style={{
          paddingTop: 10,
          fontSize: 20,
          fontWeight: 'light',
          color: colors.onPrimaryContainer,
        }}>
          Test Pronounciation. 
        </Text>

        {/* Divider */}
        {/* <View
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            width: '100%',
            borderBottomColor: colors.onSurfaceVariant,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        /> */}

        {/* TODO: Fix the layout on the English sentence */}
        {/* <Text style={{
          paddingTop: 10,
          fontSize: 20,
          fontWeight: 'light',
          color: colors.onPrimaryContainer,
        }}>
          Test English Sentence.
        </Text> */}

      </View>

    </ScrollView>
  );
};

const SettingsScreen = ({ navigation }) => {
  const [appearance, setAppearance] = useState('light');

  return (
    <View style={{ 
      height: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
      rowGap: 10,
      columnGap: 10,
      flexShrink: 0,
      backgroundColor: colors.surface,
      paddingLeft: 20,
    }}>
      {/* Header */}
      <View style={{
        width: '100%',
        height: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        marginLeft: 20,
      }}>
        <Ionicons
          name="arrow-back-outline"
          size={40}
          color={colors.onPrimaryContainer}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Appearance section */}
      <View style={{
        marginLeft: 20,
        marginVertical: 10,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 15,
          marginBottom: 10,
        }}>Appearance</Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={() => setAppearance('system')}
        >
          <Ionicons
            name={appearance === 'system' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={appearance === 'system' ? 'blue' : 'grey'}
          />
          <Text style={{
            fontSize: 16,
            marginLeft: 10,
          }}>System default</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={() => setAppearance('light')}
        >
          <Ionicons
            name={appearance === 'light' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={appearance === 'light' ? 'blue' : 'grey'}
          />
          <Text style={{
            fontSize: 16,
            marginLeft: 10,
          }}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            marginLeft: 15,
          }}
          onPress={() => setAppearance('dark')}
        >
          <Ionicons
            name={appearance === 'dark' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={appearance === 'dark' ? 'blue' : 'grey'}
          />
          <Text style={{
            fontSize: 16,
            marginLeft: 10,
          }}>Dark</Text>
        </TouchableOpacity>
      </View>

      {/* TODO: Models section */}
      <View style={{
        marginLeft: 20,
        marginVertical: 10,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginLeft: 15,
          marginBottom: 10,
        }}>Model</Text>
      </View>

      {/* TODO: Versions section */}
    </View>
  );
};

export default function App () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

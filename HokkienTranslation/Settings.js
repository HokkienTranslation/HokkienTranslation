import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from './Colors';

const SettingsScreen = () => {
  const [appearance, setAppearance] = useState('light');

  return (
    <ScrollView style={styles.container}>

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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => setAppearance('system')}
        >
          <Ionicons
            name={appearance === 'system' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={appearance === 'system' ? 'blue' : 'grey'}
          />
          <Text style={styles.optionText}>System default</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => setAppearance('light')}
        >
          <Ionicons
            name={appearance === 'light' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={appearance === 'light' ? 'blue' : 'grey'}
          />
          <Text style={styles.optionText}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => setAppearance('dark')}
        >
          <Ionicons
            name={appearance === 'dark' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={appearance === 'dark' ? 'blue' : 'grey'}
          />
          <Text style={styles.optionText}>Dark</Text>
        </TouchableOpacity>
      </View>

      {/* TODO: Models section */}

      {/* TODO: Versions section */}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 20,
    paddingLeft: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 15,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  // TODO: Add styles for models and versions and other styles needed
});

export default SettingsScreen;

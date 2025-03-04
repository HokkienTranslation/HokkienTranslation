import React from 'react';
import { Text, HStack, IconButton } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import TextToSpeech from './TextToSpeech'; 
import * as Clipboard from "expo-clipboard";
import { useTheme } from '../context/ThemeProvider';

const ExampleSentence = ({ sentence, audio = true }) => {
    const { theme, themes } = useTheme();
    const colors = themes[theme];

    const copyToClipboard = (text) => Clipboard.setString(text);

    return (
        <>
        <Text fontSize="md" fontWeight="bold" color={colors.onSurface} style={{ marginTop: 10 }}>
            Example Sentence
        </Text>
        <HStack>
            <Text fontSize="sm" color={colors.onSurface}>
            {sentence || "No example sentence available."}
            </Text>
            <IconButton
                icon={
                    <Ionicons name="copy-outline" size={15} color={colors.onPrimaryContainer} />
                }
                onPress={() => copyToClipboard(sentence)}
                style={{ marginTop: -6 }}
            />
        </HStack>
        {audio && (
            <HStack alignItems="center" style={{ marginTop: -20 }}>
                <TextToSpeech prompt={sentence} type="sentence" fontSize="sm" />
            </HStack>
        )}
        </>
    );
    };

export default ExampleSentence;
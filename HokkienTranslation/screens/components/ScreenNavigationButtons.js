import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, HStack, Text } from "native-base";
import { useNavigation } from '@react-navigation/native';

const ScreenNavigationButtons = ({ colors }) => {
  const navigation = useNavigation();
  const [isPressedCatButton, setIsPressedCatButton] = useState(false);
  const [isPressedQuizButton, setIsPressedQuizButton] = useState(false);

  return (
    <HStack alignItems="center" justifyContent="space-between" p={4}>
      <Button
        marginRight="auto"
        onPressIn={() => setIsPressedCatButton(true)}
        onPressOut={() => setIsPressedCatButton(false)}
        onPress={() => navigation.goBack()}
        background={colors.primaryContainer}
        _text={{ color: colors.onSurface }}
        borderRadius="21"
      >
        <HStack alignItems="center">
          <Ionicons
            name={"arrow-back-outline"}
            size={17}
            color={colors.onSurface}
          />
          <Text style={{ fontWeight: "bold", marginLeft: 8, color: colors.onSurface }}>
            CATEGORIES
          </Text>
        </HStack>
      </Button>
      <Button
        marginLeft="auto"
        onPressIn={() => setIsPressedQuizButton(true)}
        onPressOut={() => setIsPressedQuizButton(false)}
        onPress={() => navigation.navigate('Quiz')}
        background={colors.primaryContainer}
        _text={{ color: colors.onSurface }}
        borderRadius="21"
      >
        <HStack alignItems="center">
          <Text style={{ fontWeight: "bold", marginLeft: 2, marginRight: 7, color: colors.onSurface }}>
            TEST YOUR ABILITIES
          </Text>
          <Ionicons
            name={"arrow-forward-outline"}
            size={17}
            color={colors.onSurface}
          />
        </HStack>
      </Button>
    </HStack>
  );
};

export default ScreenNavigationButtons;
import React from "react";
import { ImageBackground, Pressable } from "react-native";
import { Box, Image, Text, VStack } from "native-base";
import { CommonActions } from "@react-navigation/native";

const LandingPage = ({ navigation }) => {
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => navigation.navigate("Login")}
      // onPress={() =>
      //   navigation.dispatch(
      //     CommonActions.reset({
      //       index: 0,
      //       routes: [{ name: "Main" }],
      //     })
      //   )
      // }
    >
      <ImageBackground
        source={require("../assets/background.png")}
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <Box
          marginX="20%"
          marginY="5%"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Image source={require("../assets/logo.png")} alt="Logo" size="2xl" />
          <VStack space={2} alignItems="center">
            <Text fontSize="xl" color="gray.400">
              Hokkien Translation & Education Tool
            </Text>
            <Text fontSize="md" color="gray.400">
              Tap anywhere to continue
            </Text>
          </VStack>
        </Box>
      </ImageBackground>
    </Pressable>
  );
};

export default LandingPage;

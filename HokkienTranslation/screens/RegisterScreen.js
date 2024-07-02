import React, { useState } from "react";
// import { ImageBackground, Pressable } from "react-native";
import { Box, Image, Text, VStack, FormControl, Input, Button } from "native-base";
import { CommonActions } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../backend/database/Firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState("");
  
  const registerWithEmail = () => {
    if (password !== passwordConfirmation) {
      setMessage("Passwords don't match!");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      setMessage("Successfully registered!");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setMessage(errorMessage);
      // ..
    });
  }

  return <Box safeArea p="2" py="8" w="90%" maxW="290">
    <VStack space={3} mt="5">
      <FormControl>
        <FormControl.Label>Email</FormControl.Label>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Password</FormControl.Label>
        <Input
          type="password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Password</FormControl.Label>
        <Input
          type="password confirmation"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          placeholder="Enter your password again"
        />
      </FormControl>
      <Button mt="2" colorScheme="indigo" onPress={registerWithEmail}>
        Register
      </Button>
      <Button mt="2" colorScheme="teal" onPress={() => navigation.navigate("Login")}>
        I have an account!
      </Button>
      {message ? <Text mt="2" color="red.500">{message}</Text> : null}
    </VStack>
  </Box>
}
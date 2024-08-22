import React, { useState } from "react";
import { Box, Text, VStack, FormControl, Input, Button } from "native-base";
import { CommonActions } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../backend/database/Firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState("");
  
  const registerWithEmail = async () => {
    if (password !== passwordConfirmation) {
      setMessage("Passwords don't match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the user role in Firestore (here we assume a default role, e.g., 'user')
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
      });

      setMessage("Successfully registered!");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
    } catch (error) {
      const errorMessage = error.message;
      setMessage(errorMessage);
    }
  }

  return (
    <Box safeArea p="2" py="8" w="90%" maxW="290" mx="auto" flex={1} justifyContent="center" alignItems="center">
      <VStack space={3} mt="5" w="100%" alignItems="center">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="5" colorScheme="teal">
          Register Now
        </Text>
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
            type="password"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            placeholder="Enter your password again"
          />
        </FormControl>
        <Button mt="2" colorScheme="indigo" onPress={registerWithEmail} w="100%">
          Register
        </Button>
        <Button mt="2" colorScheme="teal" onPress={() => navigation.navigate("Login")} w="100%">
          I have an account!
        </Button>
        {message ? <Text mt="2" color="red.500">{message}</Text> : null}
      </VStack>
    </Box>
  );
}

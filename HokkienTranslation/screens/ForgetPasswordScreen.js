import React, { useState } from "react";
import { Box, Text, VStack, FormControl, Input, Button } from "native-base";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../backend/database/Firebase";

export default function ForgetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("");
  const sendResetEmail = () => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      setMessage("Password reset email sent!");
    })
    .catch((error) => {
      const errorMessage = error.message;
      setMessage(errorMessage);
    });
  }
  return (
    <Box safeArea p="2" py="8" w="90%" maxW="290" mx="auto" flex={1} justifyContent="center" alignItems="center">
      <VStack space={3} mt="5" w="100%" alignItems="center">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="5" colorScheme="teal">
          Password Reset
        </Text>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />
        </FormControl>
        <Button mt="2" colorScheme="teal" onPress={sendResetEmail} w="100%">
          Send password reset email
        </Button>
        <Button mt="2" colorScheme="teal" onPress={() => navigation.navigate("Login")} w="100%">
          Back to login screen
        </Button>
        {message ? <Text mt="2" color="red.500">{message}</Text> : null}
      </VStack>
    </Box>
  );
}

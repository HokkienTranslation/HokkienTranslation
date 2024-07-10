import React, { useState } from "react";
import { Box, Image, Text, VStack, FormControl, Input, Button } from "native-base";
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
      <Button mt="2" colorScheme="teal" onPress={sendResetEmail}>
        Send password reset email
      </Button>
      <Button mt="2" colorScheme="teal" onPress={() => navigation.navigate("Login")}>
        Back to login screen
      </Button>
      {message ? <Text mt="2" color="red.500">{message}</Text> : null}
    </VStack>
  </Box>
}
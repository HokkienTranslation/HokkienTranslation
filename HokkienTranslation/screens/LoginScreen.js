import React, { useState } from "react";
// import { ImageBackground, Pressable } from "react-native";
import { Box, Image, Text, VStack, FormControl, Input, Button } from "native-base";
import { CommonActions } from "@react-navigation/native";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../backend/database/Firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  
  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setMessage("Successfully logging you in");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      setMessage(errorMessage);
    });
  }

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // const user = result.user;
      setMessage("Successfully logging you in");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      const errorMessage = error.message;
      setMessage(errorMessage);
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
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
      <Button mt="2" colorScheme="indigo" onPress={() => navigation.navigate("Register")}>
        I don't have an account
      </Button>
      <Button mt="2" colorScheme="teal" onPress={loginWithEmail}>
        Login with email
      </Button>
      <Button mt="2" colorScheme="teal" onPress={loginWithGoogle}>
        Login with Google
      </Button>
      {message ? <Text mt="2" color="red.500">{message}</Text> : null}
    </VStack>
  </Box>
}
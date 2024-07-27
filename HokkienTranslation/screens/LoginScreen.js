import React, { useState } from "react";
import { Box, Text, VStack, FormControl, Input, Button } from "native-base";
import { CommonActions } from "@react-navigation/native";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth, getCurrentUser } from "../backend/database/Firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");

  if (getCurrentUser()) {
    navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "Main" }],
    })
  );
  }
  
  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setMessage("Successfully logging you in");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
    })
    .catch((error) => {
      const errorMessage = error.message;
      setMessage(errorMessage);
    });
  }

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;  // Google Access Token that can be used to access the Google API.
      // const user = result.user;
      setMessage("Successfully logging you in");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
    }).catch((error) => {
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

  // onAuthStateChanged(auth, (user) => {
  //   console.log(user)
  //   if (user) {
  //     // navigation.dispatch(
  //     //   CommonActions.reset({
  //     //     index: 0,
  //     //     routes: [{ name: "Main" }],
  //     //   })
  //     // );
  //   } else {
  //     return null;
  //   }
  // });

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
      <Button mt="2" colorScheme="teal" onPress={() => navigation.navigate("ForgetPassword")}>
        Forget my password
      </Button>
      {message ? <Text mt="2" color="red.500">{message}</Text> : null}
    </VStack>
  </Box>
}
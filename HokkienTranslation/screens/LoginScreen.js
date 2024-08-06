import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  FormControl,
  Input,
  Button,
  Pressable,
  HStack,
  Image,
  Divider,
} from "native-base";
import { CommonActions } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../backend/database/Firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: "Main" }],
    //   })
    // );
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Main" }],
          })
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
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
  };

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
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
  };

  return (
    <Box
      safeArea
      p="2"
      py="8"
      w="90%"
      maxW="290"
      mx="auto"
      flex={1}
      justifyContent="center"
    >
      <VStack space={3} mt="5" alignItems="center">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          mb="5"
          colorScheme="teal"
        >
          Welcome Back
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
        <Button mt="2" colorScheme="teal" onPress={loginWithEmail}>
          Login with email
        </Button>
        <HStack alignItems="center" width="100%" mt="4">
          <Divider flex={1} />
          <Text mx="2" fontSize="sm" color="gray.500">
            or
          </Text>
          <Divider flex={1} />
        </HStack>
        <Pressable onPress={loginWithGoogle}>
          <HStack
            alignItems="center"
            mt="2"
            bg="gray.200"
            p="2"
            borderRadius="4"
          >
            <Image
              source={require("../assets/google-icon.png")}
              size="xs"
              mr="2"
              resizeMode="contain"
            />
            <Text color="black" fontSize="sm">
              Continue with Google
            </Text>
          </HStack>
        </Pressable>
        <HStack width="100%" justifyContent="flex-end">
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text color="blue.500" fontSize="10">
              I don't have an account
            </Text>
          </Pressable>
        </HStack>
        <HStack width="100%" justifyContent="flex-end">
          <Pressable onPress={() => navigation.navigate("ForgetPassword")}>
            <Text color="blue.500" fontSize="10">
              Forget my password
            </Text>
          </Pressable>
        </HStack>
        {message ? (
          <Text mt="2" color="red.500">
            {message}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
}

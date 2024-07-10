import React, { useContext } from "react";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../backend/database/Firebase";


const signOut = () => {
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignOut = () => {
    // Clear user data here
    setUser(null);
    // Navigate to the Landing page
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  return <Button onPress={handleSignOut}>Sign Out</Button>;
};

export default signOut;

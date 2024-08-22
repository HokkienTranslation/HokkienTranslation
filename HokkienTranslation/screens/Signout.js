import React, { useContext } from "react";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../backend/database/AuthContext";
import { signOut} from "firebase/auth";
import { auth } from "../backend/database/Firebase";
import { useTheme } from '../screens/context/ThemeProvider';


const SignOut = () => {
  // const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const { theme, themes } = useTheme();
  const colors = themes[theme];

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Navigate to the Landing page
      navigation.reset({
        index: 0,
        routes: [{ name: "Landing" }],
      });
    }).catch((error) => {
      // An error happened.
    });
  };

  return <Button 
            bg={colors.darkerPrimaryContainer }
            _hover={{ bg: colors.evenDarkerPrimaryContainer }} 
            _pressed={{ bg: colors.onPrimaryContainer}}
            _text={{ color: colors.onSurface }}
            onPress={handleSignOut}>Sign Out</Button>;
};

export default SignOut;


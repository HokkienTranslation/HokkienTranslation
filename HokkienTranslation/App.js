import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ResultScreen from "./screens/ResultScreen";
import LandingPage from "./screens/LandingScreen";
import ThemeProvider, { useTheme } from "./screens/context/ThemeProvider";
import { ComponentVisibilityProvider } from "./screens/context/ComponentVisibilityContext";
import FeedbackButton from "./screens/components/FeedbackButton";

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={({ route }) => ({
            headerShown: route.name !== "Landing",
            headerStyle: {
              backgroundColor: colors.header,
            },
            headerTitleStyle: {
              fontSize: 25,
              color: colors.onSurface,
            },
            headerTitleAlign: "center",
            headerTintColor: colors.onSurface,
            headerRight: () => <FeedbackButton />,
          })}
        >
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ComponentVisibilityProvider>
        <AppContent />
      </ComponentVisibilityProvider>
    </ThemeProvider>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ResultScreen from "./screens/ResultScreen";
import LandingPage from "./screens/LandingScreen";
import FlashcardScreen from "./screens/FlashcardScreen";
import CreateFlashcardScreen from "./screens/CreateFlashcardScreen";
import UpdateFlashcardScreen from "./screens/UpdateFlashcardScreen";
import ThemeProvider, { useTheme } from "./screens/context/ThemeProvider";
import { ComponentVisibilityProvider } from "./screens/context/ComponentVisibilityContext";
import FeedbackButton from "./screens/components/FeedbackButton";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  return (
    <Stack.Navigator
      initialRouteName="Home"
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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const FlashcardStackNavigator = () => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  return (
    <Stack.Navigator
      initialRouteName="Flashcard"
      screenOptions={{
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
        headerLeft: () => {return null;}, // removing back arrow
      }}
    >
      <Stack.Screen 
        name="Flashcard" 
        component={FlashcardScreen} 
        options={{ title: "" }}
        />
      <Stack.Screen
        name="CreateFlashcard"
        component={CreateFlashcardScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="UpdateFlashcard"
        component={UpdateFlashcardScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Flashcard") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurface,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen name="Flashcard" component={FlashcardStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { themes, theme } = useTheme();
  const colors = themes[theme];

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
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

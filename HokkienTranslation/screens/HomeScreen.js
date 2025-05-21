import React, {useState, useEffect} from "react";
import {Ionicons} from "@expo/vector-icons";
import {
    Box,
    Input,
    IconButton,
    ScrollView,
    VStack,
    Button,
    Wrap,
    Flex,
    Text,
} from "native-base";
import {useTheme} from "./context/ThemeProvider";
import {collection, getDocs} from "firebase/firestore";
import {db, auth} from "../backend/database/Firebase";
import QuickInputWords from "./components/QuickInputWords";
import getCurrentUser from "../backend/database/GetCurrentUser";
import {useRegisterAndStoreToken} from "../backend/database/RegisterAndStoreToken";
import {useFocusEffect} from "@react-navigation/native";
import {useLocalNotifications} from "../backend/notifications/useLocalNotifications";

export default function HomeScreen({navigation}) {
    const [queryText, setQueryText] = useState("");
    const [randomInputs, setRandomInputs] = useState([]);
    const {theme, themes} = useTheme();
    const colors = themes[theme];
    const [userCred, setUserCred] = useState(null);

    const {
        scheduleFlashcardQuiz,
        scheduleInactivityReminder,
        cancelScheduledNotification
    } = useLocalNotifications();

    // console.log("Current User: ", getCurrentUser());

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            // Create a structure similar to UserCredential
            setUserCred({
                user: currentUser
            });
            console.log("Current user set in HomeScreen:", currentUser.uid);
        }
    }, []);

    // Register push token when user is available
    const token = useRegisterAndStoreToken(userCred);

    // Log when token is successfully registered
    useEffect(() => {
        if (token && userCred) {
            console.log("Token registered in HomeScreen:", token.data);
        }
    }, [token, userCred]);

    useFocusEffect(
        React.useCallback(() => {
            console.log("HomeScreen is focused, setting up inactivity reminder");

            // Schedule inactivity reminder when screen comes into focus
            // This will trigger a notification after 120 seconds (2 minutes) of inactivity
            scheduleInactivityReminder(15);

            // Clean up function that runs when screen loses focus
            return () => {
                console.log("HomeScreen is unfocused, cleaning up");
                // You might want to cancel any pending notifications when leaving the screen
                // This depends on your app's requirements
            };
        }, [])
    );

    const handleTextChange = (text) => {
        // Reset inactivity timer when user types
        scheduleInactivityReminder(15);
        const cleanedText = text.replace(/\n/, "");
        setQueryText(cleanedText);
    };

    const fetchRandomInputs = async () => {
        try {
            const translationCollection = collection(db, "translation");
            const querySnapshot = await getDocs(translationCollection);
            const inputs = querySnapshot.docs.map((doc) => doc.data().englishInput);
            setRandomInputs(inputs.sort(() => 0.5 - Math.random()).slice(0, 5));
        } catch (error) {
            console.error("Error fetching random inputs: ", error);
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    useEffect(() => {
        fetchRandomInputs();
    }, []);

    return (
        <ScrollView
            bg={colors.surface}
            flex={1}
            contentContainerStyle={{alignItems: "center"}}
        >
            <VStack space={4} alignItems="center" w="100%" mt={5}>
                {/* Header */}
                <Box
                    w="80%"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <IconButton
                        icon={
                            <Ionicons
                                name="settings-outline"
                                size={25}
                                color={colors.onSurfaceVariant}
                            />
                        }
                        _hover={{bg: "transparent"}}
                        _pressed={{bg: "transparent"}}
                        onPress={() => navigation.navigate("Settings")}
                    />
                </Box>

                {/* Random Words and Input Box */}
                <Box w="80%">
                    <QuickInputWords
                        label="Try:"
                        words={randomInputs}
                        onWordPress={setQueryText}
                    />
                    {/* Input */}
                    <Box position="relative" mt={3}>
                        <Input
                            variant="outline"
                            placeholder="Type English or Chinese..."
                            onChangeText={handleTextChange}
                            value={queryText}
                            multiline={true}
                            h={40}
                            paddingX={1}
                            paddingY={2}
                            style={{
                                fontSize: 20,
                                color: colors.onSurface,
                            }}
                        />
                        {queryText.length > 0 && (
                            <IconButton
                                icon={
                                    <Ionicons
                                        name="close-outline"
                                        size={30}
                                        color={colors.onSurfaceVariant}
                                    />
                                }
                                position="absolute"
                                top={0}
                                right={0}
                                _hover={{bg: "transparent"}}
                                _pressed={{bg: "transparent"}}
                                onPress={() => setQueryText("")}
                            />
                        )}
                    </Box>
                </Box>

                {/* Submit Button */}
                {queryText.length > 0 && (
                    <Box w="80%" flexDirection="row" justifyContent="flex-end">
                        <IconButton
                            icon={
                                <Ionicons
                                    name="checkbox"
                                    size={40}
                                    color={colors.onPrimaryContainer}
                                />
                            }
                            onPress={() =>
                                navigation.navigate("Result", {query: queryText})
                            }
                            _hover={{bg: "transparent"}}
                            _pressed={{bg: "transparent"}}
                        />
                    </Box>
                )}
            </VStack>
        </ScrollView>
    );
}

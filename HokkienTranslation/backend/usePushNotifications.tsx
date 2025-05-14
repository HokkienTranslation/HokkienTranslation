import {useState, useRef, useEffect} from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {Platform} from "react-native";

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => (
            {
                shouldPlaySound: false,
                shouldShowAlert: true,
                shouldSetBadge: false,
            })
    })

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    async function registerForPushNotificationsAsync() {
        console.log("Starting push notification registration");
        let token;

        if (Device.isDevice) {
            console.log("Running on physical device");
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            console.log("Existing permission status:", existingStatus);

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                console.log("Requesting permissions...");
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                console.log("New permission status:", finalStatus);
            }

            if (finalStatus !== "granted") {
                console.log("Permission denied");
                alert("Failed to get push token for push notification!");
                return undefined;
            }

            console.log("Permissions granted, getting token...");
            console.log("Project ID:", Constants.expoConfig?.extra?.eas?.projectId);

            try {
                token = await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig?.extra?.eas?.projectId,
                });
                console.log("Token successfully generated:", token);
                return token;
            } catch (error) {
                console.error("Error getting push token:", error);
                return undefined;
            }
        } else {
            console.log("Not a physical device");
            return undefined;
        }
    }


    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        })

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            })

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            })

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current!
            )
            Notifications.removeNotificationSubscription(responseListener.current!);
        }
    }, []);

    return {expoPushToken, notification};
}

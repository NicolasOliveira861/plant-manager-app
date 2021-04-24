import React, { useEffect } from "react";
import Routes from "./src/routes";
import AppLoading from "expo-app-loading";
import * as Notifications from "expo-notifications";
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";
import { Text } from "react-native";
import { PlantProps } from "./src/libs/storage";

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
      }
    );

    return () => subscription.remove();

    // async function notifications() {
    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log("#### NOTIFICAÇÕES AGENDADAS ####");
    //   console.log(data);
    // }

    // notifications();
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  return <Routes />;
}

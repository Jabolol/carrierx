import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(info)/parcel"
            options={{ headerShown: true, headerTitle: "Parcel List" }}
          />
          <Stack.Screen
            name="(delivery)/items"
            options={{ headerShown: true, headerTitle: "Item List" }}
          />
          <Stack.Screen
            name="(delivery)/carrier"
            options={{
              presentation: "modal",
              headerTitle: "Carrier Information",
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              headerTitle: "Parcel & Carrier Information",
            }}
          />
          <Stack.Screen
            name="camera"
            options={{
              presentation: "modal",
              headerTitle: "BarCode scanner",
            }}
          />
        </Stack>
      </ThemeProvider>
    </>
  );
}

import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "AlbertSans-Regular": require("../assets/fonts/AlbertSans/AlbertSans-Regular.ttf"),
    "AlbertSans-Medium": require("../assets/fonts/AlbertSans/AlbertSans-Medium.ttf"),
    "AlbertSans-SemiBold": require("../assets/fonts/AlbertSans/AlbertSans-SemiBold.ttf"),
    "AlbertSans-Bold": require("../assets/fonts/AlbertSans/AlbertSans-Bold.ttf"),
    "Quicksand-Bold": require("../assets/fonts/Quicksand/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand/Quicksand-Medium.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand/Quicksand-SemiBold.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand/Quicksand-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function AppSafeArea({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingBottom: insets.bottom + 8,
        },
      ]}
    >
      {children}
    </View>
  );
}

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

  return (
    <SafeAreaProvider>
      <AppSafeArea>
        <Stack screenOptions={{ headerShown: false }} />
      </AppSafeArea>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
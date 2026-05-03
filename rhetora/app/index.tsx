import { useFonts } from "expo-font";
import { Text, View } from "react-native";

import BgMotif from "../assets/images/bg-motif.svg";
import LogoRhetora from "../assets/images/logorhetora.svg";

export default function Index() {
  const [fontsLoaded] = useFonts({
    "AlbertSans-Regular": require("../assets/fonts/AlbertSans/AlbertSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingHorizontal: 24,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <LogoRhetora width={220} height={220} />
        <Text
          style={{
            fontFamily: "AlbertSans-Regular",
            fontSize: 18,
            color: "#2a2a2a",
            letterSpacing: 0.2,
            textAlign: "center",
          }}
        >
          Train Your Voice. Shape Your Ideas
        </Text>
      </View>
    </View>
  );
}

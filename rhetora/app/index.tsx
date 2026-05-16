import { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const logoRhetora = require("../assets/images/logorhetora.png");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [router]);

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
        <Image
          source={logoRhetora}
          style={{ width: 220, height: 220 }}
          resizeMode="contain"
        />

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
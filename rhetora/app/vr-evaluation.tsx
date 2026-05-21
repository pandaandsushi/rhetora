import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function VrEvaluation() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Evaluation</Text>
      <Text style={styles.subtitle}>Coming soon</Text>

      <Pressable style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B0B0B",
    paddingHorizontal: 24,
    gap: 14,
  },
  title: {
    fontSize: 26,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#B3B3B3",
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    color: "#0B0B0B",
    fontSize: 14,
  },
});

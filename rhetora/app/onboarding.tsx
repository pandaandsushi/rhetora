import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";

import { Colors } from "../constants/colors";

const steps = [
  {
    key: "voice",
    image: require("../assets/images/onboarding/onboarding-1.png"),
    title: "Find Your Voice.\nSpeak with Confidence.",
    description:
      "Practice public speaking anytime, anywhere.\nGet instant feedback and improve step by step.",
    cta: "Next",
  },
  {
    key: "feedback",
    image: require("../assets/images/onboarding/onboarding-2.png"),
    title: "Get Clear,\nActionable Feedback",
    description:
      "Understand how you speak.\nReceive insights on clarity, structure,\nand delivery.",
    cta: "Next",
  },
  {
    key: "practice",
    image: require("../assets/images/onboarding/onboarding-3.png"),
    title: "Practice in\nYour Own Style",
    description:
      "Choose quick exercises or follow a guided\njourney. Train at your pace, based on your goals.",
    cta: "Get Started",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const step = useMemo(() => steps[stepIndex], [stepIndex]);
  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push("/home");
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-motif.png")}
      style={styles.screen}
      resizeMode="cover"
    >
      <Pressable style={styles.skipButton} onPress={() => router.push("/home")}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.imageContainer}>
        <Image source={step.image} style={styles.heroImage} />
      </View>

      <View style={styles.card}>
        <View style={styles.textGroup}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.subtitle}>{step.description}</Text>

          <View style={styles.dotsRow}>
            {steps.map((item, index) => (
              <View
                key={item.key}
                style={[styles.dot, index === stepIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{step.cta}</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
    justifyContent: "space-between",
  },
  skipButton: {
    position: "absolute",
    top: 54,
    right: 24,
    zIndex: 2,
  },
  skipText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 60,
  },
  heroImage: {
    width: "100%",
    maxHeight: 420,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: Colors.warning[50],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
  },
  textGroup: {
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    textAlign: "center",
    color: Colors.octonary.DEFAULT,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 15,
    textAlign: "center",
    color: Colors.neutral[600],
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.neutral[300],
  },
  dotActive: {
    backgroundColor: Colors.senary[300],
  },
  button: {
    width: "100%",
    marginTop: 44,
    backgroundColor: Colors.senary[300],
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
});

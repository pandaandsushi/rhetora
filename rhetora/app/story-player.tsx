import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopHeader from "@/components/top-header";
import { Colors } from "../constants/colors";
const storyScenes = [
  {
    id: 1,
    background: require("../assets/images/storymode/bg/bg-bedroom.png"),
    character: require("../assets/images/storymode/ch1/mia-nervous.png"),
    text: "Tomorrow is Mia's first day at university. She's been looking forward to it, but can't help to not feeling nervous.",
    isFinal: false,
  },
  {
    id: 2,
    background: require("../assets/images/storymode/bg/bg-bedroom.png"),
    character: require("../assets/images/storymode/ch1/mia-nervous.png"),
    text: "She did not know anyone there, as the university is far from her home anyway. And socializing is not her forte.",
    isFinal: false,
  },
  {
    id: 3,
    background: require("../assets/images/storymode/bg/bg-bedroom.png"),
    character: require("../assets/images/storymode/ch1/mia-mirror-casual.png"),
    text: "Tonight she tried to prepared herself by practicing in front of the mirror. Maybe it can help, she thinks to herself.",
    isFinal: false,
  },
  {
    id: 4,
    background: require("../assets/images/storymode/bg/bg-bedroom.png"),
    character: require("../assets/images/storymode/ch1/mia-mirror-suit.png"),
    text: "Morning comes, Mia takes a shower, prepare her outfit and bag, comb her hair, and make sure all looks good. Let's go!",
    isFinal: false,
  },
  {
    id: 5,
    background: require("../assets/images/storymode/bg/bg-classroom.png"),
    character: require("../assets/images/storymode/ch1/first-day.png"),
    text: "Today first class is Calculus but since it’s the first day, Ms. Ann wants everyone to introduce themselves in front of the room.",
    isFinal: false,
  },
  {
    id: 6,
    background: require("../assets/images/storymode/bg/bg-classroom.png"),
    character: require("../assets/images/storymode/ch1/mia-classroom-mic.png"),
    text: "Alright! It's your turn now, Mia! Mia walks to the front of the room. Time to introduce herself!",
    isFinal: true,
  },
];

export default function StoryPlayer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const scene = storyScenes[currentStep];

  const handleNext = () => {
    if (currentStep < storyScenes.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };


  const handleSkip = () => router.push("/story-recap");

  return (
    <View style={styles.screen}>
      <ImageBackground source={scene.background} style={styles.background} resizeMode="cover">
        {scene.character && <Image source={scene.character} style={styles.character} />}

        <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
          <TopHeader
            title="" 
            variant="transparent"
            onBack={() => router.back()}
            rightElement={
              <Pressable onPress={handleSkip} hitSlop={10}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            }
          />

          <Pressable style={styles.tapArea} onPress={handleNext} disabled={scene.isFinal}>
            <View style={styles.textBox}>
              <Text style={styles.storyText}>{scene.text}</Text>
              {scene.isFinal ? (
                <Pressable style={styles.startButton} onPress={() => router.push("/story-recap")}>
                  <Text style={styles.startButtonText}>Start</Text>
                </Pressable>
              ) : (
                <Text style={styles.tapToContinue}>Tap to continue</Text>
              )}
            </View>
          </Pressable>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  character: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    width: "130%",
    resizeMode: "contain",
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skipText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  tapArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  textBox: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "100%",
    alignItems: "center",
    gap: 30,
  },
  storyText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 24,
  },
  tapToContinue: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: "center",
  },
  startButton: {
    backgroundColor: Colors.senary[300],
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  startButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
});
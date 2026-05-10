import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-motif.png");
const eventImage = require("../assets/images/homepage/event1.png");
const storyModeImage = require("../assets/images/homepage/story-mode.png");
const casualModeImage = require("../assets/images/homepage/casual-mode.png");
const vrModeImage = require("../assets/images/homepage/vrmode.png");

export default function Practice() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <TopHeader title="Let's Practice!" onBack={() => router.back()} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Limited Time Story!</Text>
            </View>

            <Pressable style={styles.eventCard} onPress={() => router.push("/event")}>
              <Image source={eventImage} style={styles.eventImage} />
              <View style={styles.eventLabelWrap}>
                <Text style={styles.eventChapter}>Chapter 1</Text>
                <Text style={styles.eventTitle}>First Day at Work</Text>
              </View>
              <View style={styles.eventBadge}>
                <Ionicons name="time-outline" size={14} color={Colors.octonary.DEFAULT} />
                <Text style={styles.eventBadgeText}>1D 20:54:18 left</Text>
              </View>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Main Mode</Text>
            </View>

            <Pressable
              style={styles.modeCard}
              onPress={() => router.push("/story-mode")}
            >
              <Image source={storyModeImage} style={styles.modeImage} />
              <Text style={styles.modeLabel}>Story Mode</Text>
            </Pressable>

            <Pressable
              style={styles.modeCard}
              onPress={() => router.push("/casual-mode")}
            >
              <Image source={casualModeImage} style={styles.modeImage} />
              <Text style={styles.modeLabel}>Casual Mode</Text>
            </Pressable>

            <Pressable
              style={styles.modeCard}
              onPress={() => router.push("/vr-mode")}
            >
              <Image source={vrModeImage} style={styles.modeImage} />
              <Text style={styles.VRLabel}>VR Mode</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="practice" />
        </View>
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
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 130,
    gap: 18,
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  eventCard: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  eventLabelWrap: {
    position: "absolute",
    left: 16,
    top: 12,
  },
  eventChapter: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.shade[100],
  },
  eventTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[100],
  },
  eventBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFF4C2",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventBadgeText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  modeCard: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    overflow: "hidden",
  },
  modeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  modeLabel: {
    position: "absolute",
    top: 12,
    right: 14,
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[100],
  },
  VRLabel: {
    position: "absolute",
    top: 12,
    right: 14,
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
  },
});

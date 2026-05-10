import { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const episodeOneImage = require("../assets/images/storymode/eps1.png");

export default function PracticeSession() {
  const router = useRouter();
  const [tipsExpanded, setTipsExpanded] = useState(true);

  const toggleTips = () => {
    setTipsExpanded(!tipsExpanded);
  };

  return (
    <View style={styles.screen}>
      {/* SafeAreaView is styled with the red background so the 
        status bar area matches the solid TopHeader 
      */}
      <SafeAreaView style={styles.topSafeArea}>
        <TopHeader
          title="A Fresh Start"
          description="The First Introduction"
          variant="solid"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <Image source={episodeOneImage} style={styles.heroImage} />
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title}>A Fresh Start</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={18} color={Colors.neutral[500]} />
              <Text style={styles.statText}>10 min(s)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people" size={18} color={Colors.neutral[500]} />
              <Text style={styles.statText}>10.2k finished</Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            This is your first day on college! You are readying yourself in front
            of a mirror to introduce yourself in front of the others.
          </Text>

          <Text style={styles.paragraph}>
            You want to make a good first impression—but where do you start?
          </Text>

          <Pressable style={styles.tipsCard} onPress={toggleTips}>
            <View style={styles.tipsHeader}>
              <View style={styles.tipsHeaderLeft}>
                <Ionicons
                  name="bulb-outline"
                  size={24}
                  color={Colors.octonary.DEFAULT}
                />
                <Text style={styles.tipsTitle}>Quick Tips</Text>
              </View>
              <Ionicons
                name={tipsExpanded ? "caret-down" : "caret-forward"}
                size={20}
                color={Colors.octonary.DEFAULT}
              />
            </View>

            {tipsExpanded && (
              <View style={styles.tipsBody}>
                <View style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>
                    Start with your name and something simple about yourself
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>
                    Keep your sentences short and clear
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>
                    Don't worry about being perfect—just be natural!
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.nextButton}
          onPress={() => {
            router.push("/practice-setup");}}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
        <Text style={styles.footerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.footerTextBold}>My Recordings</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  topSafeArea: {
    backgroundColor: Colors.senary[300], // Matches TopHeader solid variant
  },
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroWrapper: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  heroImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  textContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: Colors.octonary.DEFAULT,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.neutral[600],
  },
  statDivider: {
    width: 2,
    height: 16,
    backgroundColor: Colors.neutral[400],
    marginHorizontal: 12,
  },
  paragraph: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: Colors.octonary.DEFAULT,
    marginBottom: 16,
  },
  tipsCard: {
    marginTop: 10,
    backgroundColor: Colors.warning[200], // Using the yellow shade from constants
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tipsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipsTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  tipsBody: {
    marginTop: 16,
    gap: 6,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletPoint: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32, // Extra padding for the home indicator
    backgroundColor: Colors.shade[200],
  },
  nextButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  nextButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  footerText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    textAlign: "center",
    color: Colors.octonary.DEFAULT,
  },
  footerTextBold: {
    fontFamily: "AlbertSans-Bold",
  },
});
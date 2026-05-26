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

const episodeImage = require("../assets/images/storymode/eps1.png");

export default function StoryRecap() {
  const router = useRouter();
  const [tipsCollapsed, setTipsCollapsed] = useState(false);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topSafeArea}>
        <TopHeader
          title="A Fresh Start"
          description="The First Introduction"
          variant="solid"
          onBack={() => router.back()}
        />
      </SafeAreaView>

        <View style={styles.imageCard}>
          <Image source={episodeImage} style={styles.episodeImage} />
        </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.infoSection}>
          <Text style={styles.title}>A Fresh Start</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={Colors.neutral[500]} />
              <Text style={styles.statText}>3 min(s)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={Colors.neutral[500]} />
              <Text style={styles.statText}>10.2k finished</Text>
            </View>
          </View>
        </View>

        <View style={styles.storyCard}>
          <Text style={styles.storyText}>
            This is your first day in college! You are readying yourself in front of a mirror
            to introduce yourself in front of the others.
          </Text>
          <Text style={styles.storyText}>
            You want to make a good first impression--{"\n"}but where do you start?
          </Text>
        </View>

        <Pressable
          style={styles.quickTips}
          onPress={() => setTipsCollapsed((prev) => !prev)}
        >
          <View style={styles.quickTipsHeader}>
            <View style={styles.quickTipsLeft}>
              <Ionicons name="bulb" size={20} color={Colors.octonary.DEFAULT} />
              <Text style={styles.quickTipsTitle}>Quick Tips</Text>
            </View>
            <Ionicons
              name={tipsCollapsed ? "chevron-down" : "chevron-up"}
              size={18}
              color={Colors.octonary.DEFAULT}
            />
          </View>
          {!tipsCollapsed && (
            <View style={styles.quickTipsBody}>
              <View style={styles.quickTipsRow}>
                <Text style={styles.quickTipsBullet}>-</Text>
                <Text style={styles.quickTipsText}>
                  Start with your name and something simple about yourself
                </Text>
              </View>
              <View style={styles.quickTipsRow}>
                <Text style={styles.quickTipsBullet}>-</Text>
                <Text style={styles.quickTipsText}>
                  Keep your sentences short and clear
                </Text>
              </View>
              <View style={styles.quickTipsRow}>
                <Text style={styles.quickTipsBullet}>-</Text>
                <Text style={styles.quickTipsText}>
                  Don't worry about being perfect--just be natural!
                </Text>
              </View>
            </View>
          )}
        </Pressable>

        <Pressable
          style={styles.nextButton}
          onPress={() => router.push("/practice-setup")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>

        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  topSafeArea: {
    backgroundColor: Colors.senary[300],
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 18,
  },
  imageCard: {
    overflow: "hidden",
    backgroundColor: Colors.shade[200],
  },
  episodeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoSection: {
    gap: 10,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
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
  storyCard: {
    gap: 10,
  },
  storyText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  quickTips: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.warning[100],
    padding: 16,
    marginBottom: 70,
    gap: 10,
  },
  quickTipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quickTipsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quickTipsTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  quickTipsBody: {
    gap: 8,
  },
  quickTipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickTipsBullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  quickTipsText: {
    flex: 1,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  nextButton: {
    marginTop: 4,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  disclaimerText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  disclaimerBold: {
    fontFamily: "AlbertSans-Bold",
  },
});

import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "../constants/colors";
import TopHeader from "../components/top-header";

const bgImage = require("../assets/images/storymode/bg/bg-bedroom.png");

const fallbackEvaluation = {
  mode: "storytelling",
  genre: "general",
  storyScore: 82,
  wordRatePerMinute: 132,
  storyRecap: [
    "Set the scene with a mysterious hallway and flickering lights.",
    "Built tension by describing the quiet figure outside the window.",
    "Ended with an unresolved moment to keep the audience curious.",
  ],
  whatYouDidWell: [
    "Created a clear setting with sensory details.",
    "Kept the pacing steady and suspenseful.",
    "Used short sentences to emphasize tension.",
  ],
  structureAnalysis: [
    {
      title: "Hook",
      description: "The first line establishes intrigue and a strong visual.",
    },
    {
      title: "Build",
      description: "Each sentence adds a new layer of suspense without rushing.",
    },
    {
      title: "Cliffhanger",
      description: "You leave the audience wanting the next turn.",
    },
  ],
  recommendedActions: [
    "Add a character action to heighten urgency.",
    "Introduce one specific sound to sharpen the atmosphere.",
    "End with a question to invite the next response.",
  ],
};

type StorytellingEvaluation = typeof fallbackEvaluation;

export default function StorytellingEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();

  const evaluation = useMemo<StorytellingEvaluation>(() => {
    if (!params.data) {
      return fallbackEvaluation;
    }
    try {
      return JSON.parse(params.data);
    } catch {
      return fallbackEvaluation;
    }
  }, [params.data]);

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Storytelling Evaluation"
        variant="transparent"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.genreLabel}>Genre</Text>
        <Text style={styles.genreValue}>{evaluation.genre}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Story Score</Text>
            <Text style={styles.summaryValue}>{evaluation.storyScore}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Word Rate</Text>
            <Text style={styles.summaryValue}>
              {evaluation.wordRatePerMinute}
              <Text style={styles.summaryUnit}>/min</Text>
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Story Recap</Text>
          {evaluation.storyRecap.map((line) => (
            <View key={line} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.sectionBody}>{line}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>What You Did Well</Text>
          {evaluation.whatYouDidWell.map((line) => (
            <View key={line} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.sectionBody}>{line}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Structure Analysis</Text>
          {evaluation.structureAnalysis.map((item) => (
            <View key={item.title} style={styles.analysisRow}>
              <Text style={styles.analysisTitle}>{item.title}</Text>
              <Text style={styles.sectionBody}>{item.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recommended Actions</Text>
          {evaluation.recommendedActions.map((action) => (
            <View key={action} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.sectionBody}>{action}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={() => router.replace("/home")}>
          <Text style={styles.primaryButtonText}>Okay</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  genreLabel: {
    textAlign: "center",
    fontFamily: "AlbertSans-Medium",
    fontSize: 14,
    color: Colors.shade[100],
  },
  genreValue: {
    textAlign: "center",
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    marginBottom: 6,
  },
  summaryCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  summaryStat: {
    alignItems: "center",
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.shade[100],
  },
  summaryLabel: {
    fontFamily: "AlbertSans-Medium",
    fontSize: 13,
    color: Colors.shade[100],
  },
  summaryValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: Colors.octonary.DEFAULT,
    marginTop: 4,
  },
  summaryUnit: {
    fontSize: 12,
    color: Colors.shade[100],
  },
  sectionCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  sectionBody: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
    flex: 1,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 16,
    color: Colors.quinary[300],
  },
  analysisRow: {
    gap: 4,
  },
  analysisTitle: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.quinary[300],
  },
  primaryButton: {
    backgroundColor: Colors.quinary[300],
    borderRadius: 999,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
});

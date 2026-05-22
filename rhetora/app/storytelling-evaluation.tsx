import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CollapsibleSection from "../components/collapsible-section";
import { Colors } from "../constants/colors";
import TopHeader from "../components/top-header";
import SkillRadar from "../components/skill-radar";

const bgImage = require("../assets/images/bg-motif.png");

const fallbackEvaluation = {
  mode: "storytelling",
  genre: "general",
  storyScore: 80,
  wordRatePerMinute: 8,
  quickSummary:
    "You continued the horror story by having the character look for a light source and a weapon, which is a logical response to the situation. The story flowed well and maintained the suspenseful atmosphere. To improve, you can add more descriptive details and emotional depth to make the scene more immersive.",
  skillBreakdown: [
    {
      skill: "Fluency",
      score: 76,
      level: "Good",
      reason:
        "Your continuation was understandable and moved forward without major confusion. However, the delivery could feel smoother if you reduce hesitation and connect your actions with clearer transitions.",
      improvementTip:
        "Use short transition phrases such as 'after that', 'suddenly', or 'because of that' to make the story flow more naturally.",
    },
    {
      skill: "Critical Thinking",
      score: 84,
      level: "Good",
      reason:
        "You responded logically to the situation by looking for a light source and something to protect yourself. This shows that you understood the problem in the scene and made a realistic decision.",
      improvementTip:
        "Try adding the character's reasoning more explicitly, such as why they choose one path or what risk they are considering.",
    },
    {
      skill: "Structure",
      score: 80,
      level: "Good",
      reason:
        "Your story follows a clear sequence from noticing the figure, finding a candle, and discovering the three-branch pathway. The events are connected, but the story could benefit from a stronger build-up between each moment.",
      improvementTip:
        "Before introducing a new event, briefly describe the setting or emotion to make the transition feel more complete.",
    },
  ],
  storyRecap: {
    items: [
      {
        speaker: "ai",
        text: "The lights flickered as you walked down the empty hallway. From your room window, you saw a figure standing still, staring directly at you...",
      },
      {
        speaker: "user",
        text: "I immediately tried to find a light source to see better and find a weapon just in case.",
      },
      {
        speaker: "ai",
        text: "You found a candle and went to check outside, only to realize that the figure was a sign leading to a three-branch pathway.",
      },
    ],
  },
  overallFeedback: {
    title: "You created a clear and logical horror continuation.",
    summary:
      "Your response continued the story in a way that made sense and kept the scene moving. You made realistic decisions for the character, especially by looking for light and protection. To make the story more engaging, you can add more sensory details, emotion, and suspense before moving to the next event.",
  },
  whatYouDidWell: [
    "You continued the story directly from the AI prompt.",
    "Your actions were logical and easy to follow.",
    "You maintained the horror atmosphere.",
    "You gave the character a clear immediate goal.",
  ],
  structureAnalysis: [
    {
      title: "Continuation from prompt",
      description:
        "You responded directly to the dark hallway and mysterious figure, so the story stayed connected to the original situation.",
    },
    {
      title: "Action taken",
      description:
        "Looking for a light source and a weapon is a realistic response in a tense situation.",
    },
    {
      title: "Atmosphere development",
      description:
        "The scene could be stronger if you described what the character heard, saw, or felt while moving through the hallway.",
    },
    {
      title: "Emotional depth",
      description:
        "The character's fear, hesitation, or curiosity could be explored more to make the story feel more immersive.",
    },
  ],
  recommendedActions: [
    {
      title: "Add descriptive details",
      description:
        "Instead of only stating actions, describe what the character sees, hears, or feels to make the scene more vivid.",
    },
    {
      title: "Build tension gradually",
      description:
        "Slow down important moments before revealing what happens next. This helps create suspense.",
    },
    {
      title: "Express emotion",
      description:
        "Include the character's fear, confusion, or curiosity so the audience can connect more with the story.",
    },
  ],
};

type StorytellingEvaluation = typeof fallbackEvaluation;

export default function StorytellingEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);

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

  const safeEvaluation = useMemo(() => {
    const skillBreakdown = Array.isArray(evaluation.skillBreakdown)
      ? evaluation.skillBreakdown
      : [];
    const storyRecapItems = Array.isArray(evaluation.storyRecap?.items)
      ? evaluation.storyRecap.items
      : [];
    const recommendedActions = Array.isArray(evaluation.recommendedActions)
      ? evaluation.recommendedActions
      : [];
    const whatYouDidWell = Array.isArray(evaluation.whatYouDidWell)
      ? evaluation.whatYouDidWell
      : [];
    const structureAnalysis = Array.isArray(evaluation.structureAnalysis)
      ? evaluation.structureAnalysis
      : [];

    return {
      ...fallbackEvaluation,
      ...evaluation,
      skillBreakdown,
      storyRecap: { items: storyRecapItems },
      recommendedActions,
      whatYouDidWell,
      structureAnalysis,
    };
  }, [evaluation]);

  const skillLabels = useMemo(
    () => safeEvaluation.skillBreakdown.map((skill) => skill.skill),
    [safeEvaluation.skillBreakdown]
  );
  const skillScores = useMemo(
    () => safeEvaluation.skillBreakdown.map((skill) => skill.score),
    [safeEvaluation.skillBreakdown]
  );
  const storyScore = useMemo(() => {
    if (!safeEvaluation.skillBreakdown.length) {
      return safeEvaluation.storyScore;
    }
    const total = safeEvaluation.skillBreakdown.reduce((sum, skill) => sum + skill.score, 0);
    return Math.round(total / safeEvaluation.skillBreakdown.length);
  }, [safeEvaluation.skillBreakdown, safeEvaluation.storyScore]);

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Storytelling Evaluation"
        variant="transparent"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.genreLabel}>Genre</Text>
        <Text style={styles.genreValue}>{safeEvaluation.genre}</Text>

        <View style={styles.mediaCard}>
          <View style={styles.mediaPlayButton}>
            <Ionicons name="play" size={26} color={Colors.shade[200]} />
          </View>
        </View>

        <CollapsibleSection
            title="Quick Summary"
            headerStyle={styles.quickSummaryHeader}
            contentStyle={styles.quickSummaryContent}
            >
            <Text style={styles.quickSummaryText}>{safeEvaluation.quickSummary}</Text>
        </CollapsibleSection>

        <View style={styles.summaryCard}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Story Score</Text>
            <Text style={styles.summaryValue}>
              {storyScore}
              <Text style={styles.summaryUnit}>/100</Text>
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Word Rate</Text>
            <Text style={styles.summaryValue}>
              {safeEvaluation.wordRatePerMinute}
              <Text style={styles.summaryUnit}>/minute</Text>
            </Text>
          </View>
        </View>

        <Pressable style={styles.skillHeader} onPress={() => setSkillsModalOpen(true)}>
          <Text style={styles.sectionTitle}>Skill Breakdown</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.octonary.DEFAULT} />
        </Pressable>

        <View style={styles.skillCard}>
          <SkillRadar labels={skillLabels} values={skillScores} size={220} />
        </View>

        <CollapsibleSection title="Story Recap">
            {safeEvaluation.storyRecap.items.map((item, index) => (
                <Text
                key={`${item.speaker}-${index}`}
                style={item.speaker === "user" ? styles.recapUserText : styles.recapAiText}
                >
                {item.text}
                </Text>
            ))}
        </CollapsibleSection>

        <CollapsibleSection title="What You Did Well">
            {safeEvaluation.whatYouDidWell.map((line) => (
                <View key={line} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.sectionBody}>{line}</Text>
                </View>
            ))}
        </CollapsibleSection>

        <CollapsibleSection title="Structure Analysis">
            {safeEvaluation.structureAnalysis.map((item) => (
                <View key={item.title} style={styles.analysisRow}>
                <View style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <View style={{ flex: 1 }}>
                    <Text style={styles.analysisTitle}>{item.title}</Text>
                    <Text style={styles.sectionBody}>{item.description}</Text>
                    </View>
                </View>
                </View>
            ))}
        </CollapsibleSection>

        <CollapsibleSection
            title="Recommended Actions"
            containerStyle={styles.recommendedCard}
            >
            {safeEvaluation.recommendedActions.map((action) => (
                <View key={action.title} style={styles.recommendedRow}>
                <Text style={styles.recommendedTitle}>{action.title}</Text>
                <Text style={styles.sectionBody}>{action.description}</Text>
                </View>
            ))}
        </CollapsibleSection>

        <Pressable style={styles.primaryButton} onPress={() => router.replace("/home")}>
          <Text style={styles.primaryButtonText}>Okay</Text>
        </Pressable>
        <Text style={styles.footerNote}>
            Result will be saved and can be viewed in <Text style={styles.footerBold}>My Recordings</Text>
        </Text>
      </ScrollView>

      <Modal transparent animationType="fade" visible={skillsModalOpen}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Skill Breakdown</Text>
              <Pressable onPress={() => setSkillsModalOpen(false)}>
                <Ionicons name="close" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {safeEvaluation.skillBreakdown.map((skill) => (
                <View key={skill.skill} style={styles.modalSkillCard}>
                  <View style={styles.modalSkillHeader}>
                    <Text style={styles.modalSkillTitle}>{skill.skill}</Text>
                    <Text style={styles.modalSkillScore}>{skill.score}</Text>
                  </View>
                  <Text style={styles.modalSkillLevel}>{skill.level}</Text>
                  <Text style={styles.modalSkillText}>{skill.reason}</Text>
                  <Text style={styles.modalTipLabel}>Improvement Tip</Text>
                  <Text style={styles.modalSkillText}>{skill.improvementTip}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    mediaCard: {
      height: 180,
      borderRadius: 18,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      alignItems: "center",
      justifyContent: "center",
    },
    mediaPlayButton: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: Colors.senary[300],
      alignItems: "center",
      justifyContent: "center",
    },
    quickSummaryTitle: {
      fontFamily: "Quicksand-Bold",
      fontSize: 16,
      color: Colors.octonary.DEFAULT,
    },
    quickSummaryBody: {
      backgroundColor: Colors.shade[200],
      borderRadius: 14,
      padding: 16,
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
    skillHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 2,
    },
    skillCard: {
      backgroundColor: Colors.shade[200],
      borderRadius: 18,
      paddingVertical: 12,
      alignItems: "center",
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
  recapAiText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  recapUserText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.senary[300],
    lineHeight: 20,
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
  recommendedRow: {
    gap: 4,
  },
  recommendedTitle: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  primaryButton: {
    backgroundColor: Colors.senary[300],
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
  footerNote: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  footerBold: {
    fontFamily: "AlbertSans-Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 18,
    backgroundColor: Colors.shade[200],
    padding: 20,
    gap: 12,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  modalContent: {
    gap: 12,
    paddingBottom: 8,
  },
  modalSkillCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    padding: 14,
    gap: 6,
  },
  modalSkillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalSkillTitle: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
  },
  modalSkillScore: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  modalSkillLevel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 13,
    color: Colors.senary[300],
  },
  modalSkillText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    lineHeight: 18,
  },
  modalTipLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    marginTop: 4,
  },
  quickSummaryHeader: {
    backgroundColor: "#F6C99A",
    },

    quickSummaryContent: {
    backgroundColor: "#F6C99A",
    paddingTop: 0,
    },

    quickSummaryText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
    },

    recommendedCard: {
    backgroundColor: "#FFEBA6",
    borderColor: Colors.octonary.DEFAULT,
    },

    sectionBody: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
    flex: 1,
    },
});

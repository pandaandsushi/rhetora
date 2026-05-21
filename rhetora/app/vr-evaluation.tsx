import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "../constants/colors";
import feedbackData from "./feedbackdata.json";
import TopHeader from "@/components/top-header";
const bgImage = require("../assets/images/bg-motif.png");
const scenarioImages = {
  Classroom: require("../assets/images/vr/school.png"),
  "Meeting Room": require("../assets/images/vr/meeting.png"),
  Podium: require("../assets/images/vr/podium.png"),
} as const;

export default function VrEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();
  const [quickSummaryOpen, setQuickSummaryOpen] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(true);
  const [didWellOpen, setDidWellOpen] = useState(true);
  const [audienceOpen, setAudienceOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);

  const parsedPayload = useMemo(() => {
    if (!params.data) {
      return null;
    }
    try {
      return JSON.parse(params.data);
    } catch {
      return null;
    }
  }, [params.data]);

  const evaluationData = parsedPayload?.feedback ?? feedbackData;
  const summary = evaluationData.quickSummary;
  const scenarioTitle = `VR Mode: ${evaluationData.scenario}`;
  const previewImage = useMemo(() => {
    return scenarioImages[evaluationData.scenario as keyof typeof scenarioImages] ??
      scenarioImages.Podium;
  }, [evaluationData.scenario]);
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Evaluation"
        variant="transparent"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.scenarioTitle}>{scenarioTitle}</Text>

        <View style={styles.previewCard}>
          <Image source={previewImage} style={styles.previewImage} />
          <View style={styles.previewOverlay}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={26} color={Colors.shade[200]} />
            </View>
          </View>
        </View>

        <Pressable
          style={styles.summaryHeader}
          onPress={() => setQuickSummaryOpen((prev) => !prev)}
        >
          <Text style={styles.summaryTitle}>Quick Summary</Text>
          <Ionicons
            name={quickSummaryOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.octonary.DEFAULT}
          />
        </Pressable>

        {quickSummaryOpen && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryLabel}>Total Filler Words</Text>
                <Text style={styles.summaryValue}>{summary.totalFillerWords}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryLabel}>Word Rate</Text>
                <Text style={styles.summaryValue}>
                  {summary.wordRatePerMinute}
                  <Text style={styles.summaryUnit}>/minute</Text>
                </Text>
              </View>
            </View>

            <View style={styles.fillerRow}>
              {summary.fillerWords.map((item) => (
                <View key={item.word} style={styles.fillerPill}>
                  <View style={styles.fillerCount}>
                    <Text style={styles.fillerCountText}>{item.count}</Text>
                  </View>
                  <Text style={styles.fillerWord}>{item.word}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.summaryHint}>Click to see details</Text>
          </View>
        )}

        <Pressable
          style={styles.sectionHeader}
          onPress={() => setTranscriptOpen((prev) => !prev)}
        >
          <Text style={styles.sectionTitle}>Transcript</Text>
          <Ionicons
            name={transcriptOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.octonary.DEFAULT}
          />
        </Pressable>
        {transcriptOpen && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionBody}>{evaluationData.transcript}</Text>
          </View>
        )}

        <Pressable
          style={styles.sectionHeader}
          onPress={() => setDidWellOpen((prev) => !prev)}
        >
          <Text style={styles.sectionTitle}>What You Did Well</Text>
          <Ionicons
            name={didWellOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.octonary.DEFAULT}
          />
        </Pressable>
        {didWellOpen && (
          <View style={styles.sectionCard}>
            {evaluationData.whatYouDidWell.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.sectionBody}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={styles.sectionHeader}
          onPress={() => setAudienceOpen((prev) => !prev)}
        >
          <Text style={styles.sectionTitle}>Audience Reaction</Text>
          <Ionicons
            name={audienceOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.octonary.DEFAULT}
          />
        </Pressable>
        {audienceOpen && (
          <View style={styles.sectionCard}>
            <View style={styles.reactionRow}>
              <Text style={styles.reactionLabel}>Beginning:</Text>
              <Text style={styles.sectionBody}>{evaluationData.audienceReaction.beginning}</Text>
            </View>
            <View style={styles.reactionRow}>
              <Text style={styles.reactionLabel}>Middle:</Text>
              <Text style={styles.sectionBody}>{evaluationData.audienceReaction.middle}</Text>
            </View>
            <View style={styles.reactionRow}>
              <Text style={styles.reactionLabel}>End:</Text>
              <Text style={styles.sectionBody}>{evaluationData.audienceReaction.end}</Text>
            </View>
          </View>
        )}

        <Pressable
          style={styles.sectionHeader}
          onPress={() => setActionsOpen((prev) => !prev)}
        >
          <Text style={styles.sectionTitle}>Recommended Actions</Text>
          <Ionicons
            name={actionsOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.octonary.DEFAULT}
          />
        </Pressable>
        {actionsOpen && (
          <View style={[styles.sectionCard, styles.actionsCard]}>
            {evaluationData.recommendedActions.map((action, index) => (
              <View key={action.title} style={styles.actionRow}>
                <Text style={styles.actionIndex}>{index + 1}.</Text>
                <View style={styles.actionBody}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.sectionBody}>{action.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.primaryButton} onPress={() => router.replace("/home")}>
          <Text style={styles.primaryButtonText}>Okay</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          Result will be saved and can be viewed in <Text style={styles.footerBold}>My Recordings</Text>
        </Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14,
  },
  scenarioTitle: {
    textAlign: "center",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  previewCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    height: 190,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  playButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.quinary[100],
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    padding: 14,
    gap: 14,
  },
  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  summaryValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  summaryUnit: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.neutral[300],
  },
  fillerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fillerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.neutral[100],
  },
  fillerCount: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.senary[300],
  },
  fillerCountText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.shade[200],
  },
  fillerWord: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  summaryHint: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    padding: 14,
    gap: 10,
  },
  sectionBody: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    lineHeight: 18,
    flex: 1,
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  reactionRow: {
    flexDirection: "row",
    gap: 8,
  },
  reactionLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    minWidth: 74,
  },
  actionsCard: {
    backgroundColor: Colors.warning[100],
    borderColor: Colors.warning[400],
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionIndex: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  actionBody: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    height: 52,
    alignItems: "center",
    justifyContent: "center",
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
});

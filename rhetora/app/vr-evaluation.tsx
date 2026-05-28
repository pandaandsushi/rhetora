import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, useRouter } from "expo-router";
import CollapsibleSection from "../components/collapsible-section";
import { Colors } from "../constants/colors";
import feedbackData from "./vr-fallback.json";
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
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  const handlePillPress = (word: string) => {
    setSelectedPill((prev) => (prev === word ? null : word));
  };

  function HighlightedTranscript({
    text,
    fillerWords,
    selectedWord,
  }: {
    text: string;
    fillerWords: string[];
    selectedWord: string | null;
  }) {
    if (!text) {
      return <Text style={styles.sectionBody}>No transcript available.</Text>;
    }

    if (fillerWords.length === 0) {
      return <Text style={styles.sectionBody}>{text}</Text>;
    }

    const escapedWords = fillerWords.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
    const parts = text.split(pattern);

    return (
      <Text style={styles.sectionBody}>
        {parts.map((part, index) => {
          const isFillerWord = fillerWords.some(
            (word) => word.toLowerCase() === part.toLowerCase()
          );

          const isSelected = selectedWord
            ? part.toLowerCase() === selectedWord.toLowerCase()
            : isFillerWord;

          if (!isFillerWord) {
            return <Text key={`${part}-${index}`}>{part}</Text>;
          }

          return (
            <Text
              key={`${part}-${index}`}
              style={[
                styles.transcriptHighlight,
                isSelected && styles.transcriptHighlightSelected,
              ]}
            >
              {part}
            </Text>
          );
        })}
      </Text>
    );
  }
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

  const quickSummary =
    typeof evaluationData.quickSummary === "string"
      ? evaluationData.quickSummary
      : evaluationData.overallFeedback?.summary ??
        "Great effort! Review your speaking performance below.";

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

  const legacySummary =
    typeof evaluationData.quickSummary === "object" && evaluationData.quickSummary !== null
      ? evaluationData.quickSummary
      : null;

  const safeSummary = {
    totalFillerWords:
      evaluationData.totalFillerWords ??
      legacySummary?.totalFillerWords ??
      0,
    wordRatePerMinute:
      evaluationData.wordRatePerMinute ??
      legacySummary?.wordRatePerMinute ??
      0,
    fillerWords: Array.isArray(evaluationData.fillerWords)
      ? evaluationData.fillerWords
      : Array.isArray(legacySummary?.fillerWords)
        ? legacySummary.fillerWords
        : [],
  };


  const fillerWords = safeSummary.fillerWords.map((item) => item.word);
  const safeWhatYouDidWell = Array.isArray(evaluationData.whatYouDidWell)
    ? evaluationData.whatYouDidWell
    : [];

  const safeRecommendedActions = Array.isArray(evaluationData.recommendedActions)
    ? evaluationData.recommendedActions
    : [];

  const safeAudienceReaction = evaluationData.audienceReaction ?? {
    beginning: "-",
    middle: "-",
    end: "-",
  };

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

        <CollapsibleSection
          title="Quick Summary"
          headerStyle={styles.quickSummaryHeader}
          contentStyle={styles.quickSummaryContent}
        >
          <Text style={styles.quickSummaryText}>{quickSummary}</Text>
        </CollapsibleSection>

        <View style={styles.summaryCard}>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryLabel}>Total Filler Words</Text>
              <Text style={styles.summaryValue}>{safeSummary.totalFillerWords}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryStat}>
              <Text style={styles.summaryLabel}>Word Rate</Text>
              <Text style={styles.summaryValue}>
                {safeSummary.wordRatePerMinute}
                <Text style={styles.summaryUnit}>/minute</Text>
              </Text>
            </View>
          </View>

          {safeSummary.fillerWords.length > 0 && (
            <View style={styles.fillerSection}>
              <View style={styles.fillerRow}>
                {safeSummary.fillerWords.map((item) => (
                  <Pressable
                    key={item.word}
                    style={[
                      styles.fillerPill,
                      selectedPill === item.word && styles.fillerPillSelected,
                    ]}
                    onPress={() => handlePillPress(item.word)}
                  >
                    <View style={styles.fillerCount}>
                      <Text style={styles.fillerCountText}>{item.count}</Text>
                    </View>

                    <Text
                      style={[
                        styles.fillerWord,
                        selectedPill === item.word && styles.fillerWordSelected,
                      ]}
                    >
                      {item.word}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {safeSummary.fillerWords.length > 0 && (
                <Text style={styles.pillsHint}>
                  {selectedPill
                    ? `Showing "${selectedPill}" highlights. Tap again to clear.`
                    : "Tap a pill to highlight that word in the transcript."}
                </Text>
              )}
            </View>
          )}
        </View>

        <CollapsibleSection title="Transcript">
          <HighlightedTranscript
            text={evaluationData.transcript}
            fillerWords={fillerWords}
            selectedWord={selectedPill}
          />
        </CollapsibleSection>

        <CollapsibleSection title="What You Did Well">
          {safeWhatYouDidWell.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.sectionBody}>{item}</Text>
            </View>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Audience Reaction">
          <View style={styles.reactionRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionBody}>
              <Text style={styles.reactionLabel}>🙂 Beginning: </Text>
              {safeAudienceReaction.beginning}
            </Text>
          </View>

          <View style={styles.reactionRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionBody}>
              <Text style={styles.reactionLabel}>😐 Middle: </Text>
              {safeAudienceReaction.middle}
            </Text>
          </View>

          <View style={styles.reactionRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionBody}>
              <Text style={styles.reactionLabel}>🙂 End: </Text>
              {safeAudienceReaction.end}
            </Text>
          </View>
        </CollapsibleSection>

        <CollapsibleSection
          title="Recommended Actions"
          containerStyle={styles.actionsCard}
        >
          {safeRecommendedActions.map((action, index) => (
            <View key={action.title} style={styles.actionRow}>
              <Text style={styles.actionIndex}>{index + 1}.</Text>
              <View style={styles.actionBody}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.sectionBody}>{action.description}</Text>
              </View>
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
  fillerPillSelected: {
    backgroundColor: Colors.senary[100],
    borderColor: Colors.senary[300],
  },

  fillerWordSelected: {
    color: Colors.senary[300],
  },

  pillsHint: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: "center",
  },

  transcriptHighlight: {
    color: Colors.senary[300],
    fontFamily: "AlbertSans-Bold",
  },

  transcriptHighlightSelected: {
    backgroundColor: Colors.senary[100],
    color: Colors.senary[400],
  },
  fillerSection: {
    gap: 8,
  },
});

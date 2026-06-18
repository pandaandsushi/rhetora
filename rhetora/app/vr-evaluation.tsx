import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import feedbackData from "./vr-fallback.json";
import TopHeader from "@/components/top-header";
import Toast from "../components/toast";

const bgImage = require("../assets/images/bg-motif.png");
const scenarioImages = {
  Classroom: require("../assets/images/vr/school.png"),
  "Meeting Room": require("../assets/images/vr/meeting.png"),
  Podium: require("../assets/images/vr/podium.png"),
} as const;

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
    return <Text style={styles.transcriptText}>No transcript available.</Text>;
  }

  if (fillerWords.length === 0) {
    return <Text style={styles.transcriptText}>{text}</Text>;
  }

  const escapedWords = fillerWords.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  const parts = text.split(pattern);

  return (
    <Text style={styles.transcriptText}>
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

export default function VrEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [aiFeedbackModalOpen, setAiFeedbackModalOpen] = useState(false);
  const [aiFeedbackRating, setAiFeedbackRating] = useState(0);
  const [aiFeedbackComment, setAiFeedbackComment] = useState("");
  const [aiFeedbackSubmitted, setAiFeedbackSubmitted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("success");

  const handleSubmitAiFeedback = () => {
    console.log("[Evaluation] AI evaluation feedback", {
      mode: "vr-mode",
      rating: aiFeedbackRating,
      comment: aiFeedbackComment,
      evaluation: evaluationData,
    });

    setAiFeedbackSubmitted(true);
    setAiFeedbackModalOpen(false);
    setToastMessage("Feedback submitted successfully");
    setToastVariant("success");
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const handlePillPress = (word: string) => {
    setSelectedPill((prev) => (prev === word ? null : word));
  };

  const parsedPayload = useMemo(() => {
    if (!params.data) return null;
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

  const previewImage = useMemo(() => {
    return (
      scenarioImages[evaluationData.scenario as keyof typeof scenarioImages] ??
      scenarioImages.Podium
    );
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
      evaluationData.totalFillerWords ?? legacySummary?.totalFillerWords ?? 0,
    wordRatePerMinute:
      evaluationData.wordRatePerMinute ?? legacySummary?.wordRatePerMinute ?? 0,
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

  const audienceReactionItems = [
    { emoji: "🙂", label: "Beginning", value: safeAudienceReaction.beginning },
    { emoji: "😐", label: "Middle", value: safeAudienceReaction.middle },
    { emoji: "🙂", label: "End", value: safeAudienceReaction.end },
  ];

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Evaluation"
        variant="transparent"
        onBack={() => router.back()}
        rightElement={
          <Pressable
            style={[
              styles.headerFeedbackButton,
              aiFeedbackSubmitted && styles.headerFeedbackButtonSubmitted,
            ]}
            onPress={() => setAiFeedbackModalOpen(true)}
          >
            <Ionicons
              name={aiFeedbackSubmitted ? "checkmark" : "chatbubble-ellipses-outline"}
              size={16}
              color={aiFeedbackSubmitted ? Colors.senary[300] : Colors.shade[200]}
            />
            <Text
              style={[
                styles.headerFeedbackText,
                aiFeedbackSubmitted && styles.headerFeedbackTextSubmitted,
              ]}
            >
              {aiFeedbackSubmitted ? "Sent" : "Feedback"}
            </Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero: scenario + media + quick summary ── */}
        <View style={styles.heroCard}>
          <View style={styles.mediaCard}>
            <Image source={previewImage} style={styles.mediaImage} />
            <View style={styles.mediaOverlay} />
            <View style={styles.mediaPlayButton}>
              <Ionicons name="play" size={22} color={Colors.shade[200]} />
            </View>
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.eyebrow}>VR Mode</Text>
            <Text style={styles.promptText}>{evaluationData.scenario}</Text>
            <Text style={styles.quickSummaryText}>{quickSummary}</Text>
          </View>
        </View>

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{safeSummary.totalFillerWords}</Text>
            <Text style={styles.statLabel}>Filler words</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {safeSummary.wordRatePerMinute}
              <Text style={styles.statUnit}> wpm</Text>
            </Text>
            <Text style={styles.statLabel}>Speaking rate</Text>
          </View>
        </View>

        {/* ── Filler word pills + transcript (grouped) ── */}
        {(safeSummary.fillerWords.length > 0 || !!evaluationData.transcript) && (
          <View style={styles.transcriptCard}>
            {safeSummary.fillerWords.length > 0 && (
              <View style={styles.pillsSection}>
                <Text style={styles.cardSectionLabel}>Filler words detected</Text>
                <View style={styles.pillsRow}>
                  {safeSummary.fillerWords.map((item) => (
                    <Pressable
                      key={item.word}
                      style={[
                        styles.fillerPill,
                        selectedPill === item.word && styles.fillerPillSelected,
                      ]}
                      onPress={() => handlePillPress(item.word)}
                    >
                      <View style={styles.fillerBadge}>
                        <Text style={styles.fillerBadgeText}>{item.count}</Text>
                      </View>
                      <Text
                        style={[
                          styles.fillerPillWord,
                          selectedPill === item.word && styles.fillerPillWordSelected,
                        ]}
                      >
                        {item.word}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.pillsHint}>
                  {selectedPill
                    ? `Showing "${selectedPill}" highlights. Tap again to clear.`
                    : "Tap a word to highlight it in the transcript below."}
                </Text>
              </View>
            )}

            <View style={styles.transcriptDivider} />

            <View style={styles.transcriptBody}>
              <Text style={styles.cardSectionLabel}>Transcript</Text>
              <HighlightedTranscript
                text={evaluationData.transcript}
                fillerWords={fillerWords}
                selectedWord={selectedPill}
              />
            </View>
          </View>
        )}

        {/* ── What you did well ── */}
        {safeWhatYouDidWell.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardSectionLabel}>What you did well</Text>
            {safeWhatYouDidWell.map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Audience reaction ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardSectionLabel}>Audience reaction</Text>
          {audienceReactionItems.map((item) => (
            <View key={item.label} style={styles.reactionRow}>
              <Text style={styles.reactionEmoji}>{item.emoji}</Text>
              <View style={styles.reactionBody}>
                <Text style={styles.reactionLabel}>{item.label}</Text>
                <Text style={styles.reactionValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Recommended actions ── */}
        {safeRecommendedActions.length > 0 && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>What to work on next</Text>
            {safeRecommendedActions.map((action, i) => (
              <View key={action.title} style={styles.actionRow}>
                <View style={styles.actionNumber}>
                  <Text style={styles.actionNumberText}>{i + 1}</Text>
                </View>
                <View style={styles.actionBody}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.primaryButton} onPress={() => router.replace("/home")}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          AI feedback may contain mistakes.{" "}
          <Text style={styles.footerBold}>Always review your transcript.</Text>
        </Text>
      </ScrollView>
      {/* ── AI evaluation feedback modal ── */}
      <Modal transparent animationType="fade" visible={aiFeedbackModalOpen}>
        <View style={styles.aiFeedbackModalOverlay}>
          <View style={styles.aiFeedbackModalCard}>
            <View style={styles.aiFeedbackModalHeaderRow}>
              <Text style={styles.aiFeedbackModalTitle}>Give Feedback</Text>
              <Pressable onPress={() => setAiFeedbackModalOpen(false)}>
                <Ionicons name="close" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
            </View>

            <Text style={styles.aiFeedbackSubtitle}>
              How helpful was this AI evaluation?
            </Text>

            <View style={styles.aiFeedbackStarRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={`ai-feedback-${value}`}
                  onPress={() => setAiFeedbackRating(value)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={aiFeedbackRating >= value ? "star" : "star-outline"}
                    size={32}
                    color={aiFeedbackRating >= value ? "#F59E0B" : Colors.neutral[500]}
                  />
                </Pressable>
              ))}
            </View>

            <Text style={styles.aiFeedbackQuestion}>
              What do you think about this evaluation?
            </Text>

            <TextInput
              value={aiFeedbackComment}
              onChangeText={setAiFeedbackComment}
              placeholder="Tell us if the feedback was helpful, confusing, inaccurate, or missing something..."
              placeholderTextColor={Colors.neutral[400]}
              multiline
              style={styles.aiFeedbackInput}
            />

            <Text style={styles.aiFeedbackHint}>
              Your feedback helps improve the AI evaluation experience.
            </Text>

            <View style={styles.aiFeedbackModalActions}>
              <Pressable
                style={[styles.aiFeedbackModalButton, styles.aiFeedbackModalButtonGhost]}
                onPress={() => setAiFeedbackModalOpen(false)}
              >
                <Text style={styles.aiFeedbackModalGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.aiFeedbackModalButton,
                  styles.aiFeedbackModalButtonConfirm,
                  aiFeedbackRating === 0 && styles.aiFeedbackModalButtonDisabled,
                ]}
                disabled={aiFeedbackRating === 0}
                onPress={handleSubmitAiFeedback}
              >
                <Text style={styles.aiFeedbackModalConfirmText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        variant={toastVariant}
      />
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
    paddingBottom: 48,
    gap: 14,
  },

  // ── Hero card ──
  heroCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "rgba(0,0,0,0.15)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  mediaCard: {
    height: 140,
    backgroundColor: "rgba(0,0,0,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  mediaPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  heroBody: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 6,
  },
  eyebrow: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 11,
    color: Colors.senary[300],
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  promptText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 17,
    color: Colors.octonary.DEFAULT,
    lineHeight: 24,
  },
  quickSummaryText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.shade[100],
    lineHeight: 19,
    marginTop: 2,
  },

  // ── Stats row ──
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.shade[200],
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.10)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.shade[100],
    opacity: 0.5,
  },
  statValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 26,
    color: Colors.octonary.DEFAULT,
    lineHeight: 30,
  },
  statUnit: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.shade[100],
  },
  statLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.shade[100],
  },

  // ── Transcript card (filler pills + transcript grouped) ──
  transcriptCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "rgba(0,0,0,0.10)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  pillsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 10,
  },
  cardSectionLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 11,
    color: Colors.shade[100],
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fillerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
  },
  fillerPillSelected: {
    backgroundColor: Colors.senary[100],
    borderColor: Colors.senary[300],
  },
  fillerBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  fillerBadgeText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 11,
    color: Colors.shade[200],
  },
  fillerPillWord: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  fillerPillWordSelected: {
    color: Colors.senary[300],
  },
  pillsHint: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 11,
    color: Colors.shade[100],
  },
  transcriptDivider: {
    height: 1,
    backgroundColor: Colors.shade[100],
    opacity: 0.3,
    marginHorizontal: 16,
  },
  transcriptBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 8,
  },
  transcriptText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 22,
  },
  transcriptHighlight: {
    color: Colors.senary[300],
    fontFamily: "AlbertSans-Bold",
  },
  transcriptHighlightSelected: {
    backgroundColor: Colors.senary[100],
    color: Colors.senary[400],
  },

  // ── Generic section card ──
  sectionCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 10,
    shadowColor: "rgba(0,0,0,0.10)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.senary[300],
    marginTop: 7,
    flexShrink: 0,
  },
  bulletText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
    flex: 1,
  },

  // ── Audience reaction ──
  reactionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  reactionEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  reactionBody: {
    flex: 1,
    gap: 1,
  },
  reactionLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.shade[100],
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  reactionValue: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    lineHeight: 19,
  },

  // ── Actions card ──
  actionsCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 14,
    shadowColor: "rgba(0,0,0,0.10)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  actionsTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  actionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  actionNumberText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 13,
    color: Colors.shade[200],
  },
  actionBody: {
    flex: 1,
    gap: 3,
  },
  actionTitle: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  actionDescription: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.shade[100],
    lineHeight: 19,
  },

  // ── Primary button ──
  primaryButton: {
    backgroundColor: Colors.senary[300],
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },

  // ── Footer ──
  footerNote: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 11,
    color: Colors.shade[100],
    textAlign: "center",
    lineHeight: 17,
  },
  footerBold: {
    fontFamily: "AlbertSans-Bold",
    color: Colors.octonary.DEFAULT,
  },
  headerFeedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.senary[300],
  },
  headerFeedbackButtonSubmitted: {
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.senary[300],
  },
  headerFeedbackText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.shade[200],
  },
  headerFeedbackTextSubmitted: {
    color: Colors.senary[300],
  },
  aiFeedbackModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  aiFeedbackModalCard: {
    width: "100%",
    maxHeight: "92%",
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 12,
  },
  aiFeedbackModalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiFeedbackModalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 17,
    color: Colors.octonary.DEFAULT,
  },
  aiFeedbackSubtitle: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
    lineHeight: 21,
  },
  aiFeedbackStarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 2,
  },
  aiFeedbackQuestion: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  aiFeedbackInput: {
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    borderRadius: 14,
    minHeight: 80,
    paddingHorizontal: 14,
    paddingTop: 10,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlignVertical: "top",
  },
  aiFeedbackHint: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
    lineHeight: 17,
  },
  aiFeedbackModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  aiFeedbackModalButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  aiFeedbackModalButtonGhost: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  aiFeedbackModalButtonConfirm: {
    backgroundColor: Colors.senary[300],
  },
  aiFeedbackModalButtonDisabled: {
    opacity: 0.5,
  },
  aiFeedbackModalGhostText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  aiFeedbackModalConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },

});
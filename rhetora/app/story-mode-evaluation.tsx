import { useMemo, useState } from "react";
import {
  ImageBackground,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "../components/toast";

import { Colors } from "../constants/colors";
import TopHeader from "../components/top-header";
import storyModeFallback from "./story-mode-fallback.json";

const confettiImage = require("../assets/images/confetti.png");
const bgImage = require("../assets/images/bg-motif.png");
const timeToFocusBadge = require("../assets/images/badge/5.png");
const mediaImage = require("../assets/images/storymode/maelle.png");

type FillerCount = Record<string, number>;

type Evaluation = {
  quickSummary?: string;
  whatYouDidWell?: string[];
  structureAnalysis?: Array<{
    point: string;
    excerpt: string;
    feedback: string;
  }>;
  recommendedActions?: Array<{ title: string; description: string }>;
};

type SessionData = {
  transcript?: string;
  fillerCounts?: FillerCount;
  wordRatePerMinute?: number;
  totalFillerWords?: number;
  evaluation?: Evaluation;
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
    return <Text style={styles.transcriptText}>No transcript available.</Text>;
  }

  const escapedWords = fillerWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  const parts = text.split(pattern);

  return (
    <Text style={styles.transcriptText}>
      {parts.map((part, i) => {
        const isFillerWord = fillerWords.some(
          (w) => w.toLowerCase() === part.toLowerCase()
        );
        const isSelected = selectedWord
          ? part.toLowerCase() === selectedWord.toLowerCase()
          : isFillerWord;

        if (isFillerWord) {
          return (
            <Text
              key={i}
              style={[
                styles.transcriptHighlight,
                isSelected && styles.transcriptHighlightSelected,
              ]}
            >
              {part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

export default function StoryModeEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string }>();

  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [aiFeedbackModalOpen, setAiFeedbackModalOpen] = useState(false);
  const [aiFeedbackRating, setAiFeedbackRating] = useState(0);
  const [aiFeedbackComment, setAiFeedbackComment] = useState("");
  const [aiFeedbackSubmitted, setAiFeedbackSubmitted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("success");

  const sessionData = useMemo<SessionData>(() => {
    if (!params.data) {
      return {
        transcript: storyModeFallback.transcript,
        evaluation: storyModeFallback,
      };
    }
    try {
      return JSON.parse(params.data);
    } catch {
      return {
        transcript: storyModeFallback.transcript,
        evaluation: storyModeFallback,
      };
    }
  }, [params.data]);

  const fillerCounts: FillerCount = sessionData.fillerCounts ?? {};
  const transcript = sessionData.transcript ?? "";
  const wordRate = sessionData.wordRatePerMinute ?? 0;
  const totalFillerWords = sessionData.totalFillerWords ?? 0;
  const evaluation = sessionData.evaluation ?? {};

  const whatYouDidWell = Array.isArray(evaluation.whatYouDidWell)
    ? evaluation.whatYouDidWell
    : [];
  const structureAnalysis = Array.isArray(evaluation.structureAnalysis)
    ? evaluation.structureAnalysis
    : [];
  const recommendedActions = Array.isArray(evaluation.recommendedActions)
    ? evaluation.recommendedActions
    : [];

  const trackedFillerWords = Object.keys(fillerCounts);
  const fillerPills = trackedFillerWords
    .map((word) => ({ word, count: fillerCounts[word] ?? 0 }))
    .filter((p) => p.count > 0);

  const handlePillPress = (word: string) => {
    setSelectedPill((prev) => (prev === word ? null : word));
  };

  const handleSubmitAiFeedback = () => {
    console.log("[Evaluation] AI evaluation feedback", {
      mode: "story-mode",
      rating: aiFeedbackRating,
      comment: aiFeedbackComment,
      evaluation: sessionData,
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

        {/* ── Hero: episode title + media + quick summary ── */}
        <View style={styles.heroCard}>
          <View style={styles.mediaCard}>
            <Image source={mediaImage} style={styles.mediaImage} />
            <View style={styles.mediaOverlay} />
            <View style={styles.mediaPlayButton}>
              <Ionicons name="play" size={22} color={Colors.shade[200]} />
            </View>
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.eyebrow}>The First Introduction</Text>
            <Text style={styles.promptText}>Now your new friends know you well!</Text>
            <Text style={styles.quickSummaryText}>
              {evaluation.quickSummary ?? "Great effort! Review your performance below."}
            </Text>
          </View>
        </View>

        {/* ── Filler word pills + transcript (grouped) ── */}
        {(fillerPills.length > 0 || transcript.length > 0) && (
          <View style={styles.transcriptCard}>
            {fillerPills.length > 0 && (
              <View style={styles.pillsSection}>
                <Text style={styles.cardSectionLabel}>Filler words detected</Text>
                <View style={styles.pillsRow}>
                  {fillerPills.map((p) => (
                    <Pressable
                      key={p.word}
                      style={[
                        styles.fillerPill,
                        selectedPill === p.word && styles.fillerPillSelected,
                      ]}
                      onPress={() => handlePillPress(p.word)}
                    >
                      <View style={styles.fillerBadge}>
                        <Text style={styles.fillerBadgeText}>{p.count}</Text>
                      </View>
                      <Text
                        style={[
                          styles.fillerPillWord,
                          selectedPill === p.word && styles.fillerPillWordSelected,
                        ]}
                      >
                        {p.word}
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
                text={transcript}
                fillerWords={trackedFillerWords}
                selectedWord={selectedPill}
              />
            </View>
          </View>
        )}

        {/* ── What you did well ── */}
        {whatYouDidWell.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardSectionLabel}>What you did well</Text>
            {whatYouDidWell.map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Structure analysis ── */}
        {structureAnalysis.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.cardSectionLabel}>Structure analysis</Text>
            {structureAnalysis.map((item, i) => (
              <View key={i} style={styles.analysisItem}>
                <Text style={styles.analysisTitle}>{item.point}</Text>
                <Text style={styles.analysisExcerpt}>"{item.excerpt}"</Text>
                <Text style={styles.analysisDescription}>→ {item.feedback}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Recommended actions ── */}
        {recommendedActions.length > 0 && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>What to work on next</Text>
            {recommendedActions.map((action, i) => (
              <View key={action.title ?? i} style={styles.actionRow}>
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

        <Pressable style={styles.primaryButton} onPress={() => setShowBadgeModal(true)}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          AI feedback may contain mistakes.{" "}
          <Text style={styles.footerBold}>Always review your transcript.</Text>
        </Text>
      </ScrollView>

      {/* ── Badge modal ── */}
      <Modal
        animationType="fade"
        transparent
        visible={showBadgeModal}
        onRequestClose={() => setShowBadgeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Image source={confettiImage} style={styles.confetti} pointerEvents="none" />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>You've just earned a new badge!</Text>
            <View style={styles.modalBadgeWrap}>
              <View style={styles.modalBadgeImageWrap}>
                <ImageBackground
                  source={timeToFocusBadge}
                  style={styles.modalBadgeImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.modalBadgeName}>Time to Focus</Text>
              <Text style={styles.modalBadgeSubtitle}>
                Finish a Story Mode Exercise 1 time
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => {
                  setShowBadgeModal(false);
                  router.replace("/profile");
                }}
              >
                <Text style={styles.modalSecondaryButtonText}>View Profile</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimaryButton}
                onPress={() => {
                  setShowBadgeModal(false);
                  router.replace("/home");
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>Cool!</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  analysisItem: {
    gap: 3,
  },
  analysisTitle: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  analysisExcerpt: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.shade[100],
    fontStyle: "italic",
    lineHeight: 19,
    marginLeft: 4,
  },
  analysisDescription: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.shade[100],
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

  // ── Badge modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  confetti: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: "center",
    gap: 16,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalBadgeWrap: {
    alignItems: "center",
    gap: 8,
  },
  modalBadgeImageWrap: {
    width: 170,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBadgeImage: {
    width: 170,
    height: 140,
  },
  modalBadgeName: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalBadgeSubtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalActions: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalSecondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  modalSecondaryButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  modalPrimaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.senary[300],
  },
  modalPrimaryButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
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
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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import CollapsibleSection from "../components/collapsible-section";
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
  const params = useLocalSearchParams<{
    data?: string;
  }>();

  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const sessionData = useMemo<SessionData>(() => {
    if (!params.data) return { evaluation: storyModeFallback };
    try {
      return JSON.parse(params.data);
    } catch {
      return { evaluation: storyModeFallback };
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

  const effectiveHighlightWord = selectedPill;

  const handlePillPress = (word: string) => {
    setSelectedPill((prev) => (prev === word ? null : word));
  };

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Evaluation"
        variant="transparent"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <Text style={styles.episodeTitle}>The First Introduction</Text>
          <Text style={styles.episodeSubtitle}>Now your new friends know you well!</Text>
        </View>

        <View style={styles.mediaCard}>
          <Image source={mediaImage} style={styles.mediaImage} />

          <View style={styles.mediaOverlay} />

          <View style={styles.mediaPlayButton}>
            <Ionicons name="play" size={26} color={Colors.shade[200]} />
          </View>
        </View>

        <CollapsibleSection
          title="Quick Summary"
          headerStyle={styles.quickSummaryHeader}
          contentStyle={styles.quickSummaryContent}
        >
          <Text style={styles.quickSummaryText}>
            {evaluation.quickSummary ?? "Great effort! Review your performance below."}
          </Text>

          {/* <View style={styles.summaryCard}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryLabel}>Total Filler Words</Text>
              <Text style={styles.summaryValue}>{totalFillerWords}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryLabel}>Word Rate</Text>
              <Text style={styles.summaryValue}>
                {wordRate}
                <Text style={styles.summaryUnit}> /minute</Text>
              </Text>
            </View>
          </View> */}

          {fillerPills.length > 0 && (
            <View style={styles.pillsSection}>
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
                  ? `Showing "${selectedPill}" highlights.`
                  : "Click to see details"}
              </Text>
            </View>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Transcript">
          <HighlightedTranscript
            text={transcript}
            fillerWords={trackedFillerWords}
            selectedWord={effectiveHighlightWord}
          />
        </CollapsibleSection>

        {whatYouDidWell.length > 0 && (
          <CollapsibleSection title="What You Did Well">
            <View style={styles.listContainer}>
              {whatYouDidWell.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.sectionBody}>{item}</Text>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {structureAnalysis.length > 0 && (
          <CollapsibleSection title="Structure Analysis">
            <View style={styles.listContainer}>
              {structureAnalysis.map((item, i) => (
                <View key={i} style={styles.analysisItem}>
                  <Text style={styles.analysisPoint}>• {item.point}:</Text>
                  <Text style={styles.analysisExcerpt}>"{item.excerpt}"</Text>
                  <Text style={styles.analysisFeedback}>→ {item.feedback}</Text>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {recommendedActions.length > 0 && (
          <CollapsibleSection
            title="Recommended Actions"
            containerStyle={styles.recommendedCard}
          >
            {recommendedActions.map((action, i) => (
              <View key={action.title ?? i} style={styles.recommendedRow}>
                <Text style={styles.recommendedTitle}>
                  {i + 1}. {action.title}
                </Text>
                <Text style={styles.sectionBody}>{action.description}</Text>
              </View>
            ))}
          </CollapsibleSection>
        )}

        <Pressable style={styles.primaryButton} onPress={() => setShowBadgeModal(true)}>
          <Text style={styles.primaryButtonText}>Okay</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.footerBold}>My Recordings</Text>
        </Text>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showBadgeModal}
        onRequestClose={() => setShowBadgeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Image
            source={confettiImage}
            style={styles.confetti}
            pointerEvents="none"
          />
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
  headerWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  episodeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  episodeSubtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  mediaCard: {
    height: 180,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.20)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  mediaImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  mediaPlayButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  quickSummaryHeader: {
    backgroundColor: "#F6C99A",
  },
  quickSummaryContent: {
    backgroundColor: "#F6C99A",
    paddingTop: 0,
    gap: 16,
  },
  quickSummaryText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryStat: {
    alignItems: "center",
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.octonary.DEFAULT,
  },
  summaryLabel: {
    fontFamily: "AlbertSans-Medium",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  summaryValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 28,
    color: Colors.octonary.DEFAULT,
    marginTop: 4,
  },
  summaryUnit: {
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  pillsSection: {
    gap: 12,
    alignItems: "center",
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  fillerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: "transparent",
  },
  fillerPillSelected: {
    backgroundColor: Colors.senary[100],
    borderColor: Colors.senary[300],
  },
  fillerBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  fillerBadgeText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 12,
    color: Colors.shade[200],
  },
  fillerPillWord: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  fillerPillWordSelected: {
    color: Colors.senary[300],
  },
  pillsHint: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
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
  sectionBody: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
    flex: 1,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  bulletPoint: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    marginTop: 1,
  },
  analysisItem: {
    marginBottom: 10,
  },
  analysisPoint: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  analysisExcerpt: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.neutral[600],
    fontStyle: "italic",
    marginLeft: 12,
    marginTop: 2,
  },
  analysisFeedback: {
    fontFamily: "AlbertSans-Medium",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    marginLeft: 12,
    marginTop: 4,
  },
  recommendedCard: {
    backgroundColor: "#FFEBA6",
    borderColor: Colors.octonary.DEFAULT,
  },
  recommendedRow: {
    gap: 4,
    marginBottom: 8,
  },
  recommendedTitle: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  primaryButton: {
    backgroundColor: Colors.senary[300],
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
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
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
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
});

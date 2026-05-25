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
import SkillRadar from "../components/skill-radar";
import fillerFreeFallback from "./filler-free-fallback.json";
const mediaImage = require("../assets/images/storymode/maelle.png");
const bgImage = require("../assets/images/bg-motif.png");

type FillerCount = Record<string, number>;

type Evaluation = {
  quickSummary?: string;
  skillBreakdown?: Array<{
    skill: string;
    score: number;
    level: string;
    reason: string;
    improvementTip: string;
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

// Renders transcript text with filler words highlighted
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

  // Build a regex that matches any tracked filler word
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

export default function FillerFreeEvaluation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    data?: string;
    question?: string;
    fillerWords?: string;
  }>();

  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);

  const sessionData = useMemo<SessionData>(() => {
    if (!params.data) return fillerFreeFallback;
    try {
      return JSON.parse(params.data);
    } catch {
      return fillerFreeFallback;
    }
  }, [params.data]);

  const question = params.question ?? fillerFreeFallback.question;

  const fillerWords: string[] = useMemo(() => {
    try {
      return JSON.parse(params.fillerWords ?? "[]");
    } catch {
      return [];
    }
  }, [params.fillerWords]);

  const fillerCounts: FillerCount = sessionData.fillerCounts ?? {};
  const transcript = sessionData.transcript ?? "";
  const wordRate = sessionData.wordRatePerMinute ?? 0;
  const totalFillerWords = sessionData.totalFillerWords ?? 0;
  const evaluation = sessionData.evaluation ?? {};

  const skillBreakdown = Array.isArray(evaluation.skillBreakdown)
    ? evaluation.skillBreakdown
    : [];
  const recommendedActions = Array.isArray(evaluation.recommendedActions)
    ? evaluation.recommendedActions
    : [];

  const skillLabels = skillBreakdown.map((s) => s.skill);
  const skillScores = skillBreakdown.map((s) => s.score);

  // Pills: show all tracked filler words that appeared
  const fillerPills = fillerWords
    .map((word) => ({ word, count: fillerCounts[word.toLowerCase()] ?? 0 }))
    .filter((p) => p.count > 0);

  // Effective highlighted word: if pill selected, highlight that word; else highlight all
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
        {/* Question */}
        <Text style={styles.questionText}>{question}</Text>

        {/* Video placeholder */}
        <View style={styles.mediaCard}>
          <Image source={mediaImage} style={styles.mediaImage} />

          <View style={styles.mediaOverlay} />

          <View style={styles.mediaPlayButton}>
            <Ionicons name="play" size={26} color={Colors.shade[200]} />
          </View>
        </View>

        {/* Quick Summary */}
        <CollapsibleSection
          title="Quick Summary"
          headerStyle={styles.quickSummaryHeader}
          contentStyle={styles.quickSummaryContent}
        >
          <Text style={styles.quickSummaryText}>
            {evaluation.quickSummary ?? "Great effort! Review your filler word usage below."}
          </Text>
        </CollapsibleSection>

        {/* Stats */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Total Filler Words</Text>
            <Text style={styles.summaryValue}>{totalFillerWords}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Word Rate</Text>
            <Text style={styles.summaryValue}>
              {wordRate}
              <Text style={styles.summaryUnit}> /min</Text>
            </Text>
          </View>
        </View>

        {/* Filler Word Pills */}
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
                ? `Showing "${selectedPill}" highlights. Tap again to clear.`
                : "Tap a pill to highlight that word in the transcript."}
            </Text>
          </View>
        )}

        {/* Transcript */}
        <CollapsibleSection title="Transcript">
          <HighlightedTranscript
            text={transcript}
            fillerWords={fillerWords}
            selectedWord={effectiveHighlightWord}
          />
        </CollapsibleSection>

        {/* Skill Breakdown */}
        {skillBreakdown.length > 0 && (
          <>
            <Pressable style={styles.skillHeader} onPress={() => setSkillsModalOpen(true)}>
              <Text style={styles.sectionTitle}>Skill Breakdown</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.octonary.DEFAULT} />
            </Pressable>

            <View style={styles.skillCard}>
              <SkillRadar labels={skillLabels} values={skillScores} size={220} />
            </View>
          </>
        )}

        {/* Recommended Actions */}
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

        {/* Okay Button */}
        <Pressable style={styles.primaryButton} onPress={() => router.replace("/home")}>
          <Text style={styles.primaryButtonText}>Okay</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.footerBold}>My Recordings</Text>
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
              {skillBreakdown.map((skill) => (
                <View key={skill.skill} style={styles.modalSkillCard}>
                  <View style={styles.modalSkillHeader}>
                    <Text style={styles.modalSkillTitle}>{skill.skill}</Text>
                    <Text style={styles.modalSkillScore}>{skill.score}</Text>
                  </View>

                  <Text style={styles.modalSkillLevel}>{skill.level}</Text>

                  <Text style={styles.modalTipLabel}>Reason</Text>
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
  questionText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 28,
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
  },
  quickSummaryText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
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
    fontSize: 28,
    color: Colors.octonary.DEFAULT,
    marginTop: 4,
  },
  summaryUnit: {
    fontSize: 13,
    color: Colors.shade[100],
  },
  pillsSection: {
    gap: 8,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fillerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.senary[300],
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
    color: Colors.shade[100],
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
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    paddingHorizontal: 2,
  },
  sectionBody: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  skillCard: {
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
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
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
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
});

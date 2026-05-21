import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import PracticeCameraPanel from "../components/practice-camera-panel";
import SpeakingTimeInput, { parseTimeToSeconds } from "../components/speaking-time-input";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-motif.png");
const heroImage = require("../assets/images/casualmode/filler-free.png");
const logoRhetora = require("../assets/images/logorhetora.png");
const tutorialSteps = [
  "After setting up your camera and microphone, start the session and you’ll be given a simple topic to talk about.",
  "As you speak, focus on reducing filler words such as “um”, “uh”, or “like”. Instead of filling silence, try pausing briefly to collect your thoughts.",
  "The goal is not to speak faster, but to speak more clearly and intentionally.",
];

const defaultWords = ["um", "like", "so", "right"];

export default function FillerFree() {
  const router = useRouter();
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [tutorialCollapsed, setTutorialCollapsed] = useState(false);
  const [skipTutorial, setSkipTutorial] = useState(false);
  const [words, setWords] = useState<string[]>(defaultWords);
  const [addOpen, setAddOpen] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [timeValue, setTimeValue] = useState({ hours: "00", minutes: "10", seconds: "00" });

  const activeStep = useMemo(() => tutorialSteps[tutorialIndex], [tutorialIndex]);

  const handleNextTutorial = () => {
    if (tutorialIndex >= tutorialSteps.length - 1) {
      setTutorialVisible(false);
      return;
    }
    setTutorialIndex((prev) => prev + 1);
  };

  const handleAddWord = () => {
    const trimmed = newWord.trim();
    if (!trimmed) {
      return;
    }

    const normalized = trimmed.toLowerCase();
    if (!words.some((word) => word.toLowerCase() === normalized)) {
      setWords((prev) => [...prev, trimmed]);
    }

    setNewWord("");
    setAddOpen(false);
  };

  const handleRemoveWord = (wordToRemove: string) => {
    setWords((prev) => prev.filter((word) => word !== wordToRemove));
  };

  const handleStart = () => {
    const totalSeconds = parseTimeToSeconds(timeValue) || 10 * 60;
    router.push({
      pathname: "/practice-session",
      params: {
        cameraOn: "true",
        totalSeconds: String(totalSeconds),
      },
    });
  };

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Filler-Free"
        variant="transparent"
        onBack={() => router.back()}
        rightElement={
          <Pressable
            style={styles.infoButton}
            onPress={() => {
              setTutorialVisible(true);
              setTutorialIndex(0);
            }}
          >
            <Ionicons name="information" size={18} color={Colors.shade[200]} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <Text style={styles.heroText}>
            Reduce your use of “um”, “uh”, and other
            filler words.
          </Text>
        </View>

        <PracticeCameraPanel showStatus placeholder={
          <Image
            source={logoRhetora}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
          } 
        />

        <Pressable
          style={styles.tutorialCard}
          onPress={() => setTutorialCollapsed((prev) => !prev)}
        >
          <View style={styles.tutorialHeader}>
            <Text style={styles.tutorialTitle}>How to Tutorial</Text>
            <Ionicons
              name={tutorialCollapsed ? "chevron-down" : "chevron-up"}
              size={20}
              color={Colors.octonary.DEFAULT}
            />
          </View>
          {!tutorialCollapsed && (
            <View style={styles.tutorialBody}>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  You’ll speak about a simple topic
                </Text>
              </View>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  Try to avoid filler words like “um” or “uh”
                </Text>
              </View>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  Use pauses instead to stay clear and smooth
                </Text>
              </View>
            </View>
          )}
        </Pressable>

        <SpeakingTimeInput value={timeValue} onChange={setTimeValue} />

        <Text style={styles.wordBankLabel}>Word Bank</Text>
        <View style={styles.wordBankRow}>
          {words.map((word) => (
            <View key={word} style={styles.wordChip}>
              <Text style={styles.wordText}>{word}</Text>
              <Pressable
                style={styles.wordRemove}
                onPress={() => handleRemoveWord(word)}
              >
                <Ionicons name="close" size={14} color={Colors.error[400]} />
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.addChip} onPress={() => setAddOpen(true)}>
            <Text style={styles.addChipText}>+ Add</Text>
          </Pressable>
        </View>

        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>

        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>
      </ScrollView>

      <Modal visible={addOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Filler Word Bank</Text>
            <TextInput
              placeholder="Enter word"
              placeholderTextColor={Colors.neutral[300]}
              value={newWord}
              onChangeText={setNewWord}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => {
                  setNewWord("");
                  setAddOpen(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleAddWord}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {tutorialVisible && (
        <View style={styles.tutorialOverlay}>
          <View style={styles.tutorialModal}>
            <Pressable
              style={styles.tutorialClose}
              onPress={() => setTutorialVisible(false)}
            >
              <Ionicons name="close" size={20} color={Colors.octonary.DEFAULT} />
            </Pressable>
            <Image source={heroImage} style={styles.tutorialImage} />
            <Text style={styles.tutorialModalTitle}>Filler-Free</Text>
            <Text style={styles.tutorialModalText}>{activeStep}</Text>

            <View style={styles.tutorialDots}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[styles.tutorialDot, index === tutorialIndex && styles.tutorialDotActive]}
                />
              ))}
            </View>

            <Pressable
              style={styles.tutorialCheckbox}
              onPress={() => setSkipTutorial((prev) => !prev)}
            >
              <View style={styles.checkboxBox}>
                {skipTutorial && (
                  <Ionicons name="checkmark" size={16} color={Colors.octonary.DEFAULT} />
                )}
              </View>
              <Text style={styles.checkboxText}>Don't show this again</Text>
            </Pressable>

            <Pressable style={styles.tutorialNext} onPress={handleNextTutorial}>
              <Text style={styles.tutorialNextText}>
                {tutorialIndex === tutorialSteps.length - 1 ? "Done" : "Next"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
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
    paddingTop: 20,
    paddingBottom: 40,
    gap: 18,
  },
  infoButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.octonary.DEFAULT,
  },
  heroRow: {
    alignItems: "center",
    gap: 12,
  },
  heroImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  heroText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 22,
  },
  micPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.warning[100],
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    padding: 16,
  },
  tutorialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tutorialTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  tutorialBody: {
    marginTop: 12,
    gap: 10,
  },
  tutorialBulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  tutorialBullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  tutorialText: {
    flex: 1,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timerLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  timerDefault: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerDefaultText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeBoxWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeBox: {
    width: 64,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
  },
  timeDivider: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
  },
  wordBankLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    marginTop: 6,
  },
  wordBankRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  wordChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.warning[100],
  },
  wordText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  wordRemove: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  addChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
  },
  addChipText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  startButton: {
    marginTop: 4,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  disclaimerText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    marginBottom: 40,
  },
  disclaimerBold: {
    fontFamily: "AlbertSans-Bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 16,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancel: {
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.senary[300],
  },
  modalCancelText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.senary[300],
  },
  modalSaveText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  tutorialModal: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 14,
  },
  tutorialClose: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  tutorialImage: {
    width: 96,
    height: 96,
    resizeMode: "contain",
  },
  tutorialModalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  tutorialModalText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 20,
  },
  tutorialDots: {
    flexDirection: "row",
    gap: 8,
  },
  tutorialDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.neutral[300],
  },
  tutorialDotActive: {
    backgroundColor: Colors.senary[300],
  },
  tutorialCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  tutorialNext: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialNextText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
});

import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import PracticeCameraPanel from "../components/practice-camera-panel";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-motif.png");
const heroImage = require("../assets/images/casualmode/the-pitch-lab.png");
const logoRhetora = require("../assets/images/logorhetora.png");
const tutorialSteps = [
  "You'll be given a scenario or idea to present.",
  "Take a moment to think about your main message--what you're presenting, why it matters, and what makes it valuable.",
  "When you start speaking, focus on delivering your pitch in a structured way: introduce the idea, explain it clearly, and end with a strong closing.",
  "You'll have a limited time, so aim to be concise and impactful.",
];

const pitchOptions = ["Product Idea", "Startup Idea", "Personal Pitch"] as const;

type PitchOption = (typeof pitchOptions)[number];

export default function PitchLab() {
  const router = useRouter();
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [tutorialCollapsed, setTutorialCollapsed] = useState(false);
  const [skipTutorial, setSkipTutorial] = useState(false);
  const [pitchOpen, setPitchOpen] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<PitchOption>("Product Idea");

  const activeStep = useMemo(() => tutorialSteps[tutorialIndex], [tutorialIndex]);

  const handleNextTutorial = () => {
    if (tutorialIndex >= tutorialSteps.length - 1) {
      setTutorialVisible(false);
      return;
    }
    setTutorialIndex((prev) => prev + 1);
  };

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="The Pitch Lab"
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
            Deliver a short pitch that is clear,
            structured, & persuasive.
          </Text>
        </View>

        <PracticeCameraPanel
          showStatus
          placeholder={
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
                  You'll be given a scenario or idea to pitch
                </Text>
              </View>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  Prepare your key points briefly
                </Text>
              </View>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  Deliver a short and convincing pitch, focus
                  on structure!
                </Text>
              </View>
            </View>
          )}
        </Pressable>

        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>Speaking Time</Text>
          <View style={styles.timerDefault}>
            <Ionicons name="refresh" size={16} color={Colors.octonary.DEFAULT} />
            <Text style={styles.timerDefaultText}>Default</Text>
          </View>
        </View>

        <View style={styles.timeInputs}>
          {[
            { label: "00", key: "hours" },
            { label: "10", key: "minutes" },
            { label: "00", key: "seconds" },
          ].map((item, index) => (
            <View key={item.key} style={styles.timeBoxWrap}>
              <View style={styles.timeBox}>
                <Text style={styles.timeValue}>{item.label}</Text>
              </View>
              {index < 2 && <Text style={styles.timeDivider}>:</Text>}
            </View>
          ))}
        </View>

        <View style={styles.selectRow}>
          <Text style={styles.selectLabel}>Pitch Type</Text>
        </View>
        <Pressable style={styles.selectField} onPress={() => setPitchOpen((prev) => !prev)}>
          <Text style={styles.selectValue}>{selectedPitch}</Text>
          <Ionicons name={pitchOpen ? "chevron-up" : "chevron-down"} size={18} color={Colors.neutral[400]} />
        </Pressable>
        {pitchOpen && (
          <View style={styles.selectList}>
            {pitchOptions.map((option, index) => (
              <Pressable
                key={option}
                style={[
                  styles.selectItem,
                  option === selectedPitch && styles.selectItemActive,
                  index === pitchOptions.length - 1 && styles.selectItemLast,
                ]}
                onPress={() => {
                  setSelectedPitch(option);
                  setPitchOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.selectItemText,
                    option === selectedPitch && styles.selectItemTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.quickTips}>
          <View style={styles.quickTipsHeader}>
            <View style={styles.quickTipsLeft}>
              <Ionicons name="bulb" size={20} color={Colors.octonary.DEFAULT} />
              <Text style={styles.quickTipsTitle}>Quick Tips</Text>
            </View>
            <Ionicons name="chevron-up" size={18} color={Colors.octonary.DEFAULT} />
          </View>
          <View style={styles.quickTipsBody}>
            <View style={styles.quickTipsRow}>
              <Text style={styles.quickTipsBullet}>•</Text>
              <Text style={styles.quickTipsText}>
                Start with your name and something simple about yourself
              </Text>
            </View>
            <View style={styles.quickTipsRow}>
              <Text style={styles.quickTipsBullet}>•</Text>
              <Text style={styles.quickTipsText}>
                Keep your sentences short and clear
              </Text>
            </View>
            <View style={styles.quickTipsRow}>
              <Text style={styles.quickTipsBullet}>•</Text>
              <Text style={styles.quickTipsText}>
                Don't worry about being perfect--just be natural!
              </Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>

        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>
      </ScrollView>

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
            <Text style={styles.tutorialModalTitle}>The Pitch Lab</Text>
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
    gap: 16,
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
  selectRow: {
    marginTop: 4,
  },
  selectLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  selectField: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectValue: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.neutral[400],
  },
  selectList: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    marginTop: 10,
    overflow: "hidden",
  },
  selectItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  selectItemLast: {
    borderBottomWidth: 0,
  },
  selectItemActive: {
    backgroundColor: Colors.warning[400],
  },
  selectItemText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.senary[300],
  },
  selectItemTextActive: {
    color: Colors.shade[200],
  },
  quickTips: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.warning[100],
    padding: 16,
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

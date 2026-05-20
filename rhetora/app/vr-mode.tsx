import { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
import {
  getMockUserData,
  subscribeToMockUser,
  updateMockUserData,
} from "../data/mock-user";

const bgImage = require("../assets/images/bg-motif.png");
const coinImage = require("../assets/images/shop/coin.png");
const vrTutorialImage = require("../assets/images/vr/vr-tutorial.png");
const vrClassroomImage = require("../assets/images/vr/school.png");
const vrMeetingImage = require("../assets/images/vr/meeting.png");
const vrPodiumImage = require("../assets/images/vr/podium.png");

const tutorialSteps = [
  "Practice speaking in realistic scenarios with a virtual audience to prepare for real-life situations like presentations, meetings, and interviews.",
  "Choose a scenario and customize your session.\nYou can adjust the audience, duration, and difficulty based on your comfort level.",
  "Make sure your microphone are ready. You’ll have a few seconds to prepare before the session begins—just speak naturally and do your best.",
];

const vrScenarios = [
  {
    id: "vr-classroom",
    title: "Classroom",
    image: vrClassroomImage,
    price: 0,
  },
  {
    id: "vr-meeting",
    title: "Meeting Room",
    image: vrMeetingImage,
    price: 120,
  },
  {
    id: "vr-podium",
    title: "Podium",
    image: vrPodiumImage,
    price: 120,
  },
];

export default function VrMode() {
  const router = useRouter();
  const [userData, setUserData] = useState(getMockUserData());
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [skipTutorial, setSkipTutorial] = useState(false);
  const [unlockVisible, setUnlockVisible] = useState(false);
  const [unlockScenarioId, setUnlockScenarioId] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (skipTutorial) {
      setTutorialVisible(false);
    }
  }, [skipTutorial]);

  const activeStep = useMemo(() => tutorialSteps[tutorialIndex], [tutorialIndex]);

  const handleNextTutorial = () => {
    if (tutorialIndex >= tutorialSteps.length - 1) {
      setTutorialVisible(false);
      return;
    }
    setTutorialIndex((prev) => prev + 1);
  };

  const isUnlocked = (scenarioId: string) => userData.unlockedVrIds.includes(scenarioId);

  const handleScenarioPress = (scenarioId: string) => {
    if (!isUnlocked(scenarioId)) {
      setUnlockScenarioId(scenarioId);
      setUnlockError("");
      setUnlockVisible(true);
      return;
    }
    router.push({ pathname: "/vr-setup", params: { scenarioId } });
  };

  const handleUnlock = () => {
    if (!unlockScenarioId) {
      return;
    }

    const scenario = vrScenarios.find((item) => item.id === unlockScenarioId);
    if (!scenario) {
      return;
    }

    const currentUser = getMockUserData();
    if (currentUser.coins < scenario.price) {
      setUnlockError("Not enough coins");
      return;
    }

    const nextUnlocked = currentUser.unlockedVrIds.includes(unlockScenarioId)
      ? currentUser.unlockedVrIds
      : [...currentUser.unlockedVrIds, unlockScenarioId];

    updateMockUserData({
      coins: currentUser.coins - scenario.price,
      unlockedVrIds: nextUnlocked,
    });

    router.push({ pathname: "/vr-setup", params: { scenarioId: unlockScenarioId } });
    setUnlockVisible(false);
  };

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader
          title="Setup VR Mode (1/3)"
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
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Select a scenario</Text>

        <View style={styles.scenarioList}>
          {vrScenarios.map((scenario) => {
            const unlocked = isUnlocked(scenario.id);

            return (
              <Pressable
                key={scenario.id}
                style={styles.scenarioCard}
                onPress={() => handleScenarioPress(scenario.id)}
              >
                <Image source={scenario.image} style={styles.scenarioImage} />
                <View style={styles.scenarioFooter}>
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                  {!unlocked && (
                    <View style={styles.lockPill}>
                      <Ionicons name="lock-closed" size={14} color={Colors.octonary.DEFAULT} />
                      <Text style={styles.lockText}>{scenario.price}</Text>
                    </View>
                  )}
                </View>
                {!unlocked && <View style={styles.lockedOverlay} />}
              </Pressable>
            );
          })}
        </View>

      </ScrollView>

      <View style={styles.navWrap}>
        <NavBar activeKey="practice" />
      </View>

      <Modal transparent animationType="fade" visible={tutorialVisible && !skipTutorial}>
        <View style={styles.tutorialOverlay}>
          <View style={styles.tutorialModal}>
            <Pressable style={styles.tutorialClose} onPress={() => setTutorialVisible(false)}>
              <Ionicons name="close" size={20} color={Colors.octonary.DEFAULT} />
            </Pressable>
            <Image source={vrTutorialImage} style={styles.tutorialImage} />
            <Text style={styles.tutorialModalTitle}>What is VR Mode?</Text>
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
              <View style={[styles.checkboxBox, skipTutorial && styles.checkboxBoxActive]}>
                {skipTutorial && (
                  <Ionicons name="checkmark" size={14} color={Colors.octonary.DEFAULT} />
                )}
              </View>
              <Text style={styles.checkboxText}>Don't show this again</Text>
            </Pressable>
            <Pressable style={styles.tutorialNext} onPress={handleNextTutorial}>
              <Text style={styles.tutorialNextText}>Next</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={unlockVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>This scenario is still locked</Text>
            <View style={styles.modalRow}>
              <Text style={styles.modalSubtitle}>Unlock with</Text>
              <Image source={coinImage} style={styles.modalCoin} />
              <Text style={styles.modalSubtitle}>
                {vrScenarios.find((item) => item.id === unlockScenarioId)?.price ?? 0}
              </Text>
            </View>
            <View style={styles.modalPreview}>
              {unlockScenarioId && (
                <Image
                  source={vrScenarios.find((item) => item.id === unlockScenarioId)?.image}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.modalScenarioTitle}>
                {vrScenarios.find((item) => item.id === unlockScenarioId)?.title}
              </Text>
            </View>
            {unlockError ? <Text style={styles.modalError}>{unlockError}</Text> : null}
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setUnlockVisible(false)}
              >
                <Text style={styles.modalButtonTextNo}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonUnlock]}
                onPress={handleUnlock}
              >
                <Text style={styles.modalButtonTextUnlock}>Unlock</Text>
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
  safeArea: {
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 130,
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
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  scenarioList: {
    gap: 16,
  },
  scenarioCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.blue[400],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
  },
  scenarioImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  scenarioFooter: {
    paddingVertical: 10,
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  scenarioTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  lockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lockText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
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
  checkboxBoxActive: {
    backgroundColor: Colors.warning[200],
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 24,
  },
  modalSubtitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  modalCoin: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  modalPreview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    marginBottom: 16,
    justifyContent: "flex-end",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalScenarioTitle: {
    position: "absolute",
    left: 12,
    bottom: 12,
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
    textShadowColor: Colors.octonary.DEFAULT,
    textShadowOffset: { width: -1.5, height: 1.5 },
    textShadowRadius: 1,
  },
  modalError: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.error[500],
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonNo: {
    backgroundColor: Colors.shade[200],
    borderWidth: 2,
    borderColor: Colors.senary[300],
  },
  modalButtonUnlock: {
    backgroundColor: Colors.senary[300],
  },
  modalButtonTextNo: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  modalButtonTextUnlock: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
});

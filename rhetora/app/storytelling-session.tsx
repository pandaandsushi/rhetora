import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "../constants/colors";
import PracticeCameraPanel from "../components/practice-camera-panel";
import TopHeader from "../components/top-header";
const logoRhetora = require("../assets/images/logorhetora.png");

export default function StorytellingSession() {
  const router = useRouter();

  const { genre, hours, minutes, seconds, cameraOn, maxTurns } = useLocalSearchParams<{
    genre: string;
    hours: string;
    minutes: string;
    seconds: string;
    cameraOn: string;
    maxTurns: string;
  }>();
  console.log("Received params:", { genre, hours, minutes, seconds, cameraOn, maxTurns });
  const initialTotalSeconds = useMemo(() => {
    const h = parseInt(hours || "0", 10);
    const m = parseInt(minutes || "10", 10);
    const s = parseInt(seconds || "0", 10);
    return h * 3600 + m * 60 + s;
  }, [hours, minutes, seconds]);

  const [remainingSeconds, setRemainingSeconds] = useState(initialTotalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  
  const [restartVisible, setRestartVisible] = useState(false);
  const [finishVisible, setFinishVisible] = useState(false);
  const [timeUpVisible, setTimeUpVisible] = useState(false);

  const [aiPrompt, setAiPrompt] = useState(
    "The lights flickered as you walked down the empty hallway. From your room window, you saw a figure standing still, staring directly at you..."
  );

  const progress = initialTotalSeconds > 0 ? remainingSeconds / initialTotalSeconds : 0;
  const ringSize = 110;
  const ringStroke = 8;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  const maxTurnCount = useMemo(() => {
    const parsed = Number(maxTurns);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 4;
  }, [maxTurns]);
  
  const formattedTime = useMemo(() => {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [remainingSeconds]);

  useEffect(() => {
    if (isPaused || timeUpVisible) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeUpVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeUpVisible]);

  const handleRestart = () => {
    setRemainingSeconds(initialTotalSeconds);
    setIsPaused(false);
    setRestartVisible(false);
  };

  const handleFinish = () => {
    setFinishVisible(false);
    router.back();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topSafeArea}>
        <TopHeader
          title="Storytelling Practice"
          variant="solid"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cameraWrapper}>
          <PracticeCameraPanel
          initialCameraOn={cameraOn === "true"}
          placeholder={
            <Image
              source={logoRhetora}
              style={{ width: 90, height: 90 }}
              resizeMode="contain"
            />
          }
        />
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.timerCircle}>
            <Svg width={ringSize} height={ringSize} style={styles.timerSvg}>
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                stroke={Colors.warning[100]}
                strokeWidth={ringStroke}
                fill="none"
              />
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                stroke={Colors.quinary[300]}
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                strokeDashoffset={ringOffset}
                fill="none"
                rotation="-90"
                origin={`${ringSize / 2}, ${ringSize / 2}`}
              />
            </Svg>
            <Text style={styles.timerText}>{formattedTime}</Text>
          </View>

          <View style={styles.actionButtonsWrap}>
            <Pressable style={styles.actionButton} onPress={() => setRestartVisible(true)}>
              <View style={styles.actionIconWrap}>
                <Ionicons name="refresh" size={24} color={Colors.shade[200]} />
              </View>
              <Text style={styles.actionLabel}>Restart</Text>
            </Pressable>

            <Pressable style={styles.actionButton} onPress={() => setIsPaused((prev) => !prev)}>
              <View style={styles.actionIconWrapLight}>
                <Ionicons
                  name={isPaused ? "play" : "pause"}
                  size={24}
                  color={Colors.octonary.DEFAULT}
                />
              </View>
              <Text style={styles.actionLabel}>{isPaused ? "Resume" : "Pause"}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.storyPromptContainer}>
          <Text style={styles.storyPromptText}>{aiPrompt}</Text>
        </View>

        <Pressable style={styles.finishButton} onPress={() => setFinishVisible(true)}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </ScrollView>

      <Modal transparent animationType="fade" visible={restartVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Are you sure you want to restart this session?</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalGhostButton} onPress={() => setRestartVisible(false)}>
                <Text style={styles.modalGhostText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalConfirmButton} onPress={handleRestart}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={finishVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>You still have some time, are you sure you want to finish this session?</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalGhostButton} onPress={() => setFinishVisible(false)}>
                <Text style={styles.modalGhostText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalConfirmButton} onPress={handleFinish}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={timeUpVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Time's up! Great job finishing the session.</Text>
            <Pressable style={styles.modalConfirmButton} onPress={() => router.back()}>
              <Text style={styles.modalConfirmText}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  topSafeArea: {
    backgroundColor: Colors.senary[300],
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  cameraWrapper: {
    width: "100%",
    marginBottom: 30,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  timerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  timerSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  timerText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 26,
    color: Colors.octonary.DEFAULT,
  },
  actionButtonsWrap: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    alignItems: "center",
    gap: 10,
  },
  actionIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.error[500],
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconWrapLight: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.warning[100],
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  storyPromptContainer: {
    width: "100%",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  storyPromptText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 26,
  },
  finishButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  finishButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    gap: 20,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalGhostButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  modalGhostText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  modalConfirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
});
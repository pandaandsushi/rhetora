import { useEffect, useMemo, useRef, useState } from "react";
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
import { Audio } from "expo-av";

import { Colors } from "../constants/colors";
import PracticeCameraPanel from "../components/practice-camera-panel";
import TopHeader from "../components/top-header";
import { BACKEND_URL } from "../constants/api";
const logoRhetora = require("../assets/images/logorhetora.png");

type StoryTurn = {
  id: string;
  speaker: "ai" | "user";
  text: string;
  transcript?: string;
  createdAt: string;
};

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
  const timePerTurnSeconds = useMemo(() => {
    const h = parseInt(hours || "0", 10);
    const m = parseInt(minutes || "1", 10);
    const s = parseInt(seconds || "0", 10);
    const total = h * 3600 + m * 60 + s;
    return total > 0 ? total : 60;
  }, [hours, minutes, seconds]);

  const [remainingSeconds, setRemainingSeconds] = useState(timePerTurnSeconds);
  const [phase, setPhase] = useState<"ai" | "recording" | "processing" | "finished">("ai");
  const [turns, setTurns] = useState<StoryTurn[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  
  const [restartVisible, setRestartVisible] = useState(false);
  const [timeUpVisible, setTimeUpVisible] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("Loading...");
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef(false);

  const progress = timePerTurnSeconds > 0 ? remainingSeconds / timePerTurnSeconds : 0;
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
    let isMounted = true;

    const loadInitialPrompt = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/storytelling/initial`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ genre }),
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        if (!isMounted) {
          return;
        }
        const aiTurn: StoryTurn = {
          id: `ai-${Date.now()}`,
          speaker: "ai",
          text: data.text,
          createdAt: new Date().toISOString(),
        };
        setTurns([aiTurn]);
        setAiPrompt(data.text);
      } catch (error) {
        console.warn("Failed to load initial prompt", error);
        if (isMounted) {
          setAiPrompt("Start the story with your imagination.");
        }
      }
    };

    loadInitialPrompt();

    return () => {
      isMounted = false;
    };
  }, [genre]);

  const clearTurnTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTurnTimer();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => null);
        recordingRef.current = null;
      }
    };
  }, []);

  const startTurnTimer = () => {
    clearTurnTimer();
    setRemainingSeconds(timePerTurnSeconds);
    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTurnTimer();
          setTimeUpVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      console.log("[Story] Requesting mic permission...");
      const { granted, status } = await Audio.requestPermissionsAsync();

      console.log("[Story] Mic permission:", { granted, status });

      if (!granted) {
        console.warn("[Story] Mic permission not granted");
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      console.log("[Story] Starting recording...");

      const { recording } = await Audio.Recording.createAsync({
        isMeteringEnabled: false,
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 64000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MIN,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 64000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });

      recordingRef.current = recording;

      console.log("[Story] Recording started:", !!recordingRef.current);

      return true;
    } catch (error) {
      console.warn("[Story] Recording failed to start", error);
      recordingRef.current = null;
      return false;
    }
  };

  const stopRecording = async () => {
    const recording = recordingRef.current;

    console.log("[Story] stopRecording called. recording exists?", !!recording);

    if (!recording) {
      return null;
    }

    try {
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      console.log("[Story] Recording URI:", uri);

      recordingRef.current = null;
      return uri ?? null;
    } catch (error) {
      console.warn("[Story] Recording failed to stop", error);
      recordingRef.current = null;
      return null;
    }
  };

  const submitTurn = async () => {
    if (submitRef.current || phase !== "recording") {
      return;
    }
    submitRef.current = true;
    setPhase("processing");
    clearTurnTimer();

    try {
      const uri = await stopRecording();
      if (!uri) {
        throw new Error("Recording not available");
      }

      const formData = new FormData();
      formData.append("audio", {
        uri,
        name: `story-turn-${currentTurn}.m4a`,
        type: "audio/m4a",
      } as unknown as Blob);
      formData.append("genre", genre ?? "");
      formData.append("currentTurn", String(currentTurn));
      formData.append("maxTurns", String(maxTurnCount));
      formData.append("turns", JSON.stringify(turns));

      const response = await fetch(`${BACKEND_URL}/storytelling/turn`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const nextTurns = data.turns ?? turns;
      setTurns(nextTurns);
      if (data.nextPrompt) {
        setAiPrompt(data.nextPrompt);
      }

      const nextTurnIndex = currentTurn + 1;
      if (nextTurnIndex > maxTurnCount || !data.nextPrompt) {
        setPhase("finished");
        await finalizeEvaluation(nextTurns, data.metrics);
      } else {
        setCurrentTurn(nextTurnIndex);
        setPhase("ai");
        setTimeUpVisible(false);
      }
    } catch (error) {
      console.warn("Failed to submit turn", error);
      setPhase("ai");
    } finally {
      submitRef.current = false;
    }
  };

  const finalizeEvaluation = async (nextTurns: StoryTurn[], metrics: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}/storytelling/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turns: nextTurns, genre, metrics }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      router.replace({
        pathname: "/storytelling-evaluation",
        params: {
          data: JSON.stringify(data.evaluation),
        },
      });
    } catch (error) {
      console.warn("Failed to generate evaluation", error);
      router.replace("/storytelling-evaluation");
    }
  };

  const handleRestart = () => {
    setRemainingSeconds(timePerTurnSeconds);
    setPhase("ai");
    setRestartVisible(false);
  };

  const handleStartTalking = async () => {
    if (phase !== "ai") {
      return;
    }

    setTimeUpVisible(false);
    setPhase("processing");

    const started = await startRecording();

    if (!started) {
      setPhase("ai");
      return;
    }

    setPhase("recording");
    startTurnTimer();
  };

  useEffect(() => {
    if (!timeUpVisible || phase !== "recording") {
      return;
    }
    setTimeUpVisible(false);
    submitTurn();
  }, [timeUpVisible, phase]);

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
          </View>
        </View>

        <View style={styles.storyPromptContainer}>
          <Text style={styles.storyPromptText}>{aiPrompt}</Text>
        </View>

        {phase === "ai" && (
          <Pressable style={styles.startTalkingButton} onPress={handleStartTalking}>
            <Text style={styles.startTalkingText}>Start Talking</Text>
          </Pressable>
        )}

        {phase === "recording" && (
          <Pressable style={styles.finishButton} onPress={submitTurn}>
            <Text style={styles.finishButtonText}>Submit Turn</Text>
          </Pressable>
        )}

        {phase === "processing" && (
          <Text style={styles.processingText}>Processing your turn...</Text>
        )}
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
  startTalkingButton: {
    width: "100%",
    height: 54,
    borderRadius: 30,
    backgroundColor: Colors.quinary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  startTalkingText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  processingText: {
    fontFamily: "AlbertSans-Medium",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
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
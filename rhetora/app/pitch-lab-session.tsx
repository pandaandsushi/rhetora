import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CollapsibleSection from "../components/collapsible-section";
import Svg, { Circle } from "react-native-svg";
import { Audio } from "expo-av";

import { Colors } from "../constants/colors";
import TopHeader from "../components/top-header";
import PracticeCameraPanel from "../components/practice-camera-panel";
import { BACKEND_URL } from "../constants/api";
import pitchFallback from "./pitchlab-fallback.json";

const logoRhetora = require("../assets/images/logorhetora.png");

type PitchPrompt = {
  title: string;
  instruction: string;
  tips?: {
    hook?: string;
    problem?: string;
    solution?: string;
    value?: string;
    closing?: string;
  };
};

export default function PitchLabSession() {
  const router = useRouter();
  const { pitchType, totalSeconds, cameraOn } = useLocalSearchParams<{
    pitchType?: string;
    totalSeconds?: string;
    cameraOn?: string;
  }>();

  const initialTotalSeconds = useMemo(() => {
    const parsed = Number(totalSeconds);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 600;
  }, [totalSeconds]);

  const [prompt, setPrompt] = useState<PitchPrompt>(pitchFallback.prompt);
  const [promptLoading, setPromptLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(initialTotalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [finishVisible, setFinishVisible] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = initialTotalSeconds > 0 ? remainingSeconds / initialTotalSeconds : 0;
  const ringSize = 110;
  const ringStroke = 8;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  const formattedTime = useMemo(() => {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [remainingSeconds]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();

      if (!granted) {
        Alert.alert("Microphone permission required", "Please allow microphone access.");
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

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
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });

      recordingRef.current = recording;
      setIsRecording(true);
      return true;
    } catch (error) {
      console.warn("[Pitch] Failed to start recording", error);
      Alert.alert("Recording failed", "Please try again.");
      return false;
    }
  };

  const stopRecording = async () => {
    const recording = recordingRef.current;

    if (!recording) {
      return null;
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      return uri;
    } catch (error) {
      console.warn("[Pitch] Failed to stop recording", error);
      recordingRef.current = null;
      setIsRecording(false);
      return null;
    }
  };

  const startTimer = () => {
    clearTimer();

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleFinishSession();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const handleStartSession = async () => {
    const started = await startRecording();

    if (started) {
      setSessionStarted(true);
      startTimer();
    }
  };

  const handleRestart = async () => {
    clearTimer();

    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync().catch(() => null);
      recordingRef.current = null;
    }

    setRemainingSeconds(initialTotalSeconds);
    setIsPaused(false);
    setIsRecording(false);
    setSessionStarted(false);

    await handleStartSession();
  };

  const handleFinishSession = async () => {
    clearTimer();

    const audioUri = await stopRecording();

    if (!audioUri) {
      Alert.alert("Recording not available", "Please try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: audioUri,
        name: `pitch-${Date.now()}.m4a`,
        type: "audio/m4a",
      } as unknown as Blob);
      formData.append("pitchType", pitchType ?? pitchFallback.pitchType);
      formData.append("promptTitle", prompt.title);
      formData.append("promptInstruction", prompt.instruction);

      const response = await fetch(`${BACKEND_URL}/pitch/evaluate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      router.replace({
        pathname: "/pitch-lab-evaluation",
        params: {
          data: JSON.stringify(data.evaluation),
        },
      });
    } catch (error) {
      console.warn("[Pitch] Evaluation failed", error);
      const fallbackData = {
        ...pitchFallback,
        pitchType: pitchType ?? pitchFallback.pitchType,
        prompt,
      };
      router.replace({
        pathname: "/pitch-lab-evaluation",
        params: {
          data: JSON.stringify(fallbackData),
        },
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPrompt = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/pitch/initial`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pitchType }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        if (isMounted && data?.prompt) {
          setPrompt(data.prompt);
        }
      } catch (error) {
        console.warn("[Pitch] Failed to load prompt", error);
      } finally {
        if (isMounted) {
          setPromptLoading(false);
        }
      }
    };

    loadPrompt();

    return () => {
      isMounted = false;
      clearTimer();

      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => null);
        recordingRef.current = null;
      }
    };
  }, [pitchType]);

  useEffect(() => {
    if (!timerRef.current || !sessionStarted) {
      return;
    }

    if (isPaused) {
      clearTimer();
    } else if (isRecording) {
      startTimer();
    }
  }, [isPaused, sessionStarted]);

  const promptDetails = useMemo(() => {
  return {
    title: prompt?.title ?? pitchFallback.prompt.title,
    instruction: prompt?.instruction ?? pitchFallback.prompt.instruction,
    tips: {
      hook: prompt?.tips?.hook ?? "",
      problem: prompt?.tips?.problem ?? "",
      solution: prompt?.tips?.solution ?? "",
      value: prompt?.tips?.value ?? "",
      closing: prompt?.tips?.closing ?? "",
    },
  };
}, [prompt]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topSafeArea}>
        <TopHeader
          title="The Pitch Lab"
          variant="solid"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PracticeCameraPanel
          initialCameraOn={cameraOn === "true"}
          micMonitorEnabled={false}
          placeholder={
            <Image
              source={logoRhetora}
              style={{ width: 90, height: 90 }}
              resizeMode="contain"
            />
          }
        />

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
            <Pressable style={styles.actionButton} onPress={handleRestart}>
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
                  color={Colors.senary[300]}
                />
              </View>
              <Text style={styles.actionLabel}>{isPaused ? "Resume" : "Pause"}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>
            {promptLoading ? "Loading pitch prompt..." : promptDetails.title}
          </Text>
          <Text style={styles.promptInstruction}>
            {promptLoading ? "Please wait a moment." : promptDetails.instruction}
          </Text>
        </View>

        {!promptLoading && (
            <CollapsibleSection title="Pitch Tips">
                {!!promptDetails.tips.hook && (
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hook</Text>
                    <Text style={styles.detailValue}>{promptDetails.tips.hook}</Text>
                </View>
                )}

                {!!promptDetails.tips.problem && (
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Problem</Text>
                    <Text style={styles.detailValue}>{promptDetails.tips.problem}</Text>
                </View>
                )}

                {!!promptDetails.tips.solution && (
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Solution</Text>
                    <Text style={styles.detailValue}>{promptDetails.tips.solution}</Text>
                </View>
                )}

                {!!promptDetails.tips.value && (
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Value</Text>
                    <Text style={styles.detailValue}>{promptDetails.tips.value}</Text>
                </View>
                )}

                {!!promptDetails.tips.closing && (
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Closing</Text>
                    <Text style={styles.detailValue}>{promptDetails.tips.closing}</Text>
                </View>
                )}
            </CollapsibleSection>
            )}
            {!sessionStarted && !promptLoading && (
          <Pressable style={styles.startButton} onPress={handleStartSession}>
            <Text style={styles.startButtonText}>Start Talking</Text>
          </Pressable>
        )}

        {sessionStarted && (
          <Pressable style={styles.finishButton} onPress={() => setFinishVisible(true)}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        )}
      </ScrollView>

      <Modal transparent animationType="fade" visible={finishVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Are you sure you want to finish this pitch?
            </Text>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalGhostButton} onPress={() => setFinishVisible(false)}>
                <Text style={styles.modalGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.modalConfirmButton}
                onPress={() => {
                  setFinishVisible(false);
                  handleFinishSession();
                }}
              >
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
    gap: 28,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
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
  promptContainer: {
    width: "100%",
    gap: 28,
    paddingHorizontal: 8,
  },
  promptTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 25,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 34,
  },
  promptInstruction: {
    fontFamily: "Quicksand-Bold",
    fontSize: 25,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 34,
  },
  detailRow: {
    gap: 6,
    marginBottom: 10,
  },
  detailLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  detailValue: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    lineHeight: 18,
  },
  detailList: {
    gap: 6,
  },
  detailBulletRow: {
    flexDirection: "row",
    gap: 6,
  },
  detailBullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.quinary[300],
  },
  startButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  finishButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { Audio } from "expo-av";

import { Colors } from "../constants/colors";
import TopHeader from "../components/top-header";
import PracticeCameraPanel from "../components/practice-camera-panel";
import { BACKEND_URL } from "../constants/api";
import fillerFreeFallback from "./filler-free-fallback.json";

const logoRhetora = require("../assets/images/logorhetora.png");

function FillerPill({ word, count, animate }: { word: string; count: number; animate: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 40 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
      ]).start();
    }
  }, [count, animate]);

  return (
    <Animated.View style={[styles.fillerPill, { transform: [{ scale }] }]}>
      <View style={styles.fillerBadge}>
        <Text style={styles.fillerBadgeText}>{count}</Text>
      </View>
      <Text style={styles.fillerPillWord}>{word}</Text>
    </Animated.View>
  );
}

export default function FillerFreeSession() {
  const router = useRouter();
  const { totalSeconds, fillerWords, cameraOn } = useLocalSearchParams<{
    totalSeconds?: string;
    fillerWords?: string;
    cameraOn?: string;
  }>();

  const initialTotalSeconds = useMemo(() => {
    const parsed = Number(totalSeconds);
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 60) : 60;
  }, [totalSeconds]);

  const parsedFillerWords: string[] = useMemo(() => {
    try {
      return JSON.parse(fillerWords ?? "[]");
    } catch {
      return ["well", "like", "so", "right"];
    }
  }, [fillerWords]);

  const [question, setQuestion] = useState("Loading your question...");
  const [questionLoaded, setQuestionLoaded] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(initialTotalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [finishVisible, setFinishVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fillerCounts, setFillerCounts] = useState<Record<string, number>>({});
  const [lastUpdatedWord, setLastUpdatedWord] = useState<string | null>(null);
  const [wsReady, setWsReady] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioChunkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAudioUriRef = useRef<string | null>(null);
  const fullTranscriptRef = useRef<string>("");

  const progress = initialTotalSeconds > 0 ? remainingSeconds / initialTotalSeconds : 0;
  const ringSize = 160;
  const ringStroke = 10;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  const formattedTime = useMemo(() => {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [remainingSeconds]);

  const clearTimerInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeWebSocket = () => {
    if (wsRef.current) {
      try {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "close" }));
        }
        wsRef.current.close();
      } catch {
      }
      wsRef.current = null;
    }
    if (audioChunkIntervalRef.current) {
      clearInterval(audioChunkIntervalRef.current);
      audioChunkIntervalRef.current = null;
    }
  };

  const openWebSocket = useCallback(() => {
    const fillerParam = parsedFillerWords.join(",");
    const wsUrl = BACKEND_URL.replace(/^http/, "ws") + `/filler-free/stream?fillerWords=${encodeURIComponent(fillerParam)}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("[FillerFree] WS opened");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "ready") {
          setWsReady(true);
        } else if (msg.type === "filler_update") {
          const incoming = msg.fillerCounts as Record<string, number>;
          setFillerCounts((prev) => {
            let changedWord: string | null = null;
            for (const [w, c] of Object.entries(incoming)) {
              if ((prev[w] ?? 0) < c) {
                changedWord = w;
              }
            }
            if (changedWord) setLastUpdatedWord(changedWord);
            return incoming;
          });
        } else if (msg.type === "transcript") {
          fullTranscriptRef.current += (fullTranscriptRef.current ? " " : "") + msg.text;
        } else if (msg.type === "done") {
          const incoming = msg.fillerCounts as Record<string, number>;
          setFillerCounts(incoming);
        }
      } catch {
      }
    };

    ws.onerror = (e) => {
      console.warn("[FillerFree] WS error", e);
    };

    ws.onclose = () => {
      console.log("[FillerFree] WS closed");
      setWsReady(false);
    };

    wsRef.current = ws;
  }, [parsedFillerWords]);

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
      console.warn("[FillerFree] Failed to start recording", error);
      Alert.alert("Recording failed", "Please try again.");
      return false;
    }
  };

  const stopRecording = async () => {
    const recording = recordingRef.current;
    if (!recording) return null;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      return uri;
    } catch (error) {
      console.warn("[FillerFree] Failed to stop recording", error);
      recordingRef.current = null;
      setIsRecording(false);
      return null;
    }
  };

  const startTimer = useCallback(() => {
    clearTimerInterval();
    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimerInterval();
          handleFinishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleStartSession = async () => {
    openWebSocket();

    const started = await startRecording();
    if (started) {
      setSessionStarted(true);
      startTimer();
    }
  };

  const handlePauseResume = async () => {
    if (isPaused) {
      setIsPaused(false);
      openWebSocket();
      await startRecording();
      startTimer();
    } else {
      setIsPaused(true);
      clearTimerInterval();
      const uri = await stopRecording();
      if (uri) lastAudioUriRef.current = uri;
      closeWebSocket();
    }
  };

  const handleRestart = async () => {
    clearTimerInterval();
    closeWebSocket();
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync().catch(() => null);
      recordingRef.current = null;
    }
    setIsRecording(false);
    setIsPaused(false);
    setSessionStarted(false);
    setRemainingSeconds(initialTotalSeconds);
    setFillerCounts({});
    setLastUpdatedWord(null);
    fullTranscriptRef.current = "";
    lastAudioUriRef.current = null;

    await handleStartSession();
  };

  const handleFinishSession = async () => {
    clearTimerInterval();
    closeWebSocket();

    const audioUri = await stopRecording();
    lastAudioUriRef.current = audioUri ?? lastAudioUriRef.current;

    const finalUri = lastAudioUriRef.current;
    if (!finalUri) {
      Alert.alert("Recording not available", "Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: finalUri,
        name: `filler-${Date.now()}.m4a`,
        type: "audio/m4a",
      } as unknown as Blob);
      formData.append("question", question);
      formData.append("fillerWords", JSON.stringify(parsedFillerWords));

      const response = await fetch(`${BACKEND_URL}/filler-free/evaluate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      router.replace({
        pathname: "/filler-free-evaluation",
        params: {
          data: JSON.stringify(data),
          question,
          fillerWords: JSON.stringify(parsedFillerWords),
        },
      });
    } catch (error) {
      console.warn("[FillerFree] Evaluation failed, using fallback", error);
      const hasWsData = fullTranscriptRef.current.length > 0 || Object.keys(fillerCounts).length > 0;
      const fallbackData = hasWsData
        ? {
            transcript: fullTranscriptRef.current || fillerFreeFallback.transcript,
            fillerCounts,
            wordRatePerMinute: 0,
            totalFillerWords: Object.values(fillerCounts).reduce((a, b) => a + b, 0),
            evaluation: {
              ...fillerFreeFallback.evaluation,
              quickSummary:
                "Evaluation could not be completed — showing example results. Your filler word counts above are accurate.",
            },
          }
        : fillerFreeFallback;

      router.replace({
        pathname: "/filler-free-evaluation",
        params: {
          data: JSON.stringify(fallbackData),
          question,
          fillerWords: JSON.stringify(parsedFillerWords),
        },
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadQuestion = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/filler-free/question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        if (isMounted) {
          setQuestion(data.question ?? "What is your favorite way to spend your free time?");
          setQuestionLoaded(true);
        }
      } catch {
        if (isMounted) {
          setQuestion(fillerFreeFallback.question);
          setQuestionLoaded(true);
        }
      }
    };

    loadQuestion();

    return () => {
      isMounted = false;
      clearTimerInterval();
      closeWebSocket();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => null);
        recordingRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (questionLoaded && !sessionStarted) {
      handleStartSession();
    }
  }, [questionLoaded]);

  const fillerPills = useMemo(() => {
    return parsedFillerWords.map((word) => ({
      word,
      count: fillerCounts[word.toLowerCase()] ?? 0,
    }));
  }, [parsedFillerWords, fillerCounts]);

  const hasAnyFillers = fillerPills.some((p) => p.count > 0);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topSafeArea}>
        <TopHeader
          title="Filler-Free"
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

        <View style={styles.timerBlock}>
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
            <View style={styles.timerInner}>
              <Text style={styles.timerText}>{formattedTime}</Text>
              <Text style={styles.timerLabel}>
                {!sessionStarted ? "starting…" : isPaused ? "paused" : "remaining"}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtonsWrap}>
            <Pressable style={styles.actionButton} onPress={handleRestart}>
              <View style={styles.actionIconWrap}>
                <Ionicons name="refresh" size={20} color={Colors.shade[200]} />
              </View>
              <Text style={styles.actionLabel}>Restart</Text>
            </Pressable>

            <Pressable style={styles.actionButton} onPress={handlePauseResume} disabled={!sessionStarted}>
              <View style={[styles.actionIconWrapLight, !sessionStarted && styles.actionIconDisabled]}>
                <Ionicons
                  name={isPaused ? "play" : "pause"}
                  size={20}
                  color={sessionStarted ? Colors.senary[300] : Colors.shade[100]}
                />
              </View>
              <Text style={[styles.actionLabel, !sessionStarted && styles.actionLabelDisabled]}>
                {isPaused ? "Resume" : "Pause"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
        </View>

        {hasAnyFillers && (
          <View style={styles.pillsRow}>
            {fillerPills
              .filter((p) => p.count > 0)
              .map((p) => (
                <FillerPill
                  key={p.word}
                  word={p.word}
                  count={p.count}
                  animate={lastUpdatedWord === p.word.toLowerCase()}
                />
              ))}
          </View>
        )}

        {sessionStarted && (
          <Pressable
            style={[styles.finishButton, isSubmitting && styles.finishButtonDisabled]}
            onPress={() => setFinishVisible(true)}
            disabled={isSubmitting}
          >
            <Text style={styles.finishButtonText}>
              {isSubmitting ? "Processing..." : "Finish"}
            </Text>
          </Pressable>
        )}
      </ScrollView>

      <Modal transparent animationType="fade" visible={finishVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Finish this session?</Text>
            <Text style={styles.modalSubtitle}>
              Your speech will be analyzed and results will be shown.
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
                <Text style={styles.modalConfirmText}>Finish</Text>
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
    gap: 24,
  },
  timerBlock: {
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  timerSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  timerInner: {
    alignItems: "center",
    gap: 2,
  },
  timerText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 34,
    color: Colors.octonary.DEFAULT,
    letterSpacing: 1,
  },
  timerLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.shade[100],
    letterSpacing: 0.5,
  },
  actionButtonsWrap: {
    flexDirection: "row",
    gap: 32,
    justifyContent: "center",
  },
  actionButton: {
    alignItems: "center",
    gap: 8,
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.error[500],
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconWrapLight: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.warning[100],
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconDisabled: {
    opacity: 0.4,
  },
  actionLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  actionLabelDisabled: {
    color: Colors.shade[100],
  },
  questionContainer: {
    width: "100%",
    paddingHorizontal: 8,
  },
  questionText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 32,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    paddingHorizontal: 8,
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
  finishButton: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  finishButtonDisabled: {
    opacity: 0.6,
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
    gap: 14,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalSubtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.shade[100],
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
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
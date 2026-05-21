import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "../constants/colors";
import PracticeCameraPanel from "../components/practice-camera-panel";
import TopHeader from "../components/top-header";
const DEFAULT_TOTAL_SECONDS = 10 * 60;
const logoRhetora = require("../assets/images/logorhetora.png");
export default function PracticeSession() {
  const router = useRouter();

  const { cameraOn, totalSeconds, hours, minutes, seconds } = useLocalSearchParams<{
    cameraOn?: string;
    totalSeconds?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  }>();

  const initialTotalSeconds = useMemo(() => {
    const parsedTotal = Number(totalSeconds);
    if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
      return parsedTotal;
    }
    const h = parseInt(hours ?? "0", 10) || 0;
    const m = parseInt(minutes ?? "10", 10) || 0;
    const s = parseInt(seconds ?? "0", 10) || 0;
    const combined = h * 3600 + m * 60 + s;
    return combined > 0 ? combined : DEFAULT_TOTAL_SECONDS;
  }, [totalSeconds, hours, minutes, seconds]);

  const [remainingSeconds, setRemainingSeconds] = useState(initialTotalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const [finishVisible, setFinishVisible] = useState(false);
  const [timeUpVisible, setTimeUpVisible] = useState(false);


  const progress = remainingSeconds / initialTotalSeconds;
  const ringSize = 86;
  const ringStroke = 8;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [remainingSeconds]);

  useEffect(() => {
    if (isPaused || timeUpVisible) {
      return;
    }

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
          title="A Fresh Start"
          description="The First Introduction"
          variant="solid"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <View style={styles.body}>
        <Text style={styles.mainTitle}>Introduce Yourself!</Text>

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

        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>
        
        <View style={styles.timerRow}>
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
                stroke={Colors.senary[300]}
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

          <Pressable style={styles.actionButton} onPress={() => setRestartVisible(true)}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="refresh" size={22} color={Colors.shade[200]} />
            </View>
            <Text style={styles.actionLabel}>Restart</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => setIsPaused((prev) => !prev)}
          >
            <View style={styles.actionIconWrapLight}>
              <Ionicons
                name={isPaused ? "play" : "pause"}
                size={22}
                color={Colors.octonary.DEFAULT}
              />
            </View>
            <Text style={styles.actionLabel}>Pause</Text>
          </Pressable>
        </View>

        <Pressable style={styles.finishButton} onPress={() => setFinishVisible(true)}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </View>
      

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
            <Text style={styles.modalTitle}>You still have some time, are you sure you finish this session?</Text>
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
  screen: { flex: 1, backgroundColor: Colors.shade[200] },
  topSafeArea: { backgroundColor: Colors.senary[300] },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, alignItems: "center", gap: 20 },
  mainTitle: { fontFamily: "Quicksand-Bold", fontSize: 20, color: Colors.octonary.DEFAULT },
  disclaimerText: { fontFamily: "AlbertSans-Regular", fontSize: 12, color: Colors.octonary.DEFAULT, textAlign: "center" },
  disclaimerBold: { fontFamily: "AlbertSans-Bold" },
  timerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 6 },
  timerCircle: { width: 86, height: 86, borderRadius: 43, alignItems: "center", justifyContent: "center", backgroundColor: Colors.shade[200] },
  timerSvg: { position: "absolute", top: 0, left: 0 },
  timerText: { fontFamily: "Quicksand-Bold", fontSize: 18, color: Colors.octonary.DEFAULT },
  actionButton: { alignItems: "center", gap: 6, flex: 1 },
  actionIconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.error[400], alignItems: "center", justifyContent: "center" },
  actionIconWrapLight: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.warning[100], alignItems: "center", justifyContent: "center" },
  actionLabel: { fontFamily: "AlbertSans-SemiBold", fontSize: 13, color: Colors.octonary.DEFAULT },
  finishButton: { width: "100%", height: 54, borderRadius: 14, backgroundColor: Colors.senary[300], alignItems: "center", justifyContent: "center", marginTop: 10 },
  finishButtonText: { fontFamily: "Quicksand-Bold", fontSize: 18, color: Colors.shade[200] },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.35)", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  modalCard: { width: "100%", borderRadius: 16, backgroundColor: Colors.shade[200], paddingHorizontal: 24, paddingVertical: 28, alignItems: "center", gap: 20 },
  modalTitle: { fontFamily: "Quicksand-Bold", fontSize: 18, color: Colors.octonary.DEFAULT, textAlign: "center" },
  modalActions: { flexDirection: "row", gap: 12 },
  modalGhostButton: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.octonary.DEFAULT, alignItems: "center", justifyContent: "center" },
  modalGhostText: { fontFamily: "Quicksand-Bold", fontSize: 14, color: Colors.octonary.DEFAULT },
  modalConfirmButton: { flex: 1, height: 44, borderRadius: 12, backgroundColor: Colors.senary[300], alignItems: "center", justifyContent: "center" },
  modalConfirmText: { fontFamily: "Quicksand-Bold", fontSize: 14, color: Colors.shade[200] },
});
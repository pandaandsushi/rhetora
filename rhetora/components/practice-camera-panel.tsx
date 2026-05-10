import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import { useFocusEffect } from "expo-router";

import LogoRhetora from "../assets/images/logorhetora.svg";
import { Colors } from "../constants/colors";

type PracticeCameraPanelProps = {
  showStatus?: boolean;
  placeholder?: React.ReactNode;
  toggleIconName?: React.ComponentProps<typeof Ionicons>["name"];
  initialCameraOn?: boolean;
  onCameraToggle?: (isOn: boolean) => void;
};

export default function PracticeCameraPanel({
  showStatus = false,
  placeholder,
  toggleIconName,
  initialCameraOn = false,
  onCameraToggle,
}: PracticeCameraPanelProps) {
  const [isCameraOn, setIsCameraOn] = useState(initialCameraOn);
  const [permission, requestPermission] = useCameraPermissions();
  const [isMicOn, setIsMicOn] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [micDetected, setMicDetected] = useState(false);
  
  const recordingRef = useRef<Audio.Recording | null>(null);

  const micHasSound = micLevel > 0.08;
  const micStatusText = micDetected ? "Microphone working" : "Listening...";

  const micBars = useMemo(() => {
    const base = isMicOn ? 6 : 4;
    const bump = Math.round(micLevel * 12);
    return [
      base + bump,
      base + Math.max(bump - 4, 0),
      base + Math.max(bump - 8, 0),
    ];
  }, [isMicOn, micLevel]);

  const stopMicMonitor = async () => {
    const recording = recordingRef.current;
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch {
      }
      recordingRef.current = null;
    }
    setMicLevel(0);
  };

  const startMicMonitor = async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await stopMicMonitor();

    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      setIsMicOn(false);
      return;
    }

    setIsMicOn(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    try {
      const { recording } = await Audio.Recording.createAsync(
        {
          isMeteringEnabled: true,
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
        },
        (status) => {
          if (status.isRecording && status.metering != null) {
            const normalized = Math.min(Math.max((status.metering + 60) / 60, 0), 1);
            setMicLevel(normalized);
            if (normalized > 0.08) {
              setMicDetected(true);
            }
          }
        },
        200
      );

      recordingRef.current = recording;
    } catch (error) {
      console.warn("Microphone monitor failed to start:", error);
    }
  };

  const toggleCamera = async () => {
    if (!isCameraOn) {
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          alert("Camera permission is required to use this feature.");
          return;
        }
      }
    }
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    onCameraToggle?.(newState);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const init = async () => {
        if (isActive) {
          await startMicMonitor();
        }
      };
      init();

      return () => {
        isActive = false;
        stopMicMonitor();
      };
    }, [])
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.cameraContainer}>
        {isCameraOn ? (
          <CameraView style={styles.cameraFeed} facing="front" />
        ) : (
          <View style={styles.cameraPlaceholder}>
            {placeholder ?? <LogoRhetora width={90} height={90} />}
          </View>
        )}

        <View style={styles.optionsButton}>
          <View style={styles.micBars}>
            {micBars.map((height, index) => (
              <View
                key={`mic-bar-${index}`}
                style={[
                  styles.micBar,
                  {
                    height,
                    backgroundColor: isMicOn ? Colors.senary[300] : Colors.neutral[400],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Pressable style={styles.toggleButton} onPress={toggleCamera}>
          <Ionicons
            name={toggleIconName ?? (isCameraOn ? "camera" : "camera-reverse")}
            size={24}
            color={Colors.octonary.DEFAULT}
          />
        </Pressable>
      </View>

      {showStatus && (
        <View style={styles.micStatusRow}>
          <View
            style={[
              styles.micStatusDot,
              {
                backgroundColor: micHasSound || micDetected
                  ? Colors.success[400]
                  : Colors.error[400],
              },
            ]}
          />
          <Text style={styles.micStatusText}>{micStatusText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  cameraContainer: { width: "100%", aspectRatio: 4 / 3, borderRadius: 16, overflow: "hidden", backgroundColor: Colors.neutral[200], position: "relative" },
  cameraFeed: { flex: 1, width: "100%" },
  cameraPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#D9D9D9" },
  optionsButton: { position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.shade[200], alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  micBars: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  micBar: { width: 4, borderRadius: 2 },
  toggleButton: { position: "absolute", bottom: 16, right: 16, width: 54, height: 40, borderRadius: 8, backgroundColor: Colors.shade[200], alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  micStatusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  micStatusDot: { width: 10, height: 10, borderRadius: 5 },
  micStatusText: { fontFamily: "AlbertSans-SemiBold", fontSize: 13, color: Colors.octonary.DEFAULT },
});
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from "expo-av";

import { Colors } from "../constants/colors";
import * as ScreenOrientation from "expo-screen-orientation";
const bgImage = require("../assets/images/bg-motif.png");
const vrClassroomImage = require("../assets/images/vr/school.png");
const vrMeetingImage = require("../assets/images/vr/meeting.png");
const vrPodiumImage = require("../assets/images/vr/podium.png");

const vrScenarios = [
  {
    id: "vr-classroom",
    title: "Classroom",
    image: vrClassroomImage,
    speakingPrompt: "Explain one study habit that helps you learn better.",
    speakingContext:
      "The user is speaking to classmates in a classroom setting. Evaluate whether the speech explains the idea clearly for a student audience.",
  },
  {
    id: "vr-meeting",
    title: "Meeting Room",
    image: vrMeetingImage,
    speakingPrompt: "Share one idea to improve your team's productivity.",
    speakingContext:
      "The user is speaking in a team meeting. Evaluate whether the speech presents a practical idea with a clear reason.",
  },
  {
    id: "vr-podium",
    title: "Podium",
    image: vrPodiumImage,
    speakingPrompt: "Give a short speech about one habit that helps people grow.",
    speakingContext:
      "The user is speaking to a larger audience from a podium. Evaluate whether the speech has a clear message and closing.",
  },
];

export default function VrReady() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scenarioId?: string;
    audience?: string;
    time?: string;
    timeSeconds?: string;
    speakingPrompt?: string;
    speakingContext?: string;
  }>();
  const [micDetected, setMicDetected] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micActive, setMicActive] = useState(false);

  const scenario = useMemo(() => {
    return vrScenarios.find((item) => item.id === params.scenarioId) ?? vrScenarios[0];
  }, [params.scenarioId]);

  const speakingPrompt = params.speakingPrompt ?? scenario.speakingPrompt;
  const speakingContext = params.speakingContext ?? scenario.speakingContext;
  useEffect(() => {
  ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE,
  );

  return () => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  };
}, []);
  useEffect(() => {
    let recording: Audio.Recording | null = null;
    let active = true;

    const startMonitor = async () => {
      if (!micActive) {
        return;
      }

      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted || !active) {
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      try {
        const result = await Audio.Recording.createAsync(
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
            if (!active || !status.isRecording || status.metering == null) {
              return;
            }
            const normalized = Math.min(Math.max((status.metering + 60) / 60, 0), 1);
            setMicLevel(normalized);
            if (normalized > 0.08) {
              setMicDetected(true);
            }
          },
          200,
        );
        recording = result.recording;
      } catch {
      }
    };

    const stopMonitor = async () => {
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch {
        }
        recording = null;
      }
      setMicLevel(0);
    };

    startMonitor();

    return () => {
      active = false;
      stopMonitor();
    };
  }, [micActive]);

  const micHasSound = micLevel > 0.08 || micDetected;
  const micStatusText = micHasSound ? "Microphone working" : "Listening...";

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <View style={styles.headerRow}>
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <View style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={Colors.shade[200]} />
          </View>
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Setup VR Mode (3/3)</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.detailsColumn}>
          <Text style={styles.scenarioLabel}>VR Mode: {scenario.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={18} color={Colors.neutral[500]} />
              <Text style={styles.metaText}>{params.time ?? "10 min(s)"}</Text>
            </View>
            <Text style={styles.metaDivider}>|</Text>
            <View style={styles.metaItem}>
              <Ionicons name="people" size={18} color={Colors.neutral[500]} />
              <Text style={styles.metaText}>{params.audience ?? "Large Audience"}</Text>
            </View>
          </View>

          <View style={styles.promptCard}>
            <View style={styles.promptHeaderRow}>
              <View style={styles.promptIconWrap}>
                <Ionicons name="chatbubble-ellipses" size={16} color={Colors.senary[300]} />
              </View>
              <Text style={styles.promptLabel}>Speaking Prompt</Text>
            </View>
            <Text style={styles.promptQuestion}>{speakingPrompt}</Text>
          </View>

          <Text style={styles.helperText}>
            We use VR Cardboard. Please rotate your device to landscape before starting.
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={() =>
              router.push({
                pathname: "/vr-viro",
                params: {
                  scenarioId: scenario.id,
                  audience: params.audience ?? "",
                  time: params.time ?? "",
                  timeSeconds: params.timeSeconds ?? "",
                  speakingPrompt,
                  speakingContext,
                },
              })
            }
          >
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>

          {/* <Pressable style={styles.testButton} onPress={() => setMicActive((prev) => !prev)}>
            <Text style={styles.testButtonText}>Test Microphone</Text>
          </Pressable> */}

          {micActive && (
            <View style={styles.micStatusRow}>
              <View
                style={[
                  styles.micStatusDot,
                  { backgroundColor: micHasSound ? Colors.success[400] : Colors.error[400] },
                ]}
              />
              <Text style={styles.micStatusText}>{micStatusText}</Text>
            </View>
          )}
        </View>

        <View style={styles.previewColumn}>
          <View style={styles.previewCard}>
            <Image source={scenario.image} style={styles.previewImage} />
            <Pressable style={styles.previewMenu}>
              <Ionicons name="ellipsis-horizontal" size={18} color={Colors.octonary.DEFAULT} />
            </Pressable>
          </View>
          <Text style={styles.previewCaption}>
            Result will be saved and can be viewed in <Text style={styles.previewCaptionBold}>My Recordings</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.senary[300],
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  detailsColumn: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  previewColumn: {
    width: "48%",
    alignItems: "center",
    gap: 12,
  },
  scenarioLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.neutral[500],
  },
  metaDivider: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 16,
    color: Colors.neutral[400],
  },
  helperText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
    lineHeight: 22,
    textAlign: "center",
    marginHorizontal: 12,
  },
  promptCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  promptHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  promptIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  promptLabel: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 13,
    color: Colors.senary[300],
  },
  promptQuestion: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  startButton: {
    width: 120,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  startButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  testButton: {
    alignItems: "center",
    paddingVertical: 6,
  },
  testButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
    textDecorationLine: "underline",
  },
  micStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  micStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  micStatusText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  previewCard: {
    borderRadius: 18,
    overflow: "hidden",
    width: "100%",
    aspectRatio: 16 / 9,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewMenu: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  previewCaption: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  previewCaptionBold: {
    fontFamily: "AlbertSans-Bold",
  },
});

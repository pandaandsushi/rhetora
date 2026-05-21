import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import {
  ViroAmbientLight,
  Viro360Image,
  ViroScene,
  ViroVRSceneNavigator,
} from "@viro-community/react-viro";

type ViroSceneProps = {
  sceneNavigator: {
    viroAppProps?: {
      background?: number;
    };
  };
};

function VrScene({ sceneNavigator }: ViroSceneProps) {
  const background = sceneNavigator?.viroAppProps?.background;

  return (
    <ViroScene>
      <ViroAmbientLight color="#FFFFFF" intensity={350} />
      {background ? <Viro360Image source={background} /> : null}
    </ViroScene>
  );
}

export default function VrViro() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scenarioId?: string;
    audience?: string;
    timeSeconds?: string;
  }>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const completingRef = useRef(false);

  const timeSeconds = useMemo(() => {
    const parsed = Number(params.timeSeconds);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return 1 * 60;
  }, [params.timeSeconds]);

  useEffect(() => {
    let isMounted = true;

    const startRecording = async () => {
      try {
        console.log("[VR] Requesting mic permission...");
        const { granted, status } = await Audio.requestPermissionsAsync();

        console.log("[VR] Mic permission:", { granted, status });

        if (!granted || !isMounted) {
          console.warn("[VR] Mic permission not granted");
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        console.log("[VR] Starting recording...");

        const { recording } = await Audio.Recording.createAsync(
          {
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
          },
        );

        recordingRef.current = recording;
      } catch (error) {
        console.warn("VR recording failed to start", error);
      }
    };

    startRecording();

    return () => {
      isMounted = false;
    };
  }, []);

  const stopRecording = async () => {
  const recording = recordingRef.current;

  console.log("[VR] stopRecording called. recording exists?", !!recording);

  if (!recording) {
    return null;
  }

  try {
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    console.log("[VR] Recording URI:", uri);

    recordingRef.current = null;

    return uri;
  } catch (error) {
    console.warn("[VR] Recording failed to stop", error);
    recordingRef.current = null;
    return null;
  }
};

  const [remainingSeconds, setRemainingSeconds] = useState(timeSeconds);

  useEffect(() => {
    setRemainingSeconds(timeSeconds);
  }, [timeSeconds]);

  const audienceKey = useMemo(() => {
    const label = (params.audience ?? "").toLowerCase();
    if (label.includes("small")) {
      return "sm";
    }
    if (label.includes("medium")) {
      return "md";
    }
    if (label.includes("large")) {
      return "lg";
    }
    return "md";
  }, [params.audience]);

  const backgroundImage = useMemo(() => {
    const scenarioId = params.scenarioId ?? "vr-classroom";
    const map = {
      "vr-classroom": {
        sm: require("../assets/images/vr/background/classroom/classroom-sm.png"),
        md: require("../assets/images/vr/background/classroom/classroom-md.png"),
        lg: require("../assets/images/vr/background/classroom/classroom-lg.png"),
      },
      "vr-meeting": {
        sm: require("../assets/images/vr/background/meeting/meeting-sm.png"),
        md: require("../assets/images/vr/background/meeting/meeting-md.png"),
        lg: require("../assets/images/vr/background/meeting/meeting-lg.png"),
      },
      "vr-podium": {
        sm: require("../assets/images/vr/background/podium/podium-sm.png"),
        md: require("../assets/images/vr/background/podium/podium-md.png"),
        lg: require("../assets/images/vr/background/podium/podium-lg.png"),
      },
    } as const;

    const scenario = map[scenarioId as keyof typeof map] ?? map["vr-classroom"];
    return scenario[audienceKey as keyof typeof scenario];
  }, [params.scenarioId, audienceKey]);

  const scene = useMemo(() => ({ scene: VrScene }), []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (remainingSeconds !== 0) {
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (completingRef.current) {
      return;
    }
    completingRef.current = true;
    (async () => {
      const audioUri = await stopRecording();
      router.replace({
        pathname: "/vr-complete",
        params: {
          audioUri: audioUri ?? "",
          scenarioId: params.scenarioId ?? "vr-classroom",
          audience: params.audience ?? "",
        },
      });
    })();
  }, [remainingSeconds, router]);

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [remainingSeconds]);

  return (
    <View style={styles.screen}>
      <ViroVRSceneNavigator
        style={styles.viro}
        initialScene={scene}
        viroAppProps={{ scenarioId: params.scenarioId ?? "", background: backgroundImage }}
        autofocus
      />

      <View style={styles.timerWrap}>
        <Text style={styles.timerText}>{timerLabel}</Text>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  viro: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  timerWrap: {
    position: "absolute",
    top: 16,
    left: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 18,
    letterSpacing: 1,
  },
});

import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
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

  const timeSeconds = useMemo(() => {
    const parsed = Number(params.timeSeconds);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return 10 * 60;
  }, [params.timeSeconds]);

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
    router.replace("/vr-evaluation");
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

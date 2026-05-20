import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
  ViroScene,
  ViroSpotLight,
  ViroText,
  ViroVRSceneNavigator,
} from "@viro-community/react-viro";

ViroMaterials.createMaterials({
  vrBox: {
    diffuseColor: "#4FB3FF",
  },
});

function VrScene() {
  return (
    <ViroScene>
      <ViroAmbientLight color="#FFFFFF" intensity={300} />
      <ViroSpotLight
        color="#FFFFFF"
        position={[0, 5, -2]}
        direction={[0, -1, 0]}
        innerAngle={5}
        outerAngle={20}
        castsShadow
      />
      <ViroText
        text="Rhetora VR"
        position={[0, 0.4, -2]}
        style={styles.viroText}
      />
      <ViroBox
        position={[0, -0.2, -1.6]}
        scale={[0.35, 0.35, 0.35]}
        materials={["vrBox"]}
      />
    </ViroScene>
  );
}

export default function VrViro() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scenarioId?: string }>();

  const scene = useMemo(() => ({ scene: VrScene }), []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <ViroVRSceneNavigator
        style={styles.viro}
        initialScene={scene}
        viroAppProps={{ scenarioId: params.scenarioId ?? "" }}
        autofocus
      />

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
    top: 16,
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
  viroText: {
    fontSize: 30,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

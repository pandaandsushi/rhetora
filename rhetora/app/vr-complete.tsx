import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import { BACKEND_URL } from "../constants/api";

export default function VrComplete() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    audioUri?: string;
    scenarioId?: string;
    audience?: string;
    time?: string;
    timeSeconds?: string;
  }>();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  const handleRetry = async () => {
    if (isUploading) {
      return;
    }

    router.replace({
      pathname: "/vr-ready",
      params: {
        scenarioId: params.scenarioId ?? "vr-classroom",
        audience: params.audience ?? "",
        time: params.time ?? "",
        timeSeconds: params.timeSeconds ?? "",
      },
    });
  };
  
  const handleContinue = async () => {
    if (isUploading) {
      return;
    }
    if (!params.audioUri) {
      Alert.alert("Upload failed", "Recording not available.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: params.audioUri,
        name: "vr-session.m4a",
        type: "audio/m4a",
      } as unknown as Blob);
      formData.append("scenario", params.scenarioId ?? "vr-classroom");
      formData.append("audience", params.audience ?? "");

      const response = await fetch(`${BACKEND_URL}/evaluate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await response.json();
      console.log("=== EVALUATION RESPONSE ===", data);
      console.log("=== TRANSCRIPT FROM BACKEND ===", data.transcript);
      console.log("=== METRICS FROM BACKEND ===", data.metrics);
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

      router.replace({
        pathname: "/vr-evaluation",
        params: {
          data: JSON.stringify(data),
        },
      });
    } catch (error) {
      Alert.alert("Upload failed", error?.message ?? "Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Session Complete</Text>

      <Text style={styles.description}>
        You’ve finished your VR practice session.{"\n"}
        Please remove your headset before viewing your evaluation.
      </Text>

      <Pressable style={styles.button} onPress={handleContinue}>
        {isUploading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Continue to Evaluation</Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.retryButton, isUploading && styles.buttonDisabled]}
        onPress={handleRetry}
        disabled={isUploading}
      >
        <Text style={styles.retryButtonText}>Retry Practice</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#DE6259",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  retryButton: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});
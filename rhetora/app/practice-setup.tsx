import { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

import LogoRhetora from "../assets/images/logorhetora.svg";

import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

export default function PracticeSetup() {
  const router = useRouter();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const toggleCamera = async () => {
    if (!isCameraOn) {
      // Check and request permissions before turning the camera on
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          alert("Camera permission is required to use this feature.");
          return;
        }
      }
    }
    setIsCameraOn(!isCameraOn);
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

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>Introduce Yourself!</Text>

        {/* Camera Viewport Container */}
        <View style={styles.cameraContainer}>
          {isCameraOn ? (
            <CameraView 
              style={styles.cameraFeed} 
              facing="front" 
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <LogoRhetora width={90} height={90} />
            </View>
          )}

          {/* Top Right Options Button */}
          <Pressable style={styles.optionsButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={Colors.octonary.DEFAULT} />
          </Pressable>

          {/* Bottom Right Camera Toggle */}
          <Pressable style={styles.toggleButton} onPress={toggleCamera}>
            <Ionicons
              name={isCameraOn ? "camera" : "camera-reverse"} 
              size={24}
              color={Colors.octonary.DEFAULT}
            />
          </Pressable>
        </View>

        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>The First Introduction</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={18} color={Colors.neutral[500]} />
              <Text style={styles.statText}>10 min(s)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people" size={18} color={Colors.neutral[500]} />
              <Text style={styles.statText}>10.2k finished</Text>
            </View>
          </View>

          <Text style={styles.instructionText}>
            Before you begin, make sure your camera and microphone are working properly.
          </Text>
        </View>

        <View style={styles.actionSection}>
          <Pressable
            style={styles.startButton}
            onPress={() => {
              // Proceed to actual recording screen
            }}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>

          <Pressable onPress={() => {/* Handle Mic Test */}}>
            <Text style={styles.testMicText}>Test Microphone</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  topSafeArea: {
    backgroundColor: Colors.senary[300], // Matches TopHeader solid variant
  },
  body: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
  },
  mainTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
    marginBottom: 20,
  },
  cameraContainer: {
    width: "100%",
    aspectRatio: 4 / 3, // Maintains a nice rectangle shape
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.neutral[200], // Background color when camera is off
    marginBottom: 12,
    position: "relative",
  },
  cameraFeed: {
    flex: 1,
    width: "100%",
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9", // Light gray background matching your design
  },
  optionsButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 54,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  disclaimerText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    marginBottom: 32,
  },
  disclaimerBold: {
    fontFamily: "AlbertSans-Bold",
  },
  infoSection: {
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
  },
  infoTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.neutral[600],
  },
  statDivider: {
    width: 2,
    height: 16,
    backgroundColor: Colors.neutral[400],
    marginHorizontal: 12,
  },
  instructionText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    color: Colors.octonary.DEFAULT,
    paddingHorizontal: 10,
  },
  actionSection: {
    width: "100%",
    alignItems: "center",
    gap: 20,
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
  testMicText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
    textDecorationLine: "underline",
  },
});
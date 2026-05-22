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

import PracticeCameraPanel from "../components/practice-camera-panel";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
const logoRhetora = require("../assets/images/logorhetora.png");

export default function PracticeSetup() {
  const router = useRouter();
  const [isCameraOn, setIsCameraOn] = useState(false); 

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

        <PracticeCameraPanel
          showStatus
          micMonitorEnabled={false}
          placeholder={
            <Image
              source={logoRhetora}
              style={{ width: 90, height: 90 }}
              resizeMode="contain"
            />
          }
          onCameraToggle={setIsCameraOn} 
        />

        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>The First Introduction</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={18} color={Colors.neutral[500]} />
              <Text style={styles.statText}>1 min(s)</Text>
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
              router.push({
                pathname: "/practice-session",
                params: { cameraOn: isCameraOn ? "true" : "false" },
              });
            }}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.shade[200] },
  topSafeArea: { backgroundColor: Colors.senary[300] },
  body: { flex: 1 },
  contentContainer: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40, alignItems: "center" },
  mainTitle: { fontFamily: "Quicksand-Bold", fontSize: 22, color: Colors.octonary.DEFAULT, marginBottom: 20 },
  disclaimerText: { fontFamily: "AlbertSans-Regular", fontSize: 12, color: Colors.octonary.DEFAULT, textAlign: "center", marginBottom: 32 },
  disclaimerBold: { fontFamily: "AlbertSans-Bold" },
  infoSection: { alignItems: "center", width: "100%", marginBottom: 32 },
  infoTitle: { fontFamily: "Quicksand-Bold", fontSize: 22, color: Colors.octonary.DEFAULT, marginBottom: 12 },
  statsRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontFamily: "AlbertSans-SemiBold", fontSize: 14, color: Colors.neutral[600] },
  statDivider: { width: 2, height: 16, backgroundColor: Colors.neutral[400], marginHorizontal: 12 },
  instructionText: { fontFamily: "AlbertSans-Regular", fontSize: 15, textAlign: "center", lineHeight: 22, color: Colors.octonary.DEFAULT, paddingHorizontal: 10 },
  actionSection: { width: "100%", alignItems: "center", gap: 20 },
  startButton: { width: "100%", height: 54, borderRadius: 14, backgroundColor: Colors.senary[300], alignItems: "center", justifyContent: "center" },
  startButtonText: { fontFamily: "Quicksand-Bold", fontSize: 18, color: Colors.shade[200] },
});
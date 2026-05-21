import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import DropdownSelect from "../components/dropdown-select";
import SpeakingTimeInput, {
  formatDurationLabel,
  parseTimeToSeconds,
} from "../components/speaking-time-input";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-motif.png");
const vrClassroomImage = require("../assets/images/vr/school.png");
const vrMeetingImage = require("../assets/images/vr/meeting.png");
const vrPodiumImage = require("../assets/images/vr/podium.png");

const vrScenarios = [
  {
    id: "vr-classroom",
    title: "Classroom",
    image: vrClassroomImage,
  },
  {
    id: "vr-meeting",
    title: "Meeting Room",
    image: vrMeetingImage,
  },
  {
    id: "vr-podium",
    title: "Podium",
    image: vrPodiumImage,
  },
];

const audienceOptions = [
  "Small (1-15)",
  "Medium (16-50)",
  "Large (51-200)",
] as const;

type AudienceOption = (typeof audienceOptions)[number];

export default function VrSetup() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scenarioId?: string }>();
  const [selectedAudience, setSelectedAudience] = useState<AudienceOption | null>(null);
  const [timeValue, setTimeValue] = useState({ hours: "00", minutes: "10", seconds: "00" });

  const scenario = useMemo(() => {
    return vrScenarios.find((item) => item.id === params.scenarioId) ?? vrScenarios[0];
  }, [params.scenarioId]);

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Setup VR Mode (2/3)"
        variant="transparent"
        onBack={() => router.back()}
        rightElement={
          <Pressable style={styles.infoButton}>
            <Ionicons name="information" size={18} color={Colors.shade[200]} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Selected Scenario</Text>
        <View style={styles.scenarioCard}>
          <Image source={scenario.image} style={styles.scenarioImage} />
          <Text style={styles.scenarioTitle}>{scenario.title}</Text>
        </View>

        <SpeakingTimeInput value={timeValue} onChange={setTimeValue} />

        <View style={styles.selectRow}>
          <Text style={styles.selectLabel}>Audience Size</Text>
        </View>
        <DropdownSelect
          value={selectedAudience ?? undefined}
          placeholder="Select Audience Size"
          options={audienceOptions as unknown as string[]}
          onSelect={(value) => setSelectedAudience(value as AudienceOption)}
        />

        <Pressable
          style={[styles.nextButton, !selectedAudience && styles.nextButtonDisabled]}
          disabled={!selectedAudience}
          onPress={() => {
            const totalSeconds = parseTimeToSeconds(timeValue) || 10 * 60;
            const timeLabel = formatDurationLabel(timeValue);
            router.push({
              pathname: "/vr-ready",
              params: {
                scenarioId: scenario.id,
                audience: selectedAudience ?? "",
                time: timeLabel,
                timeSeconds: String(totalSeconds),
              },
            });
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },
  infoButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.octonary.DEFAULT,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  scenarioCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.blue[400],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
    alignItems: "center",
  },
  scenarioImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  scenarioTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    paddingVertical: 10,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timerLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  timerDefault: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerDefaultText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeBoxWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeBox: {
    width: 64,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
  },
  timeDivider: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
  },
  selectRow: {
    marginTop: 4,
  },
  selectLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  selectField: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectValue: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.neutral[400],
  },
  selectList: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    marginTop: 10,
    overflow: "hidden",
  },
  selectItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  selectItemLast: {
    borderBottomWidth: 0,
  },
  selectItemActive: {
    backgroundColor: Colors.warning[400],
  },
  selectItemText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.senary[300],
  },
  selectItemTextActive: {
    color: Colors.shade[200],
  },
  nextButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
});

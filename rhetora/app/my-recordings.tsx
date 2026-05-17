import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import { Colors } from "../constants/colors";
import TopHeader from "@/components/top-header";
import RecordingCard from "@/components/recording-card";
import {
  getMockUserData,
  subscribeToMockUser,
  type Recording,
} from "../data/mock-user";

const bgImage = require("../assets/images/bg-motif.png");
const emptyImage = require("../assets/images/no-recording.png");

export default function MyRecordings() {
  const router = useRouter();
  const params = useLocalSearchParams<{ select?: string; recordingId?: string }>();
  const [search, setSearch] = useState("");
  const [recordings, setRecordings] = useState<Recording[]>(getMockUserData().recordings);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedModes, setSelectedModes] = useState<string[]>(["Story", "Casual"]);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>("All");
  const selectMode = params.select === "true";
  const selectedRecordingId =
    typeof params.recordingId === "string" ? params.recordingId : null;

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setRecordings(next.recordings);
    });

    return unsubscribe;
  }, []);

  const parseDateLabel = (dateLabel: string) => {
    const [year, month, day] = dateLabel.split("-").map((value) => Number(value));
    if (!year || !month || !day) {
      return null;
    }
    return new Date(year, month - 1, day);
  };
  const matchesDateRange = (dateLabel: string, range: string | null) => {
    const parsed = parseDateLabel(dateLabel);
    if (!parsed) {
      return false;
    }
    if (range === "All") {
      return true;
    }
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const lastWeekStart = new Date(todayStart);
    lastWeekStart.setDate(todayStart.getDate() - 6);
    const lastMonthStart = new Date(todayStart);
    lastMonthStart.setDate(todayStart.getDate() - 29);

    if (range === "Today") {
      return parsed == todayStart;
    }
    if (range === "Yesterday") {
      return parsed >= yesterdayStart && parsed < todayStart;
    }
    if (range === "Last Week") {
      return parsed >= lastWeekStart && parsed < todayStart;
    }
    if (range === "Last Month") {
      return parsed >= lastMonthStart && parsed < todayStart;
    }
    return true;
  };
  const filteredRecordings = useMemo(() => {
  const normalized = search.trim().toLowerCase();
  const list = recordings.length > 0 ? recordings : [];

  return list.filter((recording) => {
    if (normalized) {
      const combined = `${recording.title} ${recording.mode} ${recording.dateLabel}`.toLowerCase();
      if (!combined.includes(normalized)) return false;
    }

    const modeKey = recording.mode.toLowerCase().includes("story")
      ? "Story"
      : "Casual";
    const matchesMode = selectedModes.length === 0 || selectedModes.includes(modeKey);
    if (!matchesMode) return false;

    const matchesDate = matchesDateRange(recording.dateLabel, selectedDateRange);
    if (!matchesDate) return false;

    return true;
  });
}, [recordings, search, selectedModes, selectedDateRange]);

  const showEmpty = recordings.length === 0;
  const showNoResults = !showEmpty && filteredRecordings.length === 0;

  const toggleMode = (value: string) => {
    setSelectedModes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const toggleDate = (value: string) => {
    setSelectedDateRange(value);
  };

  

  

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="My Recordings" onBack={() => router.back()} />
      </SafeAreaView>

      {showEmpty ? (
        <View style={styles.emptyWrap}>
          <Image source={emptyImage} style={styles.emptyImage} />
          <Text style={styles.emptyTitle}>You don't have any recordings yet</Text>
          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push("/practice")}
          >
            <Text style={styles.ctaText}>Go Practice!</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search Recordings"
                placeholderTextColor={Colors.neutral[400]}
                style={styles.searchInput}
              />
              <Ionicons name="search" size={18} color={Colors.neutral[400]} />
            </View>
            <Pressable style={styles.filterButton} onPress={() => setFilterOpen(true)}>
              <Ionicons name="options-outline" size={20} color={Colors.octonary.DEFAULT} />
            </Pressable>
          </View>

          {showNoResults ? (
            <View style={styles.noResultsWrap}>
              <Text style={styles.noResultsText}>No recording available</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filteredRecordings.map((recording) => (
                <RecordingCard
                  key={recording.id}
                  title={recording.title}
                  dateLabel={recording.dateLabel}
                  mode={recording.mode}
                  thumbnail={recording.thumbnail}
                  hasVideo={recording.hasVideo}
                  selected={recording.id === selectedRecordingId}
                  onPress={
                    selectMode
                      ? () =>
                          router.push({
                            pathname: "/feedback-share",
                            params: { recordingId: recording.id },
                          })
                      : undefined
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {filterOpen && !showEmpty && (
        <View style={styles.filterOverlay}>
          <Pressable style={styles.filterBackdrop} onPress={() => setFilterOpen(false)} />
          <View style={styles.filterCard}>
            <Text style={styles.filterHeading}>Mode</Text>
            <View style={styles.filterList}>
              {["Story", "Casual"].map((mode) => {
                const checked = selectedModes.includes(mode);

                return (
                  <Pressable
                    key={mode}
                    style={styles.filterRow}
                    onPress={() => toggleMode(mode)}
                  >
                    <View style={[styles.checkBox, checked && styles.checkBoxActive]}>
                      {checked && (
                        <Ionicons name="checkmark" size={14} color={Colors.octonary.DEFAULT} />
                      )}
                    </View>
                    <Text style={styles.filterLabel}>{mode}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.filterHeading, styles.filterHeadingSpacing]}>Date</Text>
            <View style={styles.filterList}>
              {["All", "Today", "Yesterday", "Last Week", "Last Month"].map((range) => {
                const checked = selectedDateRange === range;

                return (
                  <Pressable
                    key={range}
                    style={styles.filterRow}
                    onPress={() => toggleDate(range)}
                  >
                    <View style={[styles.radioOuter, checked && styles.radioOuterActive]}>
                      {checked && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.filterLabel}>{range}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.filterActions}>
              <Pressable
                style={[styles.filterButtonAction, styles.filterReset]}
                onPress={() => {
                  setSelectedModes(["Story", "Casual"]);
                  setSelectedDateRange("All");
                }}
              >
                <Text style={styles.filterResetText}>Reset</Text>
              </Pressable>
              <Pressable
                style={[styles.filterButtonAction, styles.filterConfirm]}
                onPress={() => setFilterOpen(false)}
              >
                <Text style={styles.filterConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 18,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.septenary[100],
  },
  list: {
    gap: 16,
  },
  noResultsWrap: {
    paddingVertical: 24,
    alignItems: "center",
  },
  noResultsText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.neutral[500],
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 20,
  },
  emptyImage: {
    width: 260,
    height: 260,
    resizeMode: "contain",
  },
  emptyTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  ctaButton: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: Colors.shade[200],
  },
  ctaText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  filterBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  filterCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 14,
  },
  filterHeading: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  filterHeadingSpacing: {
    marginTop: 6,
  },
  filterList: {
    gap: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.quinary[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  checkBoxActive: {
    backgroundColor: Colors.quinary[100],
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.quinary[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  radioOuterActive: {
    borderColor: Colors.senary[300],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.senary[300],
  },
  filterLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  filterButtonAction: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  filterReset: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  filterConfirm: {
    backgroundColor: Colors.senary[300],
  },
  filterResetText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  filterConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
});

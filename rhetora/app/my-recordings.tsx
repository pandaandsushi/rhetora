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
import { useRouter } from "expo-router";
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
  const [search, setSearch] = useState("");
  const [recordings, setRecordings] = useState<Recording[]>(getMockUserData().recordings);

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setRecordings(next.recordings);
    });

    return unsubscribe;
  }, []);

  const filteredRecordings = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const list = recordings.length > 0 ? recordings : [];

    if (!normalized) {
      return list;
    }

    return list.filter((recording) => {
      const combined = `${recording.title} ${recording.mode} ${recording.dateLabel}`.toLowerCase();
      return combined.includes(normalized);
    });
  }, [recordings, search]);

  const showEmpty = recordings.length === 0;

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
            <Pressable style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color={Colors.octonary.DEFAULT} />
            </Pressable>
          </View>

          <View style={styles.list}>
            {filteredRecordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                title={recording.title}
                dateLabel={recording.dateLabel}
                mode={recording.mode}
                thumbnail={recording.thumbnail}
                hasVideo={recording.hasVideo}
              />
            ))}
          </View>
        </ScrollView>
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
    paddingBottom: 40,
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
});

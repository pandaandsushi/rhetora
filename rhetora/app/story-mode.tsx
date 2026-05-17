import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
import { getMockUserData, subscribeToMockUser, updateMockUserData } from "../data/mock-user";

const bgImage = require("../assets/images/bg-story.png");
const coinImage = require("../assets/images/shop/coin.png");
const chapterOneImage = require("../assets/images/storymode/chapter1.png");
const chapterTwoImage = require("../assets/images/storymode/chapter2.png");

const chapters = [
  {
    id: "chapter-1",
    title: "1. The First Introduction",
    progress: "0/3 Finished",
    image: chapterOneImage,
  },
  {
    id: "chapter-2",
    title: "2. A Day to Remember",
    progress: "0/2 Finished",
    image: chapterTwoImage,
  },
];

export default function StoryMode() {
  const router = useRouter();
  const [userData, setUserData] = useState(getMockUserData());
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<(typeof chapters)[number] | null>(null);
  const [purchaseError, setPurchaseError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  const chapterList = useMemo(() => {
    return chapters.map((chapter) => ({
      ...chapter,
      locked: !userData.unlockedChapterIds.includes(chapter.id),
    }));
  }, [userData]);

  const chapterPrices = useMemo(() => {
    return new Map<string, number>([
      ["chapter-1", 160],
      ["chapter-2", 160],
    ]);
  }, []);

  const handleLockedPress = (chapter: (typeof chapters)[number]) => {
    setSelectedChapter(chapter);
    setPurchaseError("");
    setPurchaseOpen(true);
  };

  const handlePurchase = () => {
    if (!selectedChapter) {
      return;
    }

    const currentUser = getMockUserData();
    const price = chapterPrices.get(selectedChapter.id) ?? 160;
    if (currentUser.coins < price) {
      setPurchaseError("Not enough coins");
      return;
    }

    const nextUnlocked = currentUser.unlockedChapterIds.includes(selectedChapter.id)
      ? currentUser.unlockedChapterIds
      : [...currentUser.unlockedChapterIds, selectedChapter.id];

    updateMockUserData({
      coins: currentUser.coins - price,
      unlockedChapterIds: nextUnlocked,
    });

    setPurchaseOpen(false);
    setPurchaseError("");
  };

  return (
    <View style={styles.screen}>
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Story Mode" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {chapterList.map((chapter) => (
            <Pressable
              key={chapter.id}
              style={[styles.chapterCard, chapter.locked && styles.chapterCardLocked]}
              onPress={() => {
                if (!chapter.locked) {
                  router.push("/story-episodes");
                } else {
                  handleLockedPress(chapter);
                }
              }}
            >
                <Image source={chapter.image} style={styles.chapterImage} />

                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.75)"]}
                    style={styles.gradientOverlay}
                />

                <Text style={styles.chapterTitle}>{chapter.title}</Text>

                <View style={styles.progressPill}>
                  <Text style={styles.progressText}>
                    {chapter.locked ? "Locked" : chapter.progress}
                  </Text>
                </View>
              </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.navWrap}>
        <NavBar activeKey="practice" />
      </View>
      </ImageBackground>

      <Modal visible={purchaseOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Unlock this chapter?</Text>
            {selectedChapter && (
              <View style={styles.modalPreview}>
                <Image source={selectedChapter.image} style={styles.modalImage} />
                <Text style={styles.modalChapterTitle}>{selectedChapter.title}</Text>
                <View style={styles.modalPriceRow}>
                  <Image source={coinImage} style={styles.modalCoin} />
                  <Text style={styles.modalPriceText}>
                    {chapterPrices.get(selectedChapter.id) ?? 160}
                  </Text>
                </View>
              </View>
            )}
            {purchaseError ? <Text style={styles.modalError}>{purchaseError}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setPurchaseOpen(false)}
              >
                <Text style={styles.modalGhostText}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handlePurchase}
              >
                <Text style={styles.modalConfirmText}>Unlock</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  background: {
    width: "100%",
    height: "100%",
    flex: 1,
    },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 130,
    gap: 20,
  },
  chapterCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    overflow: "hidden",
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    textAlign: "center",
  },
  chapterCardLocked: {
    opacity: 0.6,
  },
  chapterImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  chapterTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    bottom: 60,
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressPill: {
    position: "absolute",
    left: "30%",
    right: "30%",
    bottom: 14,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.shade[200],
  },
  progressText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.warning[200],
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 240,
    },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
    gap: 16,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalPreview: {
    alignItems: "center",
    gap: 10,
  },
  modalImage: {
    width: 180,
    height: 140,
    borderRadius: 14,
    resizeMode: "cover",
  },
  modalChapterTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modalCoin: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  modalPriceText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonGhost: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  modalButtonConfirm: {
    backgroundColor: Colors.senary[300],
  },
  modalGhostText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.senary[300],
  },
  modalConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  modalError: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.error[500],
  },
});

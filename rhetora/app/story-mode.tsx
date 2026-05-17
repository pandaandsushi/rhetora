import {
  Image,
  ImageBackground,
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
import { getMockUserData, subscribeToMockUser } from "../data/mock-user";

const bgImage = require("../assets/images/bg-story.png");
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
                }
              }}
              disabled={chapter.locked}
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
});

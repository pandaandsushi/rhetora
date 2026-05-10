import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

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

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Story Mode" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {chapters.map((chapter) => (
            <View key={chapter.id} style={styles.chapterCard}>
              <Image source={chapter.image} style={styles.chapterImage} />
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <View style={styles.progressPill}>
                <Text style={styles.progressText}>{chapter.progress}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.navWrap}>
        <NavBar activeKey="practice" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
  chapterImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  chapterTitle: {
    position: "absolute",
    left: 16,
    bottom: 46,
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
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
    paddingBottom: 12,
  },
});

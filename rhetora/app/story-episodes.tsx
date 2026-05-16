import { useState } from "react";
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
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import EpisodeCard from "../components/episode-card";
import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-story.png");
const coinImage = require("../assets/images/shop/coin.png");
const episodeOneImage = require("../assets/images/storymode/eps1.png");
const episodeTwoImage = require("../assets/images/storymode/eps2.png");
const episodeThreeImage = require("../assets/images/storymode/eps3.png");

const episodes = [
  {
    id: "ep-1",
    title: "A Fresh Start",
    image: episodeOneImage,
    locked: false,
  },
  {
    id: "ep-2",
    title: "Breaking the Ice",
    image: episodeTwoImage,
    locked: true,
  },
  {
    id: "ep-3",
    title: "Small Talk",
    image: episodeThreeImage,
    locked: true,
  },
];

export default function StoryEpisodes() {
  const router = useRouter();
  const [unlockVisible, setUnlockVisible] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(episodes[1]);

  const handleLockedPress = (episode: typeof episodes[number]) => {
    setSelectedEpisode(episode);
    setUnlockVisible(true);
  };

  return (
    <View style={styles.screen}>
      <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <TopHeader
            title="The First Introduction"
            description="Chapter 1"
            onBack={() => router.back()}
          />

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.timelineLine} />

            {episodes.map((episode) => (
              <View key={episode.id} style={styles.episodeRow}>
                <View style={styles.dotContainer}>
                  {episode.locked ? (
                    <View style={styles.dotLocked} />
                  ) : (
                    <View style={styles.dotActiveOutline}>
                      <View style={styles.dotActiveInner} />
                    </View>
                  )}
                </View>

                <View style={styles.cardContainer}>
                  <EpisodeCard
                    title={episode.title}
                    image={episode.image}
                    locked={episode.locked}
                    onPress={() =>
                      episode.locked ? handleLockedPress(episode) : router.push("/story-player")
                    }
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="practice" />
        </View>
      </ImageBackground>

      <Modal transparent animationType="fade" visible={unlockVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>This episode is still locked</Text>
            
            <View style={styles.modalRow}>
              <Text style={styles.modalSubtitle}>Unlock with</Text>
              <Image source={coinImage} style={styles.modalCoin} />
              <Text style={styles.modalSubtitle}>160  ?</Text>
            </View>

            <View style={styles.modalPreview}>
              <ImageBackground source={selectedEpisode.image} style={styles.modalImage} resizeMode="cover">
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
                  style={styles.modalGradient}
                />
                <Text style={styles.modalEpisodeTitle}>{selectedEpisode.title}</Text>
              </ImageBackground>
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setUnlockVisible(false)}
              >
                <Text style={styles.modalButtonTextNo}>No</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.modalButtonUnlock]}
                onPress={() => {
                  setUnlockVisible(false);
                }}
              >
                <Text style={styles.modalButtonTextUnlock}>Unlock</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 130,
  },
  timelineLine: {
    position: "absolute",
    left: 35,
    top: 60,
    bottom: 180,
    width: 2,
    backgroundColor: Colors.octonary.DEFAULT,
  },
  episodeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  dotContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  dotLocked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
  },
  dotActiveOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  dotActiveInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.senary[300],
  },
  cardContainer: {
    flex: 1,
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 24,
  },
  modalSubtitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  modalCoin: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  modalPreview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    marginBottom: 32,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  modalGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  modalEpisodeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
    marginLeft: 12,
    marginBottom: 10,
    textShadowColor: Colors.octonary.DEFAULT,
    textShadowOffset: { width: -1.5, height: 1.5 },
    textShadowRadius: 1,
    zIndex: 2,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonNo: {
    backgroundColor: Colors.shade[200],
    borderWidth: 2,
    borderColor: Colors.senary[300],
  },
  modalButtonUnlock: {
    backgroundColor: Colors.senary[300],
  },
  modalButtonTextNo: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  modalButtonTextUnlock: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
});
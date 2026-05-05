import { useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

const avatars = {
  ready: require("../assets/images/avatar/av-ready.png"),
  bookworm: require("../assets/images/avatar/av-bookworm.png"),
  coffe: require("../assets/images/avatar/av-coffe.png"),
  cold: require("../assets/images/avatar/av-cold.png"),
  doggo: require("../assets/images/avatar/av-doggo.png"),
  dream: require("../assets/images/avatar/av-dream.png"),
  kitties: require("../assets/images/avatar/av-kitties.png"),
  naughty: require("../assets/images/avatar/av-naughty.png"),
  sing: require("../assets/images/avatar/av-sing.png"),
  sport: require("../assets/images/avatar/av-sport.png"),
  child: require("../assets/images/avatar/av-child.png"),
};

const coinImage = require("../assets/images/shop/coin.png");

type Leader = {
  id: string;
  name: string;
  points: number;
  avatar: any;
};

const podiumLeaders: Leader[] = [
  {
    id: "rank-2",
    name: "Meghan\nJess",
    points: 40,
    avatar: avatars.ready,
  },
  {
    id: "rank-1",
    name: "Bryan Wolf",
    points: 43,
    avatar: avatars.sport,
  },
  {
    id: "rank-3",
    name: "Alex Turner",
    points: 38,
    avatar: avatars.dream,
  },
];

const leaderboard: Leader[] = [
  { id: "rank-4", name: "Alicia", points: 36, avatar: avatars.kitties },
  { id: "rank-5", name: "Alicia", points: 35, avatar: avatars.bookworm },
  { id: "rank-6", name: "Alicia", points: 34, avatar: avatars.coffe },
  { id: "rank-7", name: "Alicia", points: 33, avatar: avatars.sing },
  { id: "rank-8", name: "Alicia", points: 32, avatar: avatars.child },
  { id: "rank-9", name: "Alicia", points: 31, avatar: avatars.doggo },
  { id: "rank-10", name: "Alicia", points: 30, avatar: avatars.naughty },
  { id: "rank-11", name: "Alicia", points: 29, avatar: avatars.ready },
  { id: "rank-12", name: "Alicia", points: 28, avatar: avatars.bookworm },
  { id: "rank-13", name: "Alicia", points: 25, avatar: avatars.coffe },
  { id: "rank-14", name: "Alicia", points: 24, avatar: avatars.child },
  { id: "rank-15", name: "Alicia", points: 23, avatar: avatars.doggo },
  { id: "rank-16", name: "Alicia", points: 22, avatar: avatars.naughty },
  { id: "rank-17", name: "You", points: 21, avatar: avatars.ready },
  { id: "rank-18", name: "Alicia", points: 20, avatar: avatars.sing },
  { id: "rank-19", name: "Alicia", points: 19, avatar: avatars.kitties },
];

const userRankId = "rank-17";

export default function Leaderboard() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [userRowY, setUserRowY] = useState(0);
  const [helpVisible, setHelpVisible] = useState(false);

  const jumpToUser = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(userRowY - 60, 0),
      animated: true,
    });
  };

  return (
    <View style={styles.screen}>
      <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
        <Defs>
          <LinearGradient id="leaderGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFEEBE" />
            <Stop offset="1" stopColor={Colors.quinary[100]} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#leaderGradient)" />
      </Svg>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.octonary.DEFAULT} />
          </Pressable>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <Pressable style={styles.giftButton} onPress={() => {}}>
            <Ionicons name="gift" size={20} color={Colors.octonary.DEFAULT} />
          </Pressable>
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color={Colors.grey[400]} />
          <Text style={styles.timeText}>1d:12h:50s left</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.podiumSection}>
          <View style={styles.podiumArc} />
          <View style={styles.podiumRow}>
            <View style={[styles.podiumCard, styles.podiumSecond]}>
              <Ionicons name="crown" size={26} color="#B7BBC3" />
              <View style={styles.podiumAvatarWrap}>
                <Image source={podiumLeaders[0].avatar} style={styles.podiumAvatar} />
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>2</Text>
              </View>
              <Text style={styles.podiumName}>{podiumLeaders[0].name}</Text>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsText}>{podiumLeaders[0].points} pts</Text>
              </View>
            </View>

            <View style={[styles.podiumCard, styles.podiumFirst]}>
              <Ionicons name="crown" size={30} color="#F7B633" />
              <View style={[styles.podiumAvatarWrap, styles.podiumAvatarMain]}>
                <Image source={podiumLeaders[1].avatar} style={styles.podiumAvatarLarge} />
              </View>
              <View style={styles.rankBadgeMain}>
                <Text style={styles.rankBadgeText}>1</Text>
              </View>
              <Text style={styles.podiumName}>{podiumLeaders[1].name}</Text>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsText}>{podiumLeaders[1].points} pts</Text>
              </View>
            </View>

            <View style={[styles.podiumCard, styles.podiumThird]}>
              <Ionicons name="crown" size={26} color="#8B5E3C" />
              <View style={styles.podiumAvatarWrap}>
                <Image source={podiumLeaders[2].avatar} style={styles.podiumAvatar} />
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>3</Text>
              </View>
              <Text style={styles.podiumName}>{podiumLeaders[2].name}</Text>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsText}>{podiumLeaders[2].points} pts</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.listPanel}>
          <Pressable onPress={() => setHelpVisible(true)}>
            <Text style={styles.helpLink}>How to earn points?</Text>
          </Pressable>

          <View style={styles.listWrap}>
            {leaderboard.map((item, index) => {
              const rank = index + 4;
              const isUser = item.id === userRankId;

              if (isUser) {
                return (
                  <View
                    key={item.id}
                    style={styles.userActiveContainer}
                    onLayout={(event) => setUserRowY(event.nativeEvent.layout.y)}
                  >
                    <View style={[styles.listItem, styles.listItemActive]}>
                      <Text style={[styles.rankText, styles.rankTextActive]}>{rank}</Text>
                      <Image source={item.avatar} style={styles.listAvatar} />
                      <Text style={[styles.nameText, styles.nameTextActive]}>{item.name}</Text>
                      <Text style={[styles.pointsRight, styles.pointsRightActive]}>
                        {item.points} pts
                      </Text>
                    </View>
                    <View style={styles.userStats}>
                      <Text style={styles.userStatsText}>Top 10.0%</Text>
                      <View style={styles.userStatsRight}>
                        <Image source={coinImage} style={styles.userStatsCoin} />
                        <Text style={styles.userStatsValue}>100</Text>
                      </View>
                    </View>
                  </View>
                );
              }

              return (
                <View key={item.id} style={styles.listItem}>
                  <Text style={styles.rankText}>{rank}</Text>
                  <Image source={item.avatar} style={styles.listAvatar} />
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.pointsRight}>{item.points} pts</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.jumpWrap}>
        <Pressable style={styles.jumpButton} onPress={jumpToUser}>
          <Text style={styles.jumpText}>Jump to Position</Text>
        </Pressable>
      </View>

      <Modal transparent animationType="fade" visible={helpVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How to earn points?</Text>
            <View style={styles.modalList}>
              <View style={styles.modalBulletRow}>
                <Text style={styles.modalBullet}>•</Text>
                <Text style={styles.modalItem}>
                  For every finished practice session (casual, story, or VR mode), gain 5pts.
                </Text>
              </View>
              <View style={styles.modalBulletRow}>
                <Text style={styles.modalBullet}>•</Text>
                <Text style={styles.modalItem}>For every feedback given, gain 1pts</Text>
              </View>
              <View style={styles.modalBulletRow}>
                <Text style={styles.modalBullet}>•</Text>
                <Text style={styles.modalItem}>
                  Try to aim for higher points to gain even more coins rewards!
                </Text>
              </View>
            </View>
            <Pressable style={styles.modalButton} onPress={() => setHelpVisible(false)}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  giftButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  timeText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.grey[400],
  },

  podiumSection: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  podiumArc: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignSelf: "center",
    top: 100,
  },
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  podiumCard: {
    alignItems: "center",
    gap: 8,
  },
  podiumFirst: {
    transform: [{ translateY: -14 }],
  },
  podiumSecond: {
    transform: [{ translateY: 6 }],
  },
  podiumThird: {
    transform: [{ translateY: 6 }],
  },
  podiumAvatarWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  podiumAvatarMain: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  podiumAvatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -12 }],
    marginBottom: -12,
  },
  rankBadgeMain: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -12 }],
    marginBottom: -12,
  },
  rankBadgeText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
  podiumName: {
    textAlign: "center",
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pointsText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  listPanel: {
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  helpLink: {
    textAlign: "right",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.blue[200],
    textDecorationLine: "underline",
  },
  listWrap: {
    marginTop: 16,
    gap: 14,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.blue[200],
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.shade[200],
  },
  listItemActive: {
    backgroundColor: "#A8DFFF",
    borderColor: Colors.blue[300],
  },
  userActiveContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.blue[400],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
  },
  listItemActive: {
    backgroundColor: "#A8DFFF", // Light blue from design
    borderWidth: 0,
    borderRadius: 0,
  },
  rankText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.blue[500],
    width: 24,
  },
  rankTextActive: {
    color: Colors.blue[600],
  },
  listAvatar: {
    width: 30,
    height: 30,
    borderRadius: 12,
  },
  nameText: {
    flex: 1,
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.blue[500],
  },
  nameTextActive: {
    color: Colors.blue[600],
  },
  pointsRight: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.blue[500],
  },
  pointsRightActive: {
    color: Colors.blue[600],
  },
  userStats: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userStatsText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.blue[500],
  },
  userStatsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userStatsCoin: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  userStatsValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  jumpWrap: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
  jumpButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    backgroundColor: Colors.senary[300],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  jumpText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: "center",
    gap: 44,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  modalList: {
    alignSelf: "stretch",
    gap: 12,
  },
  modalBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  modalBullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    lineHeight: 22,
  },
  modalItem: {
    flex: 1,
    fontFamily: "AlbertSans-Regular",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
    lineHeight: 22,
  },
  modalButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
});
import { useEffect, useRef, useState } from "react";
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
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import TitlePill from "../components/title-pill";
import { Colors } from "../constants/colors";
import { titleList } from "../constants/titles";
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
const goldCrown = require("../assets/images/leaderboard/gold.png");
const silverCrown = require("../assets/images/leaderboard/silver.png");
const bronzeCrown = require("../assets/images/leaderboard/bronze.png");

const coinImage = require("../assets/images/shop/coin.png");
const confettiImage = require("../assets/images/confetti.png");
const titleBadgeImage = require("../assets/images/title/title.png");

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
  { id: "rank-5", name: "Alex", points: 35, avatar: avatars.bookworm },
  { id: "rank-6", name: "Jane", points: 34, avatar: avatars.coffe },
  { id: "rank-7", name: "Alline", points: 33, avatar: avatars.sing },
  { id: "rank-8", name: "Lisa", points: 32, avatar: avatars.child },
  { id: "rank-9", name: "Rey", points: 31, avatar: avatars.doggo },
  { id: "rank-10", name: "Kate", points: 30, avatar: avatars.naughty },
  { id: "rank-11", name: "Mary", points: 29, avatar: avatars.ready },
  { id: "rank-12", name: "Aaron", points: 28, avatar: avatars.bookworm },
  { id: "rank-13", name: "George", points: 25, avatar: avatars.coffe },
  { id: "rank-14", name: "Jill", points: 24, avatar: avatars.child },
  { id: "rank-15", name: "Jack", points: 23, avatar: avatars.doggo },
  { id: "rank-16", name: "Jen", points: 22, avatar: avatars.naughty },
  { id: "rank-17", name: "You", points: 21, avatar: avatars.ready },
  { id: "rank-18", name: "Daniel", points: 20, avatar: avatars.sing },
  { id: "rank-19", name: "Gabriel", points: 19, avatar: avatars.kitties },
];

const userRankId = "rank-17";

export default function Leaderboard() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [userRowY, setUserRowY] = useState(0);
  const [helpVisible, setHelpVisible] = useState(false);
  const [rewardStep, setRewardStep] = useState<"congrats" | "collect" | null>(null);
  const [weeklyVisible, setWeeklyVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const rewardAmount = 160;
  const selectedTitle = titleList[3];
  useEffect(() => {
    setRewardStep("congrats");
  }, []);

  useEffect(() => {
    setRewardStep("congrats");
    const timer = setTimeout(() => setTutorialVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

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
          <Pressable style={styles.giftButton} onPress={() => setWeeklyVisible(true)}>
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
              <Image source={silverCrown} style={styles.crownImage} />
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
              <Image source={goldCrown} style={styles.crownImage} />
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
              <Image source={bronzeCrown} style={styles.crownImage} />
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
      <Modal transparent visible={tutorialVisible} animationType="fade">
        <Pressable 
          style={styles.tutorialOverlay} 
          onPress={() => setTutorialVisible(false)}
        >
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltipTriangle} />
            <View style={styles.tooltipCard}>
              <Text style={styles.tooltipText}>
                Click here to check possible rewards
              </Text>
            </View>
          </View>
        </Pressable>
      </Modal>
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

      <Modal transparent animationType="fade" visible={rewardStep !== null}>
        <View style={styles.modalOverlay}>
          <Image source={confettiImage} style={styles.confetti} pointerEvents="none" />
          {rewardStep === "congrats" ? (
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>Congrats on your rank this week!</Text>
              <View style={styles.rewardRankCard}>
                <View style={styles.rewardRankTop}>
                  <Text style={styles.rewardRankText}>17</Text>
                  <Image source={avatars.ready} style={styles.rewardAvatar} />
                  <Text style={styles.rewardName}>You</Text>
                  <Text style={styles.rewardPoints}>21 pts</Text>
                </View>
                <View style={styles.rewardRankBottom}>
                  <Text style={styles.rewardRankLabel}>Top 10.0%</Text>
                  <View style={styles.rewardCoinRow}>
                    <Image source={coinImage} style={styles.rewardCoin} />
                    <Text style={styles.rewardCoinValue}>{rewardAmount}</Text>
                  </View>
                </View>
              </View>
              <Pressable style={styles.rewardButton} onPress={() => setRewardStep("collect")}>
                <Text style={styles.rewardButtonText}>Okay</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>Here is your reward!</Text>
              <View style={styles.rewardCoinRowLarge}>
                <Image source={coinImage} style={styles.rewardCoinLarge} />
                <Text style={styles.rewardCoinValueLarge}>{rewardAmount}</Text>
              </View>
              <Pressable style={styles.rewardButton} onPress={() => setRewardStep(null)}>
                <Text style={styles.rewardButtonText}>Collect Rewards</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={weeklyVisible}>
        <View style={styles.drawerOverlay}>
          <Pressable style={styles.drawerBackdrop} onPress={() => setWeeklyVisible(false)} />
          <View style={styles.drawerSheet}>
            <Pressable
              style={styles.drawerHandle}
              onPress={() => setWeeklyVisible(false)}
            />
            <Text style={styles.drawerTitle}>Weekly Rewards</Text>

            <View style={styles.drawerUserCard}>
              <View style={styles.drawerUserTop}>
                <Text style={styles.drawerRankText}>17</Text>
                <Image source={avatars.ready} style={styles.drawerAvatar} />
                <Text style={styles.drawerName}>You</Text>
                <Text style={styles.drawerPoints}>21 pts</Text>
              </View>
              <View style={styles.drawerUserBottom}>
                <Text style={styles.drawerUserLabel}>Top 10.0%</Text>
                <View style={styles.drawerCoinRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerCoinValue}>160</Text>
                </View>
              </View>
            </View>

            <View style={styles.drawerHeaderRow}>
              <Text style={styles.drawerHeaderText}>Rank</Text>
              <Text style={styles.drawerHeaderText}>Rewards</Text>
            </View>

            <ScrollView contentContainerStyle={styles.drawerList} showsVerticalScrollIndicator={false}>
              <View style={styles.drawerRow}>
                <View style={styles.rankBadgeGold}>
                  <Text style={styles.rankBadgeValue}>1</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>180</Text>
                  <Text style={styles.rewardPlus}>+</Text>
                  <Pressable onPress={() => setTitleVisible(true)}>
                    <Image source={titleBadgeImage} style={styles.titleBadge} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <View style={styles.rankBadgeSilver}>
                  <Text style={styles.rankBadgeValue}>2</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>180</Text>
                  <Text style={styles.rewardPlus}>+</Text>
                  <Pressable onPress={() => setTitleVisible(true)}>
                    <Image source={titleBadgeImage} style={styles.titleBadge} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <View style={styles.rankBadgeBronze}>
                  <Text style={styles.rankBadgeValue}>3</Text>
                </View>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>180</Text>
                  <Text style={styles.rewardPlus}>+</Text>
                  <Pressable onPress={() => setTitleVisible(true)}>
                    <Image source={titleBadgeImage} style={styles.titleBadge} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <Text style={styles.rankPercentText}>Top 5.0%</Text>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>180</Text>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <Text style={styles.rankPercentText}>Top 10.0%</Text>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>160</Text>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <Text style={styles.rankPercentText}>Top 20.0%</Text>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>140</Text>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <Text style={styles.rankPercentText}>Top 30.0%</Text>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>120</Text>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <Text style={styles.rankPercentText}>Top 50.0%</Text>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>100</Text>
                </View>
              </View>

              <View style={styles.drawerRow}>
                <Text style={styles.rankPercentText}>Top 100.0%</Text>
                <View style={styles.rewardRow}>
                  <Image source={coinImage} style={styles.drawerCoin} />
                  <Text style={styles.drawerRewardValue}>80</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={titleVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.titleModalCard}>
            <TitlePill title={selectedTitle} size="md" />
            <Text style={styles.titleModalHeading}>Requirement:</Text>
            <Text style={styles.titleModalText}>Top 3 in weekly leaderboard</Text>
            <Pressable style={styles.titleModalButton} onPress={() => setTitleVisible(false)}>
              <Text style={styles.titleModalButtonText}>Okay</Text>
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    marginHorizontal:24,
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
    transform: [{ translateY: -34 }],
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
    width: 80,
    height: 80,
    borderRadius: 46,
  },
  podiumAvatar: {
    width: 74,
    height: 74,
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
  userActiveContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.blue[400],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
  },
  listItemActive: {
    backgroundColor: "#A8DFFF",
    borderWidth: 0,
    borderRadius: 0,
  },
  rankText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
    width: 24,
  },
  rankTextActive: {
    color: Colors.shade[100],
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
    color: Colors.shade[100],
  },
  nameTextActive: {
    color: Colors.shade[100],
  },
  pointsRight: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  pointsRightActive: {
    color: Colors.shade[100],
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
    color: Colors.shade[100],
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
  confetti: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
    gap: 24,
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
  rewardCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    gap: 24,
  },
  rewardTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  rewardRankCard: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.blue[400],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
  },
  rewardRankTop: {
    backgroundColor: "#A8DFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rewardRankBottom: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardRankText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
    width: 24,
  },
  rewardAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
  },
  rewardName: {
    flex: 1,
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  rewardPoints: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  rewardRankLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  rewardCoinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rewardCoin: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  rewardCoinValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  rewardCoinRowLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rewardCoinLarge: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  rewardCoinValueLarge: {
    fontFamily: "Quicksand-Bold",
    fontSize: 26,
    color: Colors.octonary.DEFAULT,
  },
  rewardButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  rewardButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  drawerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerSheet: {
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: "88%",
  },
  drawerHandle: {
    alignSelf: "center",
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neutral[300],
    marginBottom: 16,
  },
  drawerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    marginBottom: 16,
  },
  drawerUserCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.blue[400],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
    marginBottom: 16,
  },
  drawerUserTop: {
    backgroundColor: "#A8DFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drawerUserBottom: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerRankText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
    width: 24,
  },
  drawerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
  },
  drawerName: {
    flex: 1,
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  drawerPoints: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  drawerUserLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  drawerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  drawerHeaderText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  drawerList: {
    gap: 12,
    paddingBottom: 20,
  },
  drawerRow: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.blue[200],
    backgroundColor: Colors.shade[200],
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rankBadgeGold: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.warning[400],
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeSilver: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeBronze: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#9A5B32",
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  rankPercentText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[100],
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerCoinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drawerCoin: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  drawerCoinValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  drawerRewardValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  rewardPlus: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    marginHorizontal: 2,
  },
  titleBadge: {
    height: 28,
    width: 96,
    resizeMode: "contain",
  },
  titleModalCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    gap: 18,
  },
  titleCardImage: {
    height: 34,
    width: 160,
    resizeMode: "contain",
  },
  titleModalHeading: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  titleModalText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  titleModalButton: {
    width: 140,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  titleModalButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  tutorialOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  tooltipContainer: {
    position: "absolute",
    top: 90,
    right: 20,
    alignItems: "flex-end",
  },
  tooltipTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    marginRight: 20,
  },
  tooltipCard: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 16,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tooltipText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 24,
  },
  crownImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    marginBottom: -22,
  },
});
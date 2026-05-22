import { useEffect, useMemo, useState } from "react";
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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import NavBar from "../components/nav-bar";
import ProgressBar from "../components/progress-bar";
import { Colors } from "../constants/colors";
import { avatarList } from "../constants/avatars";
import { getMockUserData, subscribeToMockUser } from "../data/mock-user";

const bgImage = require("../assets/images/homepage/bg-home.png");
const coinImage = require("../assets/images/shop/coin.png");
const streakImage = require("../assets/images/homepage/il-streak.png");
const leaderboardImage = require("../assets/images/homepage/il-leaderboard.png");
const shopBgImage = require("../assets/images/bg-shoptiny.png");
const shopImage = require("../assets/images/homepage/cashier.png");
const eventImage = require("../assets/images/homepage/event1.png");
const storyModeImage = require("../assets/images/homepage/story-mode.png");
const casualModeImage = require("../assets/images/homepage/casual-mode.png");
const vrModeImage = require("../assets/images/homepage/vrmode.png");

const challengePreview = [
  {
    id: "c1",
    title: "Finish public speaking exercise 1 time",
    current: 1,
    total: 1,
  },
  {
    id: "c2",
    title: "Give 3 feedbacks to other's performance",
    current: 1,
    total: 3,
  },
  {
    id: "c3",
    title: "Finish casual mode 2 time(s)",
    current: 1,
    total: 4,
  },
];

export default function Home() {
  const router = useRouter();
  const hasUnclaimedChallenges = true;
  const hasNewNotifications = true;
  const [userData, setUserData] = useState(getMockUserData());

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  const equippedAvatar =
    avatarList.find((item) => item.id === userData.equippedAvatarId) ?? avatarList[0];

  const completedCount = useMemo(() => {
    return challengePreview.filter((item) => item.current >= item.total).length;
  }, []);

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        imageStyle={{ opacity: 0.5 }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerRow}>
              <View style={styles.profileRow}>
                <Image source={equippedAvatar?.image} style={styles.avatar} />
                <View>
                  <Text style={styles.greeting}>Good Morning!</Text>
                  <Text style={styles.name}>{userData.profile.fullName}</Text>
                </View>
              </View>

              <View style={styles.headerActions}>
                <View style={styles.coinPill}>
                  <Image source={coinImage} style={styles.coinIcon} />
                  <Text style={styles.coinText}>{userData.coins}</Text>
                </View>
                <Pressable
                  style={styles.notificationButton}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons
                    name="notifications"
                    size={26}
                    color={Colors.octonary.DEFAULT}
                  />
                  {hasNewNotifications && <View style={styles.dot} />}
                </Pressable>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Pressable style={styles.statCard} onPress={() => {}}>
                <View style={styles.statTextWrap}>
                  <Text style={styles.statValue}>{userData.streakDays} days</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
                <Image source={streakImage} style={styles.statImage} />
              </Pressable>

              <Pressable
                style={[styles.statCard, styles.statCardAlt]}
                onPress={() => router.push("/leaderboard")}
              >
                <View style={styles.statTextWrap}>
                  <Text style={styles.statValue}>#{userData.leaderboardRank}</Text>
                  <Text style={styles.statLabel}>Leaderboard</Text>
                </View>
                <Image source={leaderboardImage} style={styles.statImage} />
              </Pressable>
            </View>

            <View style={styles.sectionGroup}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Challenges</Text>
                  {hasUnclaimedChallenges && <View style={styles.badgeDot} />}
                </View>
                <Pressable onPress={() => router.push("/challenges")}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.octonary.DEFAULT}
                  />
                </Pressable>
              </View>
              <View style={styles.subtitleRow}>
                <Text style={styles.sectionSubtitle}>
                  Finish these challenges to obtain lots of{" "}
                </Text>
                <Image source={coinImage} style={styles.inlineCoin} />
              </View>

              <View style={styles.challengeCard}>
                {challengePreview.map((item) => {
                  const completed = item.current >= item.total;
                  const progress = item.total ? item.current / item.total : 0;

                  return (
                    <View key={item.id} style={styles.challengeRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={completed ? Colors.success[400] : Colors.neutral[400]}
                      />
                      <View style={styles.challengeBody}>
                        <View style={styles.challengeTopRow}>
                          <Text style={styles.challengeTitle}>{item.title}</Text>
                          <Text style={styles.challengeCount}>
                            {item.current}/{item.total}
                          </Text>
                        </View>
                        <ProgressBar
                          progress={progress}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <Pressable
              style={styles.shopCardWrapper}
              onPress={() => router.push("/shop")}
            >
              <ImageBackground
                source={shopBgImage}
                style={styles.shopCard}
                imageStyle={[ { opacity: 0.5 }]}
              >
                <View style={styles.shopTextWrap}>
                  <Text style={styles.shopTitle}>Shop</Text>
                  <Text style={styles.shopSubtitle}>
                    Spend your coins to{"\n"}purchase frames and avatar!
                  </Text>
                </View>
                <Image source={shopImage} style={styles.shopImage} />
              </ImageBackground>
            </Pressable>

            {/* <View style={styles.sectionGroup}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Limited time story!</Text>
                <Pressable onPress={() => router.push("/event")}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.octonary.DEFAULT}
                  />
                </Pressable>
              </View>

              <Pressable
                style={styles.eventCard}
                onPress={() => router.push("/event")}
              >
                <Image source={eventImage} style={styles.eventImage} />
                <View style={styles.eventLabelWrap}>
                   <Text style={[styles.modeLabel, { position: 'relative', top: 0, left: 0 }]}>Chapter 1</Text>
                   <Text style={styles.eventSubtitle}>First Day at Work</Text>
                </View>
                <View style={styles.eventBadge}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={Colors.octonary.DEFAULT}
                  />
                  <Text style={styles.eventBadgeText}>1D 20:54:18 left</Text>
                </View>
              </Pressable>
            </View> */}

            <View style={styles.sectionGroup}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Let's Practice!</Text>
                <Pressable onPress={() => {}}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.octonary.DEFAULT}
                  />
                </Pressable>
              </View>

              <View style={styles.modeRow}>
                <Pressable
                  style={styles.modeCard}
                  onPress={() => router.push("/story-mode")}
                >
                  <Image source={storyModeImage} style={styles.modeImage} />
                  <Text style={styles.modeLabel}>Story{"\n"}Mode</Text>
                </Pressable>
                <Pressable
                  style={styles.modeCard}
                  onPress={() => router.push("/casual-mode")}
                >
                  <Image source={casualModeImage} style={styles.modeImage} />
                  <Text style={styles.modeLabel}>Casual{"\n"}Mode</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.vrCard}
                onPress={() => router.push("/vr-mode")}
              >
                <Image source={vrModeImage} style={styles.vrImage} />
                <Text style={styles.vrLabel}>VR Mode</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="home" />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 130,
    gap: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  greeting: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  name: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.shade[200],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
  },
  coinIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  coinText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  notificationButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error[500],
    position: "absolute",
    top: 2,
    right: 2,
    borderWidth: 1.5,
    borderColor: Colors.shade[200],
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: "#FFEBEB",
    height: 86,
    overflow: "hidden",
  },
  statCardAlt: {
    borderColor: Colors.quinary[300],
    backgroundColor: "#FFF4C2",
  },
  statTextWrap: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 2,
  },
  statValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  statLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 11,
    color: Colors.octonary.DEFAULT,
  },
  statImage: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 75,
    height: 75,
    resizeMode: "contain",
    zIndex: 1,
  },
  sectionGroup: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error[500],
    marginLeft: 4,
    marginTop: -10,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -8,
  },
  sectionSubtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  inlineCoin: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    transform: [{ translateY: -1 }],
  },
  challengeCard: {
    backgroundColor: "#FFF4C2",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.quinary[300],
    padding: 16,
    gap: 16,
  },
  challengeRow: {
    flexDirection: "row",
    gap: 10,
  },
  challengeBody: {
    flex: 1,
    gap: 8,
  },
  challengeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  challengeTitle: {
    flex: 1,
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 10,
    color: Colors.octonary.DEFAULT,
  },
  challengeCount: {
    fontFamily: "Quicksand-Bold",
    fontSize: 10,
    color: Colors.octonary.DEFAULT,
  },
  shopCardWrapper: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    overflow: "hidden", 
  },
  shopCard: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 18,
    minHeight: 120,
  },
  shopTextWrap: {
    width: "60%", 
    gap: 4,
    zIndex: 2,
  },
  shopTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  shopSubtitle: {
    fontFamily: "AlbertSans-Medium",
    fontSize: 10,
    lineHeight: 14,
    color: Colors.octonary.DEFAULT,
  },
  shopImage: {
    position: "absolute",
    bottom: 0,
    right: 12,
    width: 140, 
    height: 110,
    resizeMode: "contain",
    zIndex: 1,
  },
  eventCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  eventLabelWrap: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  eventSubtitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.shade[100],
  },
  eventBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFF4C2",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventBadgeText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
  },
  modeCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  modeImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  modeLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[100],
    textAlign: "left",
  },
  vrCard: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  vrImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },
  vrLabel: {
    position: "absolute",
    top: 12,
    right: 12,
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
});
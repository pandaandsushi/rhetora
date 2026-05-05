import { useState } from "react";
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

import ChallengeCard from "../components/challenge-card";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

const backgroundImage = require("../assets/images/challenge-bg.png");
const coinImage = require("../assets/images/shop/coin.png");
const confettiImage = require("../assets/images/confetti.png");

type Challenge = {
  id: string;
  title: string;
  current: number;
  total: number;
  coinValue: number;
};

const dailyChallenges: Challenge[] = [
  {
    id: "daily-1",
    title: "Check personal progress in\ndashboard",
    current: 1,
    total: 1,
    coinValue: 160,
  },
  {
    id: "daily-2",
    title: "Finish public speaking\nexercise 1 time",
    current: 2,
    total: 2,
    coinValue: 160,
  },
  {
    id: "daily-3",
    title: "Give 3 feedbacks to other's\nperformance",
    current: 1,
    total: 3,
    coinValue: 160,
  },
];

const weeklyChallenges: Challenge[] = [
  {
    id: "weekly-1",
    title: "Finish public speaking\nexercise 3 time",
    current: 1,
    total: 3,
    coinValue: 160,
  },
  {
    id: "weekly-2",
    title: "Finish public speaking\nexercise 1 time",
    current: 1,
    total: 2,
    coinValue: 160,
  },
  {
    id: "weekly-3",
    title: "Give 3 feedbacks to other's\nperformance",
    current: 1,
    total: 3,
    coinValue: 160,
  },
];

export default function Challenges() {
  const router = useRouter();
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardVisible, setRewardVisible] = useState(false);

  const claim = (id: string, coinValue: number) => {
    setClaimedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setRewardAmount(coinValue);
    setRewardVisible(true);
  };

  const claimAll = () => {
    const allChallenges = [...dailyChallenges, ...weeklyChallenges];
    const claimable = allChallenges.filter(
      (item) => item.current >= item.total && !claimedIds.includes(item.id),
    );

    if (claimable.length === 0) {
      return;
    }

    const updatedClaimedIds = claimable.map((item) => item.id);
    const totalReward = claimable.reduce((sum, item) => sum + item.coinValue, 0);

    setClaimedIds((prev) => [...prev, ...updatedClaimedIds]);
    setRewardAmount(totalReward);
    setRewardVisible(true);
  };

  const dailyClaimableCount = dailyChallenges.filter(
    (item) => item.current >= item.total,
  ).length;

  return (
    <View style={styles.screen}>
      <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
        <Defs>
          <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FEF9C4" />
            <Stop offset="1" stopColor="#FFFFFF" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGradient)" />
      </Svg>

      <Image
        source={backgroundImage}
        style={styles.backgroundImage}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea}>
        <TopHeader
          title="Challenges"
          variant="transparent"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
          <View style={styles.timerWrap}>
            <Ionicons name="time-outline" size={16} color={Colors.octonary.DEFAULT} />
            <Text style={styles.timerText}>23:54:37 left</Text>
          </View>
        </View>

        <View style={styles.cardList}>
          {dailyChallenges.map((item) => {
            const claimable = item.current >= item.total;

            return (
              <ChallengeCard
                key={item.id}
                title={item.title}
                current={item.current}
                total={item.total}
                coinValue={item.coinValue}
                claimable={claimable}
                claimed={claimedIds.includes(item.id)}
                onClaim={() => claim(item.id, item.coinValue)}
              />
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Challenges</Text>
          <View style={styles.timerWrap}>
            <Ionicons name="time-outline" size={16} color={Colors.octonary.DEFAULT} />
            <Text style={styles.timerText}>1D 20:54:18 left</Text>
          </View>
        </View>

        <View style={styles.cardList}>
          {weeklyChallenges.map((item) => {
            const claimable = item.current >= item.total;

            return (
              <ChallengeCard
                key={item.id}
                title={item.title}
                current={item.current}
                total={item.total}
                coinValue={item.coinValue}
                claimable={claimable}
                claimed={claimedIds.includes(item.id)}
                onClaim={() => claim(item.id, item.coinValue)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.claimWrap}>
        <View style={styles.claimShadow} />
        <Pressable style={styles.claimButton} onPress={claimAll}>
          <Text style={styles.claimText}>Claim All</Text>
        </Pressable>
      </View>

      <Modal transparent animationType="fade" visible={rewardVisible}>
        <View style={styles.modalOverlay}>
          <Image
            source={confettiImage}
            style={styles.confetti}
            pointerEvents="none"
          />
          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Here is your reward!</Text>
            <View style={styles.rewardRow}>
              <Image source={coinImage} style={styles.rewardCoin} />
              <Text style={styles.rewardValue}>{rewardAmount}</Text>
            </View>
            <Pressable
              style={styles.rewardButton}
              onPress={() => setRewardVisible(false)}
            >
              <Text style={styles.rewardButtonText}>Collect Rewards</Text>
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
  backgroundImage: {
    position: "absolute",
    bottom: -40,
    left: 0,
    right: 0,
    width: "100%",
    height: 320,
    resizeMode: "contain",
    opacity: 0.5,
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 160,
    gap: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  timerWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  cardList: {
    gap: 14,
  },
  claimWrap: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  claimShadow: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  claimButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  claimText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.50)",
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
  rewardCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
    gap: 20,
  },
  rewardTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rewardCoin: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  rewardValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 26,
    color: Colors.octonary.DEFAULT,
  },
  rewardButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  rewardButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  claimBadge: {
    position: "absolute",
    right: 18,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.warning[300],
    alignItems: "center",
    justifyContent: "center",
  },
  claimBadgeText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
});

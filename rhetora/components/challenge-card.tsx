import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";
import ProgressBar from "./progress-bar";

const coinImage = require("../assets/images/shop/coin.png");

type ChallengeCardProps = {
  title: string;
  current: number;
  total: number;
  coinValue: number;
  claimable?: boolean;
  claimed?: boolean;
  onClaim?: () => void;
};

export default function ChallengeCard({
  title,
  current,
  total,
  coinValue,
  claimable = false,
  claimed = false,
  onClaim,
}: ChallengeCardProps) {
  const progress = total > 0 ? current / total : 0;
  const showGift = claimable && !claimed;

  return (
    <View style={[styles.card, claimed && styles.cardClaimed]}>
      <View style={styles.contentWrap}>
        <View style={styles.coinWrap}>
          <View style={styles.coinHalo}>
            <Image source={coinImage} style={styles.coinImage} />
          </View>
          <Text style={styles.coinText}>{coinValue}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.progressRow}>
            <ProgressBar progress={progress} style={{ flex: 1 }} />
            <Text style={styles.count}>
              {current}/{total}
            </Text>
          </View>
        </View>
      </View>

      {showGift ? (
        <Pressable style={styles.giftButton} onPress={onClaim} hitSlop={10}>
          <Ionicons name="gift" size={22} color={Colors.octonary.DEFAULT} />
        </Pressable>
      ) : claimed ? (
        <View style={styles.checkWrap}>
          <Ionicons name="checkmark" size={20} color={Colors.octonary.DEFAULT} />
        </View>
      ) : (
        <View style={styles.chevronWrap}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.octonary.DEFAULT}
          />
        </View>
      )}

      {/* Black transparent overlay sits on top of everything */}
      {claimed && <View style={styles.overlay} pointerEvents="none" />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.turquoise[300],
    backgroundColor: Colors.shade[200],
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardClaimed: {
    // Remove the solid background so the background images can show through
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)", // The black transparent layer
    borderRadius: 14, // Match the card's border radius
  },
  contentWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinWrap: {
    alignItems: "center",
    width: 70,
  },
  coinHalo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  coinImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  coinText: {
    marginTop: 6,
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  body: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  count: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  giftButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.warning[300],
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  chevronWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  checkWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.warning[300],
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
});
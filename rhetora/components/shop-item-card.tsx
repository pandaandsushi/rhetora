import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

const coinImage = require("../assets/images/shop/coin.png");

type ShopItemCardProps = {
  title: string;
  image: any;
  avatarImage?: any;
  variant?: "avatar" | "frame" | "unlock";
  price: number;
  obtained?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
};

export default function ShopItemCard({
  title,
  image,
  avatarImage,
  variant = "avatar",
  price,
  obtained = false,
  dimmed = false,
  onPress,
}: ShopItemCardProps) {
  return (
    <Pressable style={[styles.card]} onPress={onPress}>
      <View style={styles.previewWrap}>
        {variant === "frame" && avatarImage ? (
          <View style={styles.framePreview}>
            <Image source={avatarImage} style={styles.avatarPreview} />
            <Image source={image} style={styles.framePreviewImage} />
          </View>
        ) : (
          <Image source={image} style={styles.previewImage} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pill}>
        {obtained ? (
          <View style={styles.obtainedRow}>
            <View style={styles.obtainedIcon}>
              <Ionicons name="checkmark" size={14} color={Colors.octonary.DEFAULT} />
            </View>
            <Text style={styles.obtainedText}>Obtained</Text>
          </View>
        ) : (
          <View style={styles.priceRow}>
            <Image source={coinImage} style={styles.coinIcon} />
            <Text style={styles.priceText}>{price}</Text>
          </View>
        )}
      </View>
        {dimmed && <View style={styles.dimOverlay} pointerEvents="none" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  previewWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  framePreview: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPreview: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  previewImage: {
    width: 78,
    height: 78,
    resizeMode: "contain",
  },
  framePreviewImage: {
    position: "absolute",
    width: 78,
    height: 78,
    resizeMode: "contain",
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  pill: {
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coinIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  priceText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  obtainedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  obtainedIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#A7E76C",
    alignItems: "center",
    justifyContent: "center",
  },
  obtainedText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
});

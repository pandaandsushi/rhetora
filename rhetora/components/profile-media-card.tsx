import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

type ProfileMediaCardProps = {
  title: string;
  image: any;
  equipped?: boolean;
  variant?: "avatar" | "frame";
  size?: "sm" | "lg";
  avatarImage?: any;
};

export default function ProfileMediaCard({
  title,
  image,
  equipped = false,
  variant = "avatar",
  size = "sm",
  avatarImage,
}: ProfileMediaCardProps) {
  const sizeStyles = size === "lg" ? styles.lg : styles.sm;

  return (
    <View style={[styles.card, sizeStyles.card]}>
      <View style={[styles.previewWrap, sizeStyles.previewWrap]}>
        {variant === "frame" ? (
          <View style={styles.framePreview}>
            <Image source={avatarImage} style={[styles.avatarImage, sizeStyles.avatarImage]} />
            <Image source={image} style={[styles.frameImage, sizeStyles.frameImage]} />
          </View>
        ) : (
          <Image source={image} style={[styles.avatarImage, sizeStyles.avatarImage]} />
        )}

        {equipped && (
          <View style={[styles.checkBadge, sizeStyles.checkBadge]}>
            <Ionicons name="checkmark" size={14} color={Colors.shade[200]} />
          </View>
        )}
      </View>
      <Text style={[styles.title, sizeStyles.title]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  previewWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  framePreview: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    borderRadius: 999,
  },
  frameImage: {
    position: "absolute",
    resizeMode: "contain",
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#3DBE8B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  sm: {
    card: {
      minHeight: 170,
    },
    previewWrap: {
      width: 110,
      height: 110,
    },
    avatarImage: {
      width: 86,
      height: 86,
    },
    frameImage: {
      width: 100,
      height: 100,
    },
    title: {
      fontSize: 16,
    },
  },
  lg: {
    card: {
      minHeight: 190,
      paddingHorizontal: 16,
    },
    previewWrap: {
      width: 120,
      height: 120,
    },
    avatarImage: {
      width: 94,
      height: 94,
    },
    frameImage: {
      width: 110,
      height: 110,
    },
    checkBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    title: {
      fontSize: 18,
    },
  },
});

import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "../constants/colors";

type EpisodeCardProps = {
  title: string;
  image: any;
  locked?: boolean;
  onPress?: () => void;
};

export default function EpisodeCard({
  title,
  image,
  locked = false,
  onPress,
}: EpisodeCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground source={image} style={styles.image} resizeMode="cover">
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.75)"]}
          style={styles.gradient}
        />

        <Text style={styles.title}>{locked ? "Unlock Previous Episode!" : title}</Text>

        {locked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={16} color={Colors.octonary.DEFAULT} />
          </View>
        )}

        {locked && <View style={styles.overlay} pointerEvents="none" />}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  image: {
    width: "100%",
    height: 140,
    justifyContent: "flex-end",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
    marginLeft: 16,
    marginBottom: 14,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
});

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";

const fallbackThumb = require("../assets/images/logorhetoraonly.png");

type RecordingCardProps = {
  title: string;
  mode: string;
  dateLabel: string;
  thumbnail?: any;
  hasVideo?: boolean;
  selected?: boolean;
  onPress?: () => void;
};

export default function RecordingCard({
  title,
  mode,
  dateLabel,
  thumbnail,
  hasVideo = true,
  selected = false,
  onPress,
}: RecordingCardProps) {
  const thumbSource = hasVideo ? thumbnail ?? fallbackThumb : fallbackThumb;

  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.thumbWrap}>
        <Image
          source={thumbSource}
          style={styles.thumb}
          resizeMode={hasVideo ? "cover" : "contain"}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{mode}</Text>
        <Text style={styles.meta}>{dateLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 14,
  },
  cardSelected: {
    borderColor: Colors.senary[300],
  },
  thumbWrap: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumb: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  subtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  meta: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
  },
});

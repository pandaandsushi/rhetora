import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type RecentActivityCardProps = {
  title: string;
  subtitle: string;
  timeLabel: string;
  onPress?: () => void;
};

export default function RecentActivityCard({
  title,
  subtitle,
  timeLabel,
  onPress,
}: RecentActivityCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.time}>{timeLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  body: {
    gap: 4,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
  },
  subtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  time: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
  },
});

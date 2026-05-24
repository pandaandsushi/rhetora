import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TitlePill from "../components/title-pill";
import type { TitleItem } from "../constants/titles";
import { Colors } from "../constants/colors";

type PeerFeedbackCardProps = {
  avatarImage: any;
  frameImage?: any;
  videoImage: any;
  name: string;
  title: TitleItem;
  message: string;
  tag: string;
  dateLabel: string;
  avgRating: number;
  commentCount: number;
  onGiveFeedback?: () => void;
  onCommentsPress?: () => void;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showGiveFeedback?: boolean;
};

export default function PeerFeedbackCard({
  avatarImage,
  frameImage,
  videoImage,
  name,
  title,
  message,
  tag,
  dateLabel,
  avgRating,
  commentCount,
  onGiveFeedback,
  onCommentsPress,
  showMenu = false,
  onMenuPress,
  showGiveFeedback = true,
}: PeerFeedbackCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarWrap}>
          <Image source={avatarImage} style={styles.avatarImage} />
          {frameImage && <Image source={frameImage} style={styles.frameImage} />}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.nameText}>{name}</Text>
          <TitlePill title={title} size="sm" />
        </View>
        {showMenu && (
          <Pressable style={styles.menuButton} onPress={onMenuPress}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.octonary.DEFAULT} />
          </Pressable>
        )}
      </View>

      <Text style={styles.message}>{message}</Text>

      <Text style={styles.dateText}>{dateLabel}</Text>

      <View style={styles.videoWrap}>
        <Image source={videoImage} style={styles.videoThumb} />
        <View style={styles.playButton}>
          <Ionicons name="play" size={28} color={Colors.shade[200]} />
        </View>
      </View>

      <View style={styles.tagRow}>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}># {tag}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.reactionRow}>
          <View style={styles.reactionItem}>
            <Ionicons name="star" size={20} color="#F59E0B" />
            <Text style={styles.reactionText}>{avgRating.toFixed(1)}</Text>
          </View>
          <Pressable style={styles.reactionItem} onPress={onCommentsPress}>
            <Ionicons name="chatbubble" size={20} color={Colors.octonary.DEFAULT} />
            <Text style={styles.reactionText}>{commentCount}</Text>
          </Pressable>
        </View>
        {showGiveFeedback && (
          <Pressable style={styles.feedbackButton} onPress={onGiveFeedback}>
            <Text style={styles.feedbackText}>Give Feedback</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  frameImage: {
    position: "absolute",
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  message: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  dateText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
  },
  videoWrap: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.neutral[100],
    height: 190,
    alignItems: "center",
    justifyContent: "center",
  },
  videoThumb: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  tagRow: {
    flexDirection: "row",
  },
  tagPill: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.turquoise[300],
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.turquoise[300],
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reactionText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  feedbackButton: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
});

import { Image, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopHeader from "@/components/top-header";
import { Colors } from "../constants/colors";
import NavBar from "@/components/nav-bar";

const bgImage = require("../assets/images/bg-motif.png");

const avatars = {
  ready: require("../assets/images/avatar/av-ready.png"),
  doggo: require("../assets/images/avatar/av-doggo.png"),
  bookworm: require("../assets/images/avatar/av-bookworm.png"),
  sing: require("../assets/images/avatar/av-sing.png"),
  sport: require("../assets/images/avatar/av-sport.png"),
  kitties: require("../assets/images/avatar/av-kitties.png"),
};

type NotificationItem = {
  id: string;
  user: string;
  action: string;
  title: string;
  time: string;
  avatar: any;
  unread?: boolean;
};

const todayNotifications: NotificationItem[] = [
  {
    id: "today-1",
    user: "John Doe",
    action: "gave feedback to your post",
    title: "Practicing Presenting in Class",
    time: "Today at 9:42 AM",
    avatar: avatars.ready,
    unread: true,
  },
];

const yesterdayNotifications: NotificationItem[] = [
  {
    id: "yesterday-1",
    user: "Denise Richards",
    action: "commented on your post",
    title: "First time trying story mode",
    time: "Yesterday at 9:42 AM",
    avatar: avatars.doggo,
    unread: true,
  },
  {
    id: "yesterday-2",
    user: "Karen Smith",
    action: "commented on your post",
    title: "First time trying story mode",
    time: "Yesterday at 9:42 AM",
    avatar: avatars.bookworm,
  },
];

const earlierNotifications: NotificationItem[] = [
  {
    id: "earlier-1",
    user: "Mary Ann",
    action: "commented on your post",
    title: "First time trying story mode",
    time: "Last Wednesday at 9:42 AM",
    avatar: avatars.sing,
  },
  {
    id: "earlier-2",
    user: "Dennis Nedry",
    action: "commented on your post",
    title: "First time trying story mode",
    time: "Last Tuesday at 9:42 AM",
    avatar: avatars.sport,
  },
  {
    id: "earlier-3",
    user: "Alicia",
    action: "liked your post",
    title: "Story mode recap",
    time: "Last Monday at 6:18 PM",
    avatar: avatars.kitties,
  },
  {
    id: "earlier-4",
    user: "Meghan Jess",
    action: "gave feedback to your post",
    title: "Confident intros",
    time: "Last Sunday at 2:09 PM",
    avatar: avatars.ready,
  },
  {
    id: "earlier-5",
    user: "Alex Turner",
    action: "commented on your post",
    title: "Weekly story wrap",
    time: "Last Saturday at 8:55 AM",
    avatar: avatars.bookworm,
  },
];

function NotificationCard({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={item.avatar} style={styles.cardAvatar} />
      <View style={styles.cardBody}>
        <Text style={styles.cardText}>
          <Text style={styles.cardUser}>{item.user} </Text>
          {item.action} <Text style={styles.cardTitle}>{item.title}</Text>
        </Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

export default function Notifications() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader
          title="Notifications"
          variant="transparent"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.sectionList}>
          {todayNotifications.map((item) => (
            <NotificationCard key={item.id} item={item} onPress={() =>
                router.push({
                  pathname: "/feedback",
                  params: {
                    tab: "my-posts",
                  },
                })
              }
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Yesterday</Text>
        <View style={styles.sectionList}>
          {yesterdayNotifications.map((item) => (
            <NotificationCard key={item.id} item={item} onPress={() =>
              router.push({
                pathname: "/feedback",
                params: {
                  tab: "my-posts",
                },
              })
            } />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Earlier</Text>
        <View style={styles.sectionList}>
          {earlierNotifications.map((item) => (
            <NotificationCard key={item.id} item={item} onPress={() =>
              router.push({
                pathname: "/feedback",
                params: {
                  tab: "my-posts",
                },
              })
            } />
          ))}
        </View>
      </ScrollView>
      <View style={styles.navWrap}>
        <NavBar />
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.senary[300],
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
  },
  content: {
    paddingHorizontal:20,
    paddingBottom: 120,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  sectionList: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  cardUser: {
    fontFamily: "AlbertSans-Bold",
  },
  cardTitle: {
    fontFamily: "AlbertSans-Bold",
  },
  cardTime: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.neutral[400],
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error[500],
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
});

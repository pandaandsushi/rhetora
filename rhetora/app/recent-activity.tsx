import { ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getEvaluationRouteByMode } from "./utils/get-evaluation-route";
import TopHeader from "../components/top-header";
import NavBar from "../components/nav-bar";
import RecentActivityCard from "../components/recent-activity-card";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-motif.png");

const recentActivityData = {
  today: [
    {
      id: "today-1",
      title: "Chapter 1-2",
      subtitle: "Story Mode",
      timeLabel: "Today 12:16",
    },
    {
      id: "today-2",
      title: "Product Idea Pitch",
      subtitle: "The Pitch Lab",
      timeLabel: "Today 12:10",
    },
  ],
  yesterday: [
    {
      id: "yesterday-1",
      title: "Filler Word Practice",
      subtitle: "Filler-Free",
      timeLabel: "Yesterday 12:10",
    },
    {
      id: "yesterday-2",
      title: "Fantasy Story",
      subtitle: "Storytelling Practice",
      timeLabel: "Yesterday 12:10",
    },
  ],
  earlier: [
    {
      id: "earlier-1",
      title: "Podium Speech",
      subtitle: "VR Mode",
      timeLabel: "Last Wednesday 12:10",
    },
    {
      id: "earlier-2",
      title: "Chapter 1-1",
      subtitle: "Story Mode",
      timeLabel: "Last Tuesday 12:10",
    },
    {
      id: "earlier-3",
      title: "Personal Pitch",
      subtitle: "The Pitch Lab",
      timeLabel: "Last Monday 12:10",
    },
  ],
};

export default function RecentActivity() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Recent Activity" variant="transparent" onBack={() => router.back()} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.sectionList}>
          {recentActivityData.today.map((item) => (
            <RecentActivityCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              timeLabel={item.timeLabel}
              onPress={() => router.push(getEvaluationRouteByMode(item.subtitle) as any)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Yesterday</Text>
        <View style={styles.sectionList}>
          {recentActivityData.yesterday.map((item) => (
            <RecentActivityCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              timeLabel={item.timeLabel}
              onPress={() => router.push(getEvaluationRouteByMode(item.subtitle) as any)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Earlier</Text>
        <View style={styles.sectionList}>
          {recentActivityData.earlier.map((item) => (
            <RecentActivityCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              timeLabel={item.timeLabel}
              onPress={() => router.push(getEvaluationRouteByMode(item.subtitle) as any)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.navWrap}>
        <NavBar activeKey="progress" />
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 130,
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
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
});

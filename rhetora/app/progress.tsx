import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Line, Path, Polygon } from "react-native-svg";

import NavBar from "../components/nav-bar";
import RecentActivityCard from "../components/recent-activity-card";
import { Colors } from "../constants/colors";
import { avatarList } from "../constants/avatars";
import { getMockUserData, subscribeToMockUser } from "../data/mock-user";
import { useRouter } from "expo-router";

const bgImage = require("../assets/images/bg-motif.png");
const coinImage = require("../assets/images/shop/coin.png");
const micImage = require("../assets/images/dashboard/db-microphone.png");
const alarmImage = require("../assets/images/dashboard/db-alarm.png");

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = Math.min(screenWidth - 80, 320);

const dashboardData = {
  overview: {
    practiceSessions: 3,
    timePracticeMinutes: 24,
  },
  skillMap: {
    labels: [
      "Filler Words",
      "Structure",
      "Critical\nThinking",
      "Confidence",
      "Conciseness",
      "Fluency",
    ],
    values: [0.6, 0.75, 0.7, 0.8, 0.45, 0.6],
  },
  timePractice: {
    data: [6, 14, 12, 8, 11, 7, 13],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  recentActivities: [
    {
      id: "recent-1",
      title: "Chapter 1-2",
      subtitle: "Story Mode",
      timeLabel: "Today 12:16",
    },
    {
      id: "recent-2",
      title: "Chapter 1-1",
      subtitle: "Story Mode",
      timeLabel: "Today 12:10",
    },
    {
      id: "recent-3",
      title: "Impromptu Sprint",
      subtitle: "Casual Mode",
      timeLabel: "Yesterday 12:10",
    },
  ],
};

const buildRadarPoints = (size: number, values: number[]) => {
  const center = size / 2;
  const radius = size / 2 - 12;
  const step = (Math.PI * 2) / values.length;

  return values.map((value, index) => {
    const angle = -Math.PI / 2 + index * step;
    const pointRadius = radius * value;
    const x = center + Math.cos(angle) * pointRadius;
    const y = center + Math.sin(angle) * pointRadius;
    return `${x},${y}`;
  });
};

const buildLinePath = (width: number, height: number, values: number[]) => {
  const padding = 16;
  const maxValue = Math.max(...values, 1);
  const xStep = (width - padding * 2) / (values.length - 1);
  const yScale = (height - padding * 2) / maxValue;

  return values
    .map((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - value * yScale;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
};

const buildAreaPath = (width: number, height: number, values: number[]) => {
  const padding = 16;
  const maxValue = Math.max(...values, 1);
  const xStep = (width - padding * 2) / (values.length - 1);
  const yScale = (height - padding * 2) / maxValue;
  const topPoints = values.map((value, index) => {
    const x = padding + index * xStep;
    const y = height - padding - value * yScale;
    return { x, y };
  });

  const path = topPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const last = topPoints[topPoints.length - 1];
  const first = topPoints[0];

  return `${path} L${last.x},${height - padding} L${first.x},${height - padding} Z`;
};

export default function Progress() {
    const router = useRouter();
  const [userData, setUserData] = useState(getMockUserData());

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  const equippedAvatar =
    avatarList.find((item) => item.id === userData.equippedAvatarId) ?? avatarList[0];

  const radarPoints = useMemo(
    () => buildRadarPoints(chartWidth, dashboardData.skillMap.values),
    [],
  );
  const linePath = useMemo(
    () => buildLinePath(chartWidth, 170, dashboardData.timePractice.data),
    [],
  );
  const areaPath = useMemo(
    () => buildAreaPath(chartWidth, 170, dashboardData.timePractice.data),
    [],
  );

  return (
    <View style={styles.screen}>
      <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <View style={styles.profileRow}>
                <Image source={equippedAvatar?.image} style={styles.avatar} />
                <View>
                  <Text style={styles.greeting}>Good Morning!</Text>
                  <Text style={styles.name}>{userData.profile.fullName}</Text>
                </View>
              </View>

              <View style={styles.headerActions}>
                <View style={styles.coinPill}>
                  <Image source={coinImage} style={styles.coinIcon} />
                  <Text style={styles.coinText}>{userData.coins}</Text>
                </View>
                <Pressable style={styles.notificationButton} onPress={() => router.push("/notifications")}>
                  <Ionicons name="notifications" size={24} color={Colors.octonary.DEFAULT} />
                </Pressable>
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>This Week Overview</Text>
            </View>

            <View style={styles.overviewRow}>
              <View style={[styles.overviewCard, styles.overviewCardWarm]}>
                <View style={styles.overviewTextWrap}>
                  <Text style={styles.overviewValue}>
                    {dashboardData.overview.practiceSessions}
                  </Text>
                  <Text style={styles.overviewLabel}>Practice Session</Text>
                </View>
                <Image source={micImage} style={styles.overviewImage} />
              </View>

              <View style={[styles.overviewCard, styles.overviewCardSunny]}>
                <View style={styles.overviewTextWrap}>
                  <Text style={styles.overviewValue}>
                    {dashboardData.overview.timePracticeMinutes} min(s)
                  </Text>
                  <Text style={styles.overviewLabel}>Time Practice</Text>
                </View>
                <Image source={alarmImage} style={styles.overviewImage} />
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Skill Map</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.octonary.DEFAULT} />
            </View>

            <View style={styles.chartCard}>
              <View style={styles.radarWrap}>
                <Svg width={chartWidth} height={chartWidth}>
                  {[0.2, 0.4, 0.6, 0.8, 1].map((fraction) => (
                    <Circle
                      key={`ring-${fraction}`}
                      cx={chartWidth / 2}
                      cy={chartWidth / 2}
                      r={(chartWidth / 2 - 12) * fraction}
                      stroke={Colors.neutral[200]}
                      strokeWidth={1}
                      fill="none"
                    />
                  ))}
                  {radarPoints.map((_, index) => {
                    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarPoints.length;
                    const x = chartWidth / 2 + Math.cos(angle) * (chartWidth / 2 - 12);
                    const y = chartWidth / 2 + Math.sin(angle) * (chartWidth / 2 - 12);
                    return (
                      <Line
                        key={`axis-${index}`}
                        x1={chartWidth / 2}
                        y1={chartWidth / 2}
                        x2={x}
                        y2={y}
                        stroke={Colors.neutral[200]}
                        strokeWidth={1}
                      />
                    );
                  })}
                  <Polygon
                    points={radarPoints.join(" ")}
                    fill="rgba(88, 130, 219, 0.28)"
                    stroke={Colors.blue[400]}
                    strokeWidth={2}
                  />
                  {radarPoints.map((point, index) => {
                    const [x, y] = point.split(",").map(Number);
                    return (
                      <Circle
                        key={`dot-${index}`}
                        cx={x}
                        cy={y}
                        r={3}
                        fill={Colors.turquoise[400]}
                      />
                    );
                  })}
                </Svg>

                {dashboardData.skillMap.labels.map((label, index) => (
                  <Text key={`label-${label}`} style={[styles.radarLabel, styles[`radarLabel${index}`]]}>
                    {label}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Time Practice</Text>
              <Pressable onPress={() => router.push("/time-practice")}>
                <Ionicons name="chevron-forward" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.minutesLabel}>minutes</Text>
              <Svg width={chartWidth} height={170}>
                {[40, 80, 120].map((y) => (
                  <Line
                    key={`grid-${y}`}
                    x1={12}
                    y1={y}
                    x2={chartWidth - 12}
                    y2={y}
                    stroke={Colors.neutral[200]}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                ))}
                <Path d={areaPath} fill="rgba(231, 116, 116, 0.22)" />
                <Path d={linePath} stroke={Colors.senary[300]} strokeWidth={2} fill="none" />
                {dashboardData.timePractice.data.map((value, index) => {
                  const padding = 16;
                  const maxValue = Math.max(...dashboardData.timePractice.data, 1);
                  const xStep =
                    (chartWidth - padding * 2) /
                    (dashboardData.timePractice.data.length - 1);
                  const yScale = (170 - padding * 2) / maxValue;
                  const x = padding + index * xStep;
                  const y = 170 - padding - value * yScale;
                  return (
                    <Circle key={`dot-${index}`} cx={x} cy={y} r={3} fill={Colors.senary[300]} />
                  );
                })}
              </Svg>
              <View style={styles.dayRow}>
                {dashboardData.timePractice.labels.map((label) => (
                  <Text key={label} style={styles.dayLabel}>
                    {label}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Pressable onPress={() => router.push("/recent-activity")}> 
                <Ionicons name="chevron-forward" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
            </View>

            <View style={styles.activityList}>
              {dashboardData.recentActivities.map((item) => (
                <RecentActivityCard
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  timeLabel={item.timeLabel}
                />
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="progress" />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 130,
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  greeting: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  name: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.shade[200],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
  },
  coinIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  coinText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  notificationButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  overviewRow: {
    flexDirection: "row",
    gap: 14,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    padding: 16,
    overflow: "hidden",
    minHeight: 90,
  },
  overviewCardWarm: {
    backgroundColor: "#FFF1F1",
  },
  overviewCardSunny: {
    backgroundColor: "#FFF6D6",
  },
  overviewTextWrap: {
    gap: 6,
  },
  overviewValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  overviewLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  overviewImage: {
    position: "absolute",
    right: 10,
    bottom: 8,
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    padding: 16,
    alignItems: "center",
  },
  radarWrap: {
    width: chartWidth,
    height: chartWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  radarLabel: {
    position: "absolute",
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  radarLabel0: {
    top: -6,
    left: chartWidth * 0.2,
  },
  radarLabel1: {
    top: 12,
    right: 0,
  },
  radarLabel2: {
    top: chartWidth * 0.38,
    right: -12,
  },
  radarLabel3: {
    bottom: 6,
    right: chartWidth * 0.1,
  },
  radarLabel4: {
    bottom: -4,
    left: chartWidth * 0.18,
  },
  radarLabel5: {
    top: chartWidth * 0.4,
    left: -12,
  },
  minutesLabel: {
    alignSelf: "flex-start",
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.senary[300],
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 6,
    marginTop: 8,
  },
  dayLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
  },
  activityList: {
    gap: 12,
    paddingBottom: 30,
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
});

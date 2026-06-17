import { useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Svg, { Circle, Line, Path } from "react-native-svg";

import TopHeader from "../components/top-header";
import NavBar from "../components/nav-bar";
import { Colors } from "../constants/colors";
import {
  periodTabs,
  skillProgressData,
  skillTabs,
  type PeriodKey,
  type SkillKey,
  type SkillProgressRange,
} from "../constants/skill-progress";
const bgImage = require("../assets/images/bg-motif.png");

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = Math.min(screenWidth - 80, 320);

const buildLinePath = (width: number, height: number, values: number[]) => {
  const padding = 16;
  const maxValue = Math.max(...values, 1);
  const xStep = (width - padding * 2) / Math.max(values.length - 1, 1);
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
  const xStep = (width - padding * 2) / Math.max(values.length - 1, 1);
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

export default function SkillProgress() {
  const router = useRouter();
  const [activeSkill, setActiveSkill] = useState<SkillKey>("fillerWords");
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("daily");
  const [pickerOpen, setPickerOpen] = useState(false);

  const [selectedRangeIds, setSelectedRangeIds] = useState<Record<PeriodKey, string>>({
    daily: "",
    weekly: "",
    monthly: "",
    yearly: "",
  });

  const rangesByPeriod = useMemo(() => {
    const data = skillProgressData[activeSkill];
    return {
      daily:   data.dailyRanges   ?? [],
      weekly:  data.weeklyRanges  ?? [],
      monthly: data.monthlyRanges ?? [],
      yearly:  data.yearlyRanges  ?? [],
    };
  }, [activeSkill]);

  const activeRanges = rangesByPeriod[activePeriod];
  const activeRange =
    activeRanges.find((r) => r.id === selectedRangeIds[activePeriod]) ??
    activeRanges[0];

  const activeData = activeRange ?? skillProgressData[activeSkill][activePeriod];
  const chartValues = activeData.points.map((point) => point.score);
  const chartLabels = activeData.points.map((point) => point.label);

  const linePath = useMemo(
    () => buildLinePath(chartWidth, 170, chartValues),
    [chartValues]
  );
  const areaPath = useMemo(
    () => buildAreaPath(chartWidth, 170, chartValues),
    [chartValues]
  );

  const handleSelectRange = (rangeId: string) => {
    setSelectedRangeIds((prev) => ({ ...prev, [activePeriod]: rangeId }));
  };

  const handleSelectSkill = (skill: SkillKey) => {
    setActiveSkill(skill);
    setSelectedRangeIds({ daily: "", weekly: "", monthly: "", yearly: "" });
  };

  const renderRangeList = (ranges: SkillProgressRange[]) => (
    <View style={styles.rangeList}>
      {ranges.map((range) => {
        const isSelected = range.id === selectedRangeIds[activePeriod];
        return (
          <Pressable
            key={range.id}
            style={[styles.rangeButton, isSelected && styles.rangeButtonActive]}
            onPress={() => handleSelectRange(range.id)}
          >
            <Text style={[styles.rangeButtonText, isSelected && styles.rangeButtonTextActive]}>
              {range.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderRangeGrid = (ranges: SkillProgressRange[], columns: number) => (
    <View style={styles.rangeGrid}>
      {ranges.map((range) => {
        const isSelected = range.id === selectedRangeIds[activePeriod];
        return (
          <Pressable
            key={range.id}
            style={[
              styles.rangeTile,
              { width: `${100 / columns - 4}%` },
              isSelected && styles.rangeTileActive,
            ]}
            onPress={() => handleSelectRange(range.id)}
          >
            <Text style={[styles.rangeTileText, isSelected && styles.rangeTileTextActive]}>
              {range.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader
          title="Skill Progress"
          variant="transparent"
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skillTabs}
        >
          {skillTabs.map((skill) => {
            const isActive = skill.key === activeSkill;
            return (
              <Pressable
                key={skill.key}
                style={[styles.skillPill, isActive && styles.skillPillActive]}
                onPress={() => handleSelectSkill(skill.key)}
              >
                <Text style={[styles.skillPillText, isActive && styles.skillPillTextActive]}>
                  {skill.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.tabRow}>
          {periodTabs.map((tab) => {
            const isActive = tab.key === activePeriod;
            return (
              <Pressable key={tab.key} onPress={() => setActivePeriod(tab.key)}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.tabUnderline} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.rangeHeader}>
            <Text style={styles.rangeLabel}>{activeData.label}</Text>
            <Pressable onPress={() => setPickerOpen(true)}>
              <Ionicons name="calendar" size={20} color={Colors.octonary.DEFAULT} />
            </Pressable>
          </View>

          <Text style={styles.minutesLabel}>score</Text>

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
            {chartValues.map((value, index) => {
              const padding = 16;
              const maxValue = Math.max(...chartValues, 1);
              const xStep =
                (chartWidth - padding * 2) / Math.max(chartValues.length - 1, 1);
              const yScale = (170 - padding * 2) / maxValue;
              const x = padding + index * xStep;
              const y = 170 - padding - value * yScale;
              return (
                <Circle key={`dot-${index}`} cx={x} cy={y} r={3} fill={Colors.senary[300]} />
              );
            })}
          </Svg>

          <View style={styles.dayRow}>
            {chartLabels.map((label) => (
              <Text key={label} style={styles.dayLabel}>
                {label}
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.overviewTitle}>OVERVIEW</Text>
        <View style={styles.overviewList}>
          {activeData.overview.map((line) => (
            <Text key={line} style={styles.overviewText}>
              - {line}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navWrap}>
        <NavBar activeKey="progress" />
      </View>

      <Modal transparent visible={pickerOpen} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {activePeriod === "daily" && "Select week"}
                {activePeriod === "weekly" && "Select month"}
                {activePeriod === "monthly" && "Select year"}
                {activePeriod === "yearly" && "View years"}
              </Text>
              <View style={styles.modalArrows}>
                <Ionicons name="chevron-back" size={18} color={Colors.octonary.DEFAULT} />
                <Ionicons name="chevron-forward" size={18} color={Colors.octonary.DEFAULT} />
              </View>
            </View>

            {activePeriod === "daily"   && renderRangeList(rangesByPeriod.daily)}
            {activePeriod === "weekly"  && renderRangeGrid(rangesByPeriod.weekly, 2)}
            {activePeriod === "monthly" && renderRangeGrid(rangesByPeriod.monthly, 2)}
            {activePeriod === "yearly"  && renderRangeList(rangesByPeriod.yearly)}

            <Pressable style={styles.modalConfirm} onPress={() => setPickerOpen(false)}>
              <Text style={styles.modalConfirmText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    gap: 18,
  },
  skillTabs: {
    gap: 10,
    paddingRight: 20,
  },
  skillPill: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.senary[300],
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.shade[200],
  },
  skillPillActive: {
    backgroundColor: Colors.senary[300],
  },
  skillPillText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 13,
    color: Colors.senary[300],
  },
  skillPillTextActive: {
    color: Colors.shade[200],
  },
  tabRow: {
    flexDirection: "row",
    gap: 22,
    marginBottom: 6,
  },
  tabText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  tabTextActive: {
    color: Colors.senary[300],
  },
  tabUnderline: {
    height: 2,
    backgroundColor: Colors.senary[300],
    marginTop: 4,
  },
  chartCard: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    padding: 16,
    gap: 8,
  },
  rangeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rangeLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  minutesLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.senary[300],
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  dayLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 11,
    color: Colors.neutral[500],
  },
  overviewTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    marginTop: 8,
  },
  overviewList: {
    gap: 8,
  },
  overviewText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  modalArrows: {
    flexDirection: "row",
    gap: 10,
  },
  rangeList: {
    gap: 12,
  },
  rangeButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rangeButtonActive: {
    borderColor: Colors.senary[300],
    backgroundColor: Colors.senary[100],
  },
  rangeButtonText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  rangeButtonTextActive: {
    color: Colors.octonary.DEFAULT,
  },
  rangeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  rangeTile: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rangeTileActive: {
    borderColor: Colors.senary[300],
    backgroundColor: Colors.senary[300],
  },
  rangeTileText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  rangeTileTextActive: {
    color: Colors.shade[200],
  },
  modalConfirm: {
    alignSelf: "center",
    paddingVertical: 6,
  },
  modalConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
    textDecorationLine: "underline",
  },
});
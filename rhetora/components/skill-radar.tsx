import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

import { Colors } from "../constants/colors";

type SkillRadarProps = {
  labels: string[];
  values: number[];
  size?: number;
  strokeColor?: string;
  fillColor?: string;
};

const buildRadarPoints = (size: number, values: number[]) => {
  const center = size / 2;
  const radius = size / 2 - 12;
  const step = (Math.PI * 2) / values.length;

  return values.map((value, index) => {
    const angle = -Math.PI / 2 + index * step;
    const pointRadius = radius * Math.max(Math.min(value, 1), 0);
    const x = center + Math.cos(angle) * pointRadius;
    const y = center + Math.sin(angle) * pointRadius;
    return { x, y };
  });
};

const buildLabelPositions = (size: number, count: number) => {
  const center = size / 2;
  const radius = size / 2 - 2;
  const step = (Math.PI * 2) / count;

  return Array.from({ length: count }).map((_, index) => {
    const angle = -Math.PI / 2 + index * step;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y };
  });
};

export default function SkillRadar({
  labels,
  values,
  size = 220,
  strokeColor = Colors.blue[400],
  fillColor = "rgba(88, 130, 219, 0.28)",
}: SkillRadarProps) {
  const normalized = useMemo(() => {
    if (!values.length) {
      return [];
    }
    return values.map((value) => Math.max(Math.min(value / 100, 1), 0));
  }, [values]);

  const radarPoints = useMemo(
    () => buildRadarPoints(size, normalized),
    [size, normalized]
  );

  const labelPositions = useMemo(
    () => buildLabelPositions(size, labels.length),
    [size, labels.length]
  );

  const polygonPoints = useMemo(
    () => radarPoints.map((point) => `${point.x},${point.y}`).join(" "),
    [radarPoints]
  );

  return (
    <View style={[styles.radarWrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((fraction) => (
          <Circle
            key={`ring-${fraction}`}
            cx={size / 2}
            cy={size / 2}
            r={(size / 2 - 12) * fraction}
            stroke={Colors.neutral[200]}
            strokeWidth={1}
            fill="none"
          />
        ))}
        {labelPositions.map((point, index) => (
          <Line
            key={`axis-${index}`}
            x1={size / 2}
            y1={size / 2}
            x2={point.x}
            y2={point.y}
            stroke={Colors.neutral[200]}
            strokeWidth={1}
          />
        ))}
        {polygonPoints ? (
          <Polygon points={polygonPoints} fill={fillColor} stroke={strokeColor} strokeWidth={2} />
        ) : null}
        {radarPoints.map((point, index) => (
          <Circle key={`dot-${index}`} cx={point.x} cy={point.y} r={3} fill={Colors.turquoise[400]} />
        ))}
      </Svg>

      {labelPositions.map((point, index) => {
        const label = labels[index] ?? "";
        return (
          <Text
            key={`label-${label}-${index}`}
            style={[
              styles.radarLabel,
              {
                left: point.x - 28,
                top: point.y - 10,
                width: 70,
              },
            ]}
          >
            {label}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  radarWrap: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  radarLabel: {
    position: "absolute",
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
});

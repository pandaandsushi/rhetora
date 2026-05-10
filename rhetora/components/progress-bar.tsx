import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { Colors } from "../constants/colors";

type ProgressBarProps = {
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function ProgressBar({
  progress,
  height = 10,
  trackColor = Colors.shade[200],
  fillColor = Colors.success[400],
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: fillColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
  },
  fill: {
    height: "100%",
  },
});
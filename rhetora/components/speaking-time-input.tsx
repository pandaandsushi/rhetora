import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

type SpeakingTimeValue = {
  hours: string;
  minutes: string;
  seconds: string;
};

type SpeakingTimeInputProps = {
  value: SpeakingTimeValue;
  onChange: (value: SpeakingTimeValue) => void;
  defaultValue?: SpeakingTimeValue;
  onDefault?: (value: SpeakingTimeValue) => void;
  label?: string;
};

const defaultTimeValue: SpeakingTimeValue = { hours: "00", minutes: "10", seconds: "00" };

const normalizeTimePart = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 2);
  if (!digits) {
    return "00";
  }
  return digits.padStart(2, "0");
};

export const parseTimeToSeconds = (value: SpeakingTimeValue) => {
  const h = Number(value.hours) || 0;
  const m = Number(value.minutes) || 0;
  const s = Number(value.seconds) || 0;
  return h * 3600 + m * 60 + s;
};

export const formatDurationLabel = (value: SpeakingTimeValue) => {
  const totalSeconds = parseTimeToSeconds(value);
  if (totalSeconds <= 0) {
    return "00:00";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function SpeakingTimeInput({
  value,
  onChange,
  defaultValue = defaultTimeValue,
  onDefault,
  label = "Speaking Time",
}: SpeakingTimeInputProps) {
  const handleDefault = () => {
    onChange(defaultValue);
    onDefault?.(defaultValue);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.timerRow}>
        <Text style={styles.timerLabel}>{label}</Text>
        <Pressable style={styles.timerDefault} onPress={handleDefault}>
          <Ionicons name="refresh" size={16} color={Colors.octonary.DEFAULT} />
          <Text style={styles.timerDefaultText}>Default</Text>
        </Pressable>
      </View>

      <View style={styles.timeInputs}>
        <View style={styles.timeBoxWrap}>
          <View style={styles.timeBox}>
            <TextInput
              style={styles.timeValue}
              value={value.hours}
              onChangeText={(text) =>
                onChange({
                  ...value,
                  hours: text.replace(/\D/g, "").slice(0, 2),
                })
              }
              onBlur={() =>
                    onChange({
                    ...value,
                    hours: normalizeTimePart(value.hours),
                    })
                }
              keyboardType="numeric"
              maxLength={2}
              selectTextOnFocus
            />
          </View>
          <Text style={styles.timeDivider}>:</Text>
        </View>

        <View style={styles.timeBoxWrap}>
          <View style={styles.timeBox}>
            <TextInput
              style={styles.timeValue}
              value={value.minutes}
              onChangeText={(text) =>
                onChange({
                  ...value,
                  minutes: text.replace(/\D/g, "").slice(0, 2),
                })
              }
              onBlur={() =>
                onChange({ ...value, minutes: normalizeTimePart(value.minutes) })
            }
              keyboardType="numeric"
              maxLength={2}
              selectTextOnFocus
            />
          </View>
          <Text style={styles.timeDivider}>:</Text>
        </View>

        <View style={styles.timeBoxWrap}>
          <View style={styles.timeBox}>
            <TextInput
              style={styles.timeValue}
              value={value.seconds}
              onChangeText={(text) =>
                onChange({
                  ...value,
                  seconds: text.replace(/\D/g, "").slice(0, 2),
                })
              }
              onBlur={() =>
                onChange({ ...value, seconds: normalizeTimePart(value.seconds) })
            }
              keyboardType="numeric"
              maxLength={2}
              selectTextOnFocus
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timerLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  timerDefault: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerDefaultText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeBoxWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeBox: {
    width: 64,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
    textAlign: "center",
    width: "100%",
  },
  timeDivider: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
  },
});

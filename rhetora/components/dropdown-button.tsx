import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

type DropdownButtonProps = {
  label: string;
  placeholder?: string;
  open?: boolean;
  onPress: () => void;
};

export default function DropdownButton({
  label,
  placeholder = "Select",
  open = false,
  onPress,
}: DropdownButtonProps) {
  const isPlaceholder = label === placeholder;

  return (
    <Pressable style={styles.selectField} onPress={onPress}>
      <Text style={[styles.selectValue, isPlaceholder && styles.selectPlaceholder]}>
        {label}
      </Text>
      <Ionicons
        name={open ? "chevron-up" : "chevron-down"}
        size={18}
        color={Colors.neutral[400]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selectField: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectValue: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  selectPlaceholder: {
    color: Colors.neutral[400],
  },
});
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { Colors } from "../constants/colors";

type DropdownSelectProps = {
  value?: string;
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
};

export default function DropdownSelect({
  value,
  options,
  placeholder = "Select",
  onSelect,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const displayValue = value ?? placeholder;
  const isPlaceholder = value == null;

  return (
    <View>
      <Pressable style={styles.selectField} onPress={() => setOpen((prev) => !prev)}>
        <Text style={[styles.selectValue, isPlaceholder && styles.selectPlaceholder]}>
          {displayValue}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.neutral[400]}
        />
      </Pressable>

      {open && (
        <View style={styles.selectList}>
          {options.map((option, index) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                style={[
                  styles.selectItem,
                  selected && styles.selectItemActive,
                  index === options.length - 1 && styles.selectItemLast,
                ]}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.selectItemText,
                    selected && styles.selectItemTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
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
  selectList: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.shade[200],
    marginTop: 10,
    overflow: "hidden",
  },
  selectItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  selectItemLast: {
    borderBottomWidth: 0,
  },
  selectItemActive: {
    backgroundColor: Colors.warning[400],
  },
  selectItemText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.senary[300],
  },
  selectItemTextActive: {
    color: Colors.shade[200],
  },
});

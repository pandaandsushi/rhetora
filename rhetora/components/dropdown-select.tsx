import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import DropdownButton from "./dropdown-button";
import { Colors } from "../constants/colors";

type DropdownSelectProps = {
  value?: string;
  options: readonly string[];
  placeholder?: string;
  onSelect: (value: string) => void;
  descriptions?: Partial<Record<string, string>>;
  showSelectedDescription?: boolean;
};

export default function DropdownSelect({
  value,
  options,
  placeholder = "Select",
  onSelect,
  descriptions,
  showSelectedDescription = false,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const displayValue = value ?? placeholder;
  const selectedDescription = value ? descriptions?.[value] : undefined;

  return (
    <View>
      <DropdownButton
        label={displayValue}
        placeholder={placeholder}
        open={open}
        onPress={() => setOpen((prev) => !prev)}
      />

      {showSelectedDescription && selectedDescription ? (
        <Text style={styles.selectedDescription}>{selectedDescription}</Text>
      ) : null}

      {open && (
        <View style={styles.selectList}>
          {options.map((option, index) => {
            const selected = option === value;
            const description = descriptions?.[option];

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

                {description ? (
                  <Text
                    style={[
                      styles.selectItemDescription,
                      selected && styles.selectItemDescriptionActive,
                    ]}
                  >
                    {description}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 4,
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
  selectItemDescription: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    lineHeight: 16,
  },
  selectItemDescriptionActive: {
    color: Colors.shade[200],
  },
  selectedDescription: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
    lineHeight: 18,
    marginTop: 8,
  },
});

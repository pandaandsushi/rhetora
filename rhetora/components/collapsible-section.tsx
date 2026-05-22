import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
};

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  containerStyle,
  headerStyle,
  contentStyle,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        style={[styles.header, headerStyle]}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.octonary.DEFAULT}
        />
      </Pressable>

      {isOpen && <View style={[styles.content, contentStyle]}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
  },
  header: {
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
});
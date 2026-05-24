import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import { Colors } from "../constants/colors";

type TopHeaderProps = {
  title: string;
  description?: string;
  variant?: "solid" | "transparent";
  onBack?: () => void;
  rightElement?: React.ReactNode;
};

export default function TopHeader({
  title,
  description,
  variant = "solid",
  onBack,
  rightElement,
}: TopHeaderProps) {
  const isSolid = variant === "solid";

  return (
    <View style={[styles.header, isSolid && styles.headerSolid]}>
      <View style={styles.leftGroup}>
        <Pressable
          onPress={onBack}
          style={[
            styles.backButton,
            isSolid ? styles.backButtonSolid : styles.backButtonTransparent,
          ]}
          hitSlop={10}
          disabled={!onBack}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.shade[200]} />
        </Pressable>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.headerTitle,
              isSolid ? styles.textSolid : styles.textTransparent,
            ]}
          >
            {title}
          </Text>

          {description && (
            <Text
              style={[
                styles.headerDescription,
                isSolid ? styles.textSolid : styles.textTransparent,
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>

      {rightElement && (
        <View style={styles.rightElementContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 30,
    gap: 16,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  rightElementContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  headerSolid: {
    backgroundColor: Colors.senary[300],
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonSolid: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  backButtonTransparent: {
    backgroundColor: Colors.senary[300],
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
  },
  headerDescription: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    marginTop: 2,
  },
  textSolid: {
    color: Colors.shade[200],
  },
  textTransparent: {
    color: Colors.octonary.DEFAULT,
  },
});
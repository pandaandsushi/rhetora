import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";

type TopHeaderProps = {
  title: string;
  description?: string;
  variant?: "solid" | "transparent";
  onBack?: () => void;
};

export default function TopHeader({
  title,
  description,
  variant = "solid",
  onBack,
}: TopHeaderProps) {
  const isSolid = variant === "solid";

  return (
    <View style={[styles.header, isSolid && styles.headerSolid]}>
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
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 30,
    gap: 16,
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
  textContainer: {
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
  },
  headerDescription: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 16,
    marginTop: 2,
  },
  textSolid: {
    color: Colors.shade[200],
  },
  textTransparent: {
    color: Colors.octonary.DEFAULT,
  },
});
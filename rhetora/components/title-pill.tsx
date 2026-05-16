import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import type { TitleItem } from "../constants/titles";

type TitlePillProps = {
  title: TitleItem;
  size?: "sm" | "md";
};

export default function TitlePill({ title, size = "sm" }: TitlePillProps) {
  const sizeStyles = size === "md" ? styles.md : styles.sm;

  return (
    <View style={[styles.wrapper, sizeStyles.wrapper]}>
      <View
        style={[
          styles.pill,
          sizeStyles.pill,
          {
            borderColor: title.borderColor,
          },
        ]}
      >
        <LinearGradient
          colors={title.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles.gradient]}
        >
          <Text style={[styles.label, sizeStyles.label, { color: title.textColor }]}>
            {title.label}
          </Text>
        </LinearGradient>
      </View>
      <View style={[styles.iconWrap, sizeStyles.iconWrap]}>
        <Image source={title.illustration} style={[styles.icon, sizeStyles.icon]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
  },
  pill: {
    borderWidth: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    position: "absolute",
    left: -10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    resizeMode: "contain",
  },
  label: {
    fontFamily: "Quicksand-Bold",
  },
  sm: {
    wrapper: {
      height: 28,
      width: 168,
    },
    pill: {
      height: 28,
    },
    gradient: {
      height: 28,
      paddingLeft: 22,
      paddingRight: 18,
    },
    iconWrap: {
      width: 28,
      height: 28,
    },
    icon: {
      width: 26,
      height: 26,
    },
    label: {
      fontSize: 12,
    },
  },
  md: {
    wrapper: {
      height: 36,
      width: 190,
    },
    pill: {
      height: 36,
    },
    gradient: {
      height: 36,
      paddingLeft: 28,
      paddingRight: 22,
    },
    iconWrap: {
      width: 36,
      height: 36,
    },
    icon: {
      width: 32,
      height: 32,
    },
    label: {
      fontSize: 14,
    },
  },
});

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";

type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  message: string;
  visible?: boolean;
  variant?: ToastVariant;
};

const variantStyles: Record<ToastVariant, { background: string; icon: React.ComponentProps<typeof Ionicons>["name"] }>= {
  success: { background: "#2BB673", icon: "checkmark-circle" },
  error: { background: "#E05656", icon: "close-circle" },
  info: { background: "#3C7DD9", icon: "information-circle" },
};

export default function Toast({ message, visible = false, variant = "success" }: ToastProps) {
  if (!visible) {
    return null;
  }

  const config = variantStyles[variant];

  return (
    <View style={[styles.toast, { backgroundColor: config.background }]}
      pointerEvents="none"
    >
      <Ionicons name={config.icon} size={20} color={Colors.shade[200]} />
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
});

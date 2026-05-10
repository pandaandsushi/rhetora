import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { Colors } from "../constants/colors";

import { Ionicons } from "@expo/vector-icons";

const NAV_HEIGHT = 64;

export type NavItem = {
  key: string;
  href: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
};

const defaultItems: NavItem[] = [
  { key: "home", href: "/home", iconName: "home-outline" },
  { key: "feedback", href: "/feedback", iconName: "chatbubble-ellipses-outline" },
  { key: "practice", href: "/practice", iconName: "mic-outline" },
  { key: "progress", href: "/progress", iconName: "bar-chart-outline" },
  { key: "profile", href: "/profile", iconName: "person-outline" },
];

type NavBarProps = {
  items?: NavItem[];
  activeKey?: string;
};

export default function NavBar({ items = defaultItems, activeKey }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const resolvedActiveKey = useMemo(() => {
    if (activeKey) {
      return activeKey;
    }

    const match = items.find((item) => pathname.startsWith(item.href));
    return match?.key ?? items[0]?.key;
  }, [activeKey, items, pathname]);

  return (
    <View style={styles.wrapper}>
        <View style={styles.gradientBackground}>
            <Svg width="100%" height="100%">
            <Defs>
                <LinearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="rgba(255,255,255,0.3)" />
                    <Stop offset="1" stopColor="rgba(219,101,87,0.3)" />
                </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#navGradient)" />
            </Svg>
        </View>

        <View style={styles.pill}>
            {items.map((item) => {
                const isActive = item.key === resolvedActiveKey;

                return (
                    <Pressable
                    key={item.key}
                    onPress={() => router.push(item.href)}
                    style={styles.item}
                    hitSlop={10}
                    >
                    {isActive && <View style={styles.activeBubble} />}

                    <Ionicons
                      name={item.iconName}
                      size={26}
                      color={isActive ? Colors.octonary.DEFAULT : Colors.shade[200]}
                      style={styles.icon}
                    />
                    </Pressable>
                );
            })}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
  alignItems: "center",
  justifyContent: "center",
},

gradientBackground: {
  position: "absolute",
  width: "100%",
  height: NAV_HEIGHT + 20,
},

activeBubble: {
  position: "absolute",
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: Colors.shade[200],
  zIndex: 0,
},

item: {
  width: 48,
  height: 48,
  alignItems: "center",
  justifyContent: "center",
},

icon: {
  zIndex: 1,
},

pill: {
  height: NAV_HEIGHT,
  width: "92%",
  borderRadius: 30,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 18,

  backgroundColor: Colors.senary[300],
  borderWidth: 1,
  borderColor: "#D3C2F3",

  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
},

});
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
const bgImage = require("../assets/images/homepage/bg-home.png");
const coinImage = require("../assets/images/shop/coin.png");

const frequencyOptions = [
  {
    id: "low",
    label: "Low",
    description: "Occasional reminders, low frequency",
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Steady reminders to keep you on track",
  },
  {
    id: "intensive",
    label: "Intensive",
    description: "High frequency nudges and check-ins",
  },
];

export default function NotificationSettings() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [smartReminders, setSmartReminders] = useState(true);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [frequency, setFrequency] = useState(frequencyOptions[0]);
    const handleSave = () => {
      router.push({
        pathname: "/profile",
        params: {
          showToast: "true",
          toastMessage: "Notifications settings updated successfully",
          toastVariant: "success",
        },
      });
    };
  return (
    <View style={styles.screen}>
        <SafeAreaView style={styles.safeArea}>
          <TopHeader
            title="Notification Settings"
            variant="transparent"
            onBack={() => router.back()}
          />

          <View style={styles.content}>
            <View style={styles.row}> 
              <Text style={styles.rowLabel}>Enable Notifications</Text>
              <Switch
                value={enabled}
                onValueChange={(value) => {
                  setEnabled(value);
                  if (!value) {
                    setFrequencyOpen(false);
                  }
                }}
                trackColor={{ false: Colors.neutral[200], true: "#34C759" }}
                thumbColor={Colors.shade[200]}
              />
            </View>

            {enabled && (
              <>
                <View style={styles.row}> 
                  <Text style={styles.rowLabel}>Smart Reminders</Text>
                  <Switch
                    value={smartReminders}
                    onValueChange={setSmartReminders}
                    trackColor={{ false: Colors.neutral[200], true: "#34C759" }}
                    thumbColor={Colors.shade[200]}
                  />
                </View>
                <Text style={styles.helperText}>
                  Remind me based on my activity and progress
                </Text>

                <Text style={styles.sectionLabel}>Frequency</Text>
                <Pressable
                  style={styles.dropdown}
                  onPress={() => setFrequencyOpen((prev) => !prev)}
                >
                  <Text style={styles.dropdownText}>{frequency.label}</Text>
                  <Ionicons name="chevron-down" size={18} color={Colors.neutral[300]} />
                </Pressable>

                {frequencyOpen && (
                  <View style={styles.dropdownMenu}>
                    {frequencyOptions.map((option) => {
                      const isSelected = option.id === frequency.id;
                      return (
                        <Pressable
                          key={option.id}
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setFrequency(option);
                            setFrequencyOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemTitle,
                              isSelected && styles.dropdownItemTitleActive,
                            ]}
                          >
                            {option.label}
                          </Text>
                          <Text
                            style={[
                              styles.dropdownItemSubtitle,
                              isSelected && styles.dropdownItemSubtitleActive,
                            ]}
                          >
                            {option.description}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </>
            )}

            <View style={styles.actionsRow}>
              <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="profile" />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 140,
    },
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  coinIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  coinText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    },
  rowLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  helperText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    lineHeight: 24,
    marginTop: -10,
    marginBottom: 36,
    },
  sectionLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    marginBottom: 14,
    },
  dropdown: {
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.shade[200],
  },
  dropdownText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.neutral[300],
  },
  dropdownMenu: {
    height: 210,
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
    marginTop: 14,
    paddingVertical: 10,
    },
  dropdownItem: {
    marginHorizontal: 14,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
    },
  dropdownItemActive: {
    backgroundColor: "#F9A23B",
  },
  dropdownItemTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  dropdownItemTitleActive: {
    color: Colors.shade[200],
  },
  dropdownItemSubtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    color: Colors.octonary.DEFAULT,
  },
  dropdownItemSubtitleActive: {
    color: Colors.shade[200],
  },
  actionsRow: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 120,
    flexDirection: "row",
    gap: 16,
    },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.shade[200],
    borderWidth: 2,
    borderColor: Colors.senary[300],
  },
  saveButton: {
    backgroundColor: Colors.senary[300],
  },
  cancelText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.senary[300],
  },
  saveText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
  },
});

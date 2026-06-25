import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import DropdownSelect from "../components/dropdown-select";
import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
const frequencyOptions = ["Low", "Balanced", "Intensive"] as const;

type FrequencyOption = (typeof frequencyOptions)[number];

const frequencyDescriptions: Record<FrequencyOption, string> = {
  Low: "Occasional reminders, low frequency",
  Balanced: "Steady reminders to keep you on track",
  Intensive: "High frequency nudges and check-ins",
};

export default function NotificationSettings() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [smartReminders, setSmartReminders] = useState(true);
  const [frequency, setFrequency] = useState<FrequencyOption>("Low");

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
                onValueChange={setEnabled}
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

                <View style={styles.selectRow}>
                  <Text style={styles.selectLabel}>Frequency</Text>
                </View>
                <DropdownSelect
                  value={frequency}
                  options={frequencyOptions}
                  descriptions={frequencyDescriptions}
                  showSelectedDescription
                  onSelect={(value) => setFrequency(value as FrequencyOption)}
                />
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
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 140,
    },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
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
    marginBottom: 14,
    },
  selectRow: {
    marginTop: 4,
  },
  selectLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
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
    paddingBottom: 10,
  },
});

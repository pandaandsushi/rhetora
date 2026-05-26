import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
import { avatarList } from "../constants/avatars";
import { frameList } from "../constants/frames";
import {
  getMockUserData,
  subscribeToMockUser,
  updateMockUserData,
} from "../data/mock-user";

const bgImage = require("../assets/images/homepage/bg-home.png");
const coinImage = require("../assets/images/shop/coin.png");

export default function EditProfile() {
  const router = useRouter();
  const initialUser = getMockUserData();
  const [userData, setUserData] = useState(initialUser);
  const [fullName, setFullName] = useState(initialUser.profile.fullName);
  const [email, setEmail] = useState(initialUser.profile.email);
  const [password, setPassword] = useState(initialUser.profile.password);

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  const equippedAvatar =
    avatarList.find((item) => item.id === userData.equippedAvatarId) ?? avatarList[0];
  const equippedFrame =
    frameList.find((item) => item.id === userData.equippedFrameId) ?? frameList[0];

  return (
    <View style={styles.screen}>
        <SafeAreaView style={styles.safeArea}>
          <TopHeader
            title="Edit Profile"
            variant="transparent"
            onBack={() => router.back()}
            rightElement={
              <View style={styles.coinPill}>
                <Image source={coinImage} style={styles.coinIcon} />
                <Text style={styles.coinText}>{userData.coins}</Text>
              </View>
            }
          />

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarWrap}>
              <Image source={equippedAvatar?.image} style={styles.avatarImage} />
              {equippedFrame && (
                <Image source={equippedFrame.image} style={styles.avatarFrame} />
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor={Colors.neutral[300]}
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="john@rhetora.com"
                placeholderTextColor={Colors.neutral[300]}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.neutral[300]}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => {
                  updateMockUserData({
                    profile: {
                      fullName,
                      email,
                      password,
                    },
                  });
                  router.push({
                    pathname: "/profile",
                    params: {
                      showToast: "true",
                      toastMessage: "Profile updated successfully",
                      toastVariant: "success",
                    },
                  });
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 140,
    gap: 18,
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
  avatarWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarFrame: {
    position: "absolute",
    width: 190,
    height: 190,
    resizeMode: "contain",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "AlbertSans-Regular",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
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
    fontSize: 18,
    color: Colors.senary[300],
  },
  saveText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
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

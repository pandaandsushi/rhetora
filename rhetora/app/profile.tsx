import { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import ProfileMediaCard from "../components/profile-media-card";
import TitlePill from "../components/title-pill";
import Toast from "../components/toast";
import { Colors } from "../constants/colors";
import {
  badgeList,
  getSelectedBadgeIds,
  setSelectedBadgeIds,
  subscribeToBadgeSelection,
} from "../constants/badges";
import { avatarList } from "../constants/avatars";
import { frameList } from "../constants/frames";
import { titleList } from "../constants/titles";
import {
  getMockUserData,
  subscribeToMockUser,
  updateMockUserData,
} from "../data/mock-user";

const bgImage = require("../assets/images/homepage/bg-home.png");
const coinImage = require("../assets/images/shop/coin.png");
const logoutImage = require("../assets/images/auth/thinking.png");
const streakImage = require("../assets/images/homepage/il-streak.png");
const leaderboardImage = require("../assets/images/homepage/il-leaderboard.png");

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(getMockUserData());
  const [selectedBadgeIds, setSelectedBadgeIdsState] = useState(getSelectedBadgeIds());
  const [editVisible, setEditVisible] = useState(false);
  const [draftIds, setDraftIds] = useState<string[]>(getSelectedBadgeIds());
  const [titleEditVisible, setTitleEditVisible] = useState(false);
  const [titleSort, setTitleSort] = useState<"recent" | "obtained">("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [titleDetailId, setTitleDetailId] = useState<string | null>(null);
  const [avatarFrameVisible, setAvatarFrameVisible] = useState(false);
  const [avatarFrameTab, setAvatarFrameTab] = useState<"avatar" | "frame">("avatar");
  const [mediaDetail, setMediaDetail] = useState<{
    type: "avatar" | "frame";
    id: string;
  } | null>(null);
  const [logoutVisible, setLogoutVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToBadgeSelection(() => {
      setSelectedBadgeIdsState(getSelectedBadgeIds());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);
  
  const { showToast, toastMessage, toastVariant } = useLocalSearchParams();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  useEffect(() => {
    if (showToast === "true") {
      setToastText(typeof toastMessage === "string" ? toastMessage : "Updated successfully");
      setToastType(
        toastVariant === "error" || toastVariant === "info" || toastVariant === "success"
          ? toastVariant
          : "success"
      );
      setToastVisible(true);

      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const selectedBadges = useMemo(() => {
    return selectedBadgeIds
      .map((id) => badgeList.find((badge) => badge.id === id))
      .filter(Boolean);
  }, [selectedBadgeIds]);

  const titleMeta = useMemo(() => {
    return new Map<string, { obtained: boolean; obtainedAt?: number }>([
      [titleList[0]?.id ?? "", { obtained: true, obtainedAt: 8 }],
      [titleList[1]?.id ?? "", { obtained: true, obtainedAt: 7 }],
      [titleList[2]?.id ?? "", { obtained: true, obtainedAt: 6 }],
      [titleList[3]?.id ?? "", { obtained: true, obtainedAt: 5 }],
      [titleList[4]?.id ?? "", { obtained: true, obtainedAt: 4 }],
      [titleList[5]?.id ?? "", { obtained: true, obtainedAt: 3 }],
      [titleList[6]?.id ?? "", { obtained: false }],
      [titleList[7]?.id ?? "", { obtained: false }],
    ].filter(([id]) => id));
  }, []);

  const sortedTitles = useMemo(() => {
    const list = [...titleList];
    const getMeta = (id: string) => titleMeta.get(id) ?? { obtained: false };

    return list.sort((a, b) => {
      const metaA = getMeta(a.id);
      const metaB = getMeta(b.id);

      if (titleSort === "recent") {
        const dateA = metaA.obtainedAt ?? -1;
        const dateB = metaB.obtainedAt ?? -1;
        if (dateA !== dateB) {
          return dateB - dateA;
        }
      }

      if (titleSort === "obtained") {
        if (metaA.obtained !== metaB.obtained) {
          return metaA.obtained ? -1 : 1;
        }
      }

      if (metaA.obtained !== metaB.obtained) {
        return metaA.obtained ? -1 : 1;
      }

      return a.label.localeCompare(b.label);
    });
  }, [titleMeta, titleSort]);

  const selectionOrder = useMemo(() => {
    const orderMap = new Map<string, number>();
    draftIds.forEach((id, index) => orderMap.set(id, index + 1));
    return orderMap;
  }, [draftIds]);

  const handleOpenEdit = () => {
    setDraftIds(getSelectedBadgeIds());
    setEditVisible(true);
  };

  const handleToggleBadge = (id: string) => {
    if (draftIds.includes(id)) {
      setDraftIds((prev) => prev.filter((item) => item !== id));
      return;
    }

    if (draftIds.length < 4) {
      setDraftIds((prev) => [...prev, id]);
      return;
    }

    setDraftIds((prev) => [...prev.slice(1), id]);
  };

  const handleSaveBadges = () => {
    setSelectedBadgeIds(draftIds);
    setEditVisible(false);
  };

  const equippedTitleId = userData.equippedTitleId || titleList[0]?.id || "";
  const equippedAvatarId = userData.equippedAvatarId || avatarList[0]?.id || "";
  const equippedFrameId = userData.equippedFrameId || frameList[0]?.id || "";
  const equippedAvatar = avatarList.find((item) => item.id === equippedAvatarId) ?? avatarList[0];
  const equippedFrame = frameList.find((item) => item.id === equippedFrameId) ?? frameList[0];

  return (
    <View style={styles.screen}>
        <SafeAreaView style={styles.safeArea}>
          <TopHeader
            title="Profile"
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
            <View style={styles.profileCard}>
              <View style={styles.avatarWrap}>
                <Image source={equippedAvatar?.image} style={styles.avatarImage} />
                {equippedFrame && (
                  <Image source={equippedFrame.image} style={styles.avatarFrame} />
                )}
                <Pressable
                  style={styles.avatarEdit}
                  onPress={() => {
                    setAvatarFrameTab("avatar");
                    setAvatarFrameVisible(true);
                  }}
                >
                  <Ionicons name="pencil" size={20} color={Colors.octonary.DEFAULT} />
                </Pressable>
              </View>
              <Text style={styles.profileName}>{userData.profile.fullName}</Text>

              <View style={styles.titleRow}>
                <TitlePill
                  title={titleList.find((item) => item.id === equippedTitleId) ?? titleList[0]}
                  size="md"
                />
                <Pressable style={styles.titleEdit} onPress={() => setTitleEditVisible(true)}>
                  <Ionicons name="pencil" size={20} color={Colors.octonary.DEFAULT} />
                </Pressable>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statTextWrap}>
                  <Text style={styles.statValue}>{userData.streakDays} days</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
                <Image source={streakImage} style={styles.statImage} />
              </View>
              <Pressable
                style={[styles.statCard, styles.statCardAlt]}
                onPress={() => router.push("/leaderboard")}
              >
                <View style={styles.statTextWrap}>
                  <Text style={styles.statValue}>#{userData.leaderboardRank}</Text>
                  <Text style={styles.statLabel}>Leaderboard</Text>
                </View>
                <Image source={leaderboardImage} style={styles.statImage} />
              </Pressable>
            </View>

            <View style={styles.badgeCard}>
              <View style={styles.badgeHeader}>
                <Text style={styles.badgeTitle}>My Badges</Text>
                <Pressable onPress={handleOpenEdit}>
                  <Ionicons name="pencil" size={18} color={Colors.octonary.DEFAULT} />
                </Pressable>
              </View>
              <View style={styles.badgeRow}>
                {selectedBadges.map((badge) => (
                  <View key={badge?.id} style={styles.badgeChip}>
                    <Image source={badge?.image} style={styles.badgeImage} />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.menuCard}>
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push("/edit-profile")}
              >
                <Text style={[styles.menuText, { color: Colors.octonary.DEFAULT }]}>
                  Edit Profile
                </Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push("/notifications-settings")}
              >
                <Text style={[styles.menuText, { color: Colors.octonary.DEFAULT }]}>
                  Notifications Settings
                </Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
              <Pressable
                style={styles.menuRow}
                onPress={() => router.push("/my-recordings")}
              >
                <Text style={[styles.menuText, { color: Colors.octonary.DEFAULT }]}>
                  My Recordings
                </Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.octonary.DEFAULT} />
              </Pressable>
              <Pressable style={styles.menuRow} onPress={() => setLogoutVisible(true)}>
                <Text style={[styles.menuText, { color: Colors.error[500] }]}>Log out</Text>
                <Ionicons name="log-out-outline" size={20} color={Colors.error[500]} />
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="profile" />
        </View>

      {editVisible && (
        <View style={styles.editOverlay}>
          <Pressable style={styles.editBackdrop} onPress={() => setEditVisible(false)} />
          <SafeAreaView style={styles.editSheet}>
            <View style={styles.editHandle} />
            <View style={styles.editHeaderRow}>
              <Text style={styles.editTitle}>My Badges</Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.editGrid}
              showsVerticalScrollIndicator={false}
            >
              {badgeList.map((badge) => {
                const order = selectionOrder.get(badge.id);
                const isSelected = order != null;

                return (
                  <Pressable
                    key={badge.id}
                    style={[styles.editBadgeCard, isSelected && styles.editBadgeCardActive]}
                    onPress={() => handleToggleBadge(badge.id)}
                  >
                    {isSelected && (
                      <View style={styles.editOrderBadge}>
                        <Text style={styles.editOrderText}>{order}</Text>
                      </View>
                    )}
                    <Image source={badge.image} style={styles.editBadgeImage} />
                    <Text style={styles.editBadgeTitle}>{badge.title}</Text>
                    <Text style={styles.editBadgeSubtitle}>{badge.subtitle}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable style={styles.editSaveButton} onPress={handleSaveBadges}>
              <Text style={styles.editSaveButtonText}>Save</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      )}

      {titleEditVisible && (
        <View style={styles.editOverlay}>
          <Pressable
            style={styles.editBackdrop}
            onPress={() => {
              setTitleEditVisible(false);
              setSortOpen(false);
            }}
          />
          <SafeAreaView style={styles.titleSheet}>
            <View style={styles.editHandle} />
            <View style={styles.titleHeaderRow}>
              <Text style={styles.titleSheetTitle}>My Titles</Text>
              <View style={styles.sortWrap}>
                <Pressable
                  style={styles.sortButton}
                  onPress={() => setSortOpen((prev) => !prev)}
                >
                  <Text style={styles.sortButtonText}>
                    {titleSort === "recent" ? "Recent" : "Obtained"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={Colors.octonary.DEFAULT} />
                </Pressable>
                {sortOpen && (
                  <View style={styles.sortMenu}>
                    {[
                      { label: "Recent", value: "recent" },
                      { label: "Obtained", value: "obtained" },
                    ].map((option) => (
                      <Pressable
                        key={option.value}
                        style={styles.sortOption}
                        onPress={() => {
                          setTitleSort(option.value as "recent" | "obtained");
                          setSortOpen(false);
                        }}
                      >
                        <Text style={styles.sortOptionText}>{option.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.titleGrid}
              showsVerticalScrollIndicator={false}
            >
              {sortedTitles.map((title) => {
                const meta = titleMeta.get(title.id);
                const isObtained = meta?.obtained ?? false;
                const isEquipped = equippedTitleId === title.id;

                return (
                  <Pressable
                    key={title.id}
                    style={[styles.titleItem, !isObtained && styles.titleItemLocked]}
                    onPress={() => {
                      setTitleDetailId(title.id);
                    }}
                  >
                    <TitlePill title={title} />
                    {isEquipped && (
                      <View style={styles.titleEquipped}>
                        <Ionicons name="checkmark" size={15} color={Colors.shade[100]} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      {titleDetailId && (
        <View style={styles.editOverlay}>
          <Pressable
            style={styles.editBackdrop}
            onPress={() => setTitleDetailId(null)}
          />
          <View style={styles.titleDetailCard}>
            <TitlePill
              title={titleList.find((item) => item.id === titleDetailId) ?? titleList[0]}
              size="md"
            />
            <Text style={styles.titleDetailHeading}>Requirement:</Text>
            <Text style={styles.titleDetailText}>Obtain 5 badges</Text>
            <View style={styles.titleDetailActions}>
              <Pressable
                style={[styles.titleDetailButton, styles.titleDetailCancel]}
                onPress={() => setTitleDetailId(null)}
              >
                <Text style={styles.titleDetailCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.titleDetailButton, styles.titleDetailEquip]}
                onPress={() => {
                  const nextTitleId = titleDetailId ?? equippedTitleId;
                  updateMockUserData({ equippedTitleId: nextTitleId });
                  setTitleDetailId(null);
                }}
              >
                <Text style={styles.titleDetailEquipText}>
                  {equippedTitleId === titleDetailId ? "Equipped" : "Equip"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {avatarFrameVisible && (
        <View style={styles.editOverlay}>
          <Pressable
            style={styles.editBackdrop}
            onPress={() => setAvatarFrameVisible(false)}
          />
          <SafeAreaView style={styles.avatarSheet}>
            <View style={styles.editHandle} />
            <View style={styles.avatarTabs}>
              <Pressable
                style={[styles.avatarTab, avatarFrameTab === "avatar" && styles.avatarTabActive]}
                onPress={() => setAvatarFrameTab("avatar")}
              >
                <Text
                  style={[
                    styles.avatarTabText,
                    avatarFrameTab === "avatar" && styles.avatarTabTextActive,
                  ]}
                >
                  Avatar
                </Text>
              </Pressable>
              <Pressable
                style={[styles.avatarTab, avatarFrameTab === "frame" && styles.avatarTabActive]}
                onPress={() => setAvatarFrameTab("frame")}
              >
                <Text
                  style={[
                    styles.avatarTabText,
                    avatarFrameTab === "frame" && styles.avatarTabTextActive,
                  ]}
                >
                  Frames
                </Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.avatarGrid}
              showsVerticalScrollIndicator={false}
            >
              {avatarFrameTab === "avatar"
                ? avatarList.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.avatarGridItem}
                      onPress={() => setMediaDetail({ type: "avatar", id: item.id })}
                    >
                      <ProfileMediaCard
                        title={item.title}
                        image={item.image}
                        equipped={item.id === equippedAvatarId}
                        variant="avatar"
                      />
                    </Pressable>
                  ))
                : frameList.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.avatarGridItem}
                      onPress={() => setMediaDetail({ type: "frame", id: item.id })}
                    >
                      <ProfileMediaCard
                        title={item.title}
                        image={item.image}
                        equipped={item.id === equippedFrameId}
                        variant="frame"
                        avatarImage={equippedAvatar?.image}
                      />
                    </Pressable>
                  ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}

      {mediaDetail && (
        <View style={styles.editOverlay}>
          <Pressable style={styles.editBackdrop} onPress={() => setMediaDetail(null)} />
          <View style={styles.mediaDetailCard}>
            <ProfileMediaCard
              title={
                mediaDetail.type === "avatar"
                  ? (avatarList.find((item) => item.id === mediaDetail.id)?.title ?? "")
                  : (frameList.find((item) => item.id === mediaDetail.id)?.title ?? "")
              }
              image={
                mediaDetail.type === "avatar"
                  ? (avatarList.find((item) => item.id === mediaDetail.id)?.image ?? null)
                  : (frameList.find((item) => item.id === mediaDetail.id)?.image ?? null)
              }
              equipped={
                mediaDetail.type === "avatar"
                  ? mediaDetail.id === equippedAvatarId
                  : mediaDetail.id === equippedFrameId
              }
              variant={mediaDetail.type}
              size="lg"
              avatarImage={equippedAvatar?.image}
            />
            <Text style={styles.mediaDetailText}>
              {mediaDetail.type === "avatar"
                ? (avatarList.find((item) => item.id === mediaDetail.id)?.description ?? "")
                : (frameList.find((item) => item.id === mediaDetail.id)?.description ?? "")}
            </Text>
            <View style={styles.mediaDetailActions}>
              <Pressable
                style={[styles.mediaDetailButton, styles.mediaDetailCancel]}
                onPress={() => setMediaDetail(null)}
              >
                <Text style={styles.mediaDetailCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.mediaDetailButton, styles.mediaDetailEquip]}
                onPress={() => {
                  if (mediaDetail.type === "avatar") {
                    updateMockUserData({ equippedAvatarId: mediaDetail.id });
                  } else {
                    updateMockUserData({ equippedFrameId: mediaDetail.id });
                  }
                  setMediaDetail(null);
                }}
              >
                <Text style={styles.mediaDetailEquipText}>
                  {mediaDetail.type === "avatar"
                    ? mediaDetail.id === equippedAvatarId
                      ? "Equipped"
                      : "Equip"
                    : mediaDetail.id === equippedFrameId
                      ? "Equipped"
                      : "Equip"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {logoutVisible && (
        <View style={styles.editOverlay}>
          <Pressable style={styles.editBackdrop} onPress={() => setLogoutVisible(false)} />
          <View style={styles.logoutCard}>
            <Image source={logoutImage} style={styles.logoutImage} />
            <Text style={styles.logoutTitle}>Log out from this account?</Text>
            <View style={styles.logoutActions}>
              <Pressable
                style={[styles.logoutButton, styles.logoutCancel]}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.logoutButton, styles.logoutConfirm]}
                onPress={() => {
                  setLogoutVisible(false);
                  router.replace("/login");
                }}
              >
                <Text style={styles.logoutConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
              <Toast
                visible={toastVisible}
                message={toastText}
                variant={toastType}
              />
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
    gap: 20,
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
  profileCard: {
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
  },
  avatarImage: {
    width: 126,
    height: 126,
    borderRadius: 63,
  },
  avatarFrame: {
    position: "absolute",
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  avatarEdit: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.warning[300],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
  },
  profileName: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    left: 24,
  },
  titleEdit: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: "#FFEBEB",
    height: 92,
    overflow: "hidden",
  },
  statCardAlt: {
    borderColor: Colors.quinary[300],
    backgroundColor: "#FFF4C2",
  },
  statTextWrap: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 2,
  },
  statValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  statLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  statImage: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 80,
    height: 80,
    resizeMode: "contain",
    zIndex: 1,
  },
  badgeCard: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.blue[300],
    padding: 16,
    backgroundColor: Colors.blue[50],
    gap: 12,
  },
  badgeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
  },
  badgeChip: {
    flex: 1,
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.senary[200],
    backgroundColor: "#FFEAEA",
    paddingVertical: 10,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  menuText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
  editOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  editBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  editSheet: {
    marginTop: 100,
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flex: 1,
  },
  editHandle: {
    width: 50,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.neutral[200],
    alignSelf: "center",
    marginBottom: 16,
  },
  editHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  editTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  editClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editGrid: {
    paddingBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 14,
  },
  editBadgeCard: {
    width: "47%",
    borderRadius: 16,
    padding: 12,
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  editBadgeCardActive: {
    borderColor: Colors.octonary.DEFAULT,
  },
  editOrderBadge: {
    position: "absolute",
    top: -10,
    left: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#7EE4A7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    zIndex: 2,
  },
  editOrderText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  editBadgeImage: {
    width: 74,
    height: 74,
    resizeMode: "contain",
  },
  editBadgeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  editBadgeSubtitle: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  editSaveButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  editSaveButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  titleSheet: {
    marginTop: 100,
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flex: 1,
  },
  titleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleSheetTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  sortWrap: {
    alignItems: "flex-end",
    position: "relative",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.shade[200],
  },
  sortButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  sortMenu: {
    position: "absolute",
    top: 52,
    right: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.neutral[500],
    backgroundColor: Colors.shade[200],
    overflow: "hidden",
    zIndex: 2,
    elevation: 2,
  },
  sortOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sortOptionText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  titleGrid: {
    paddingBottom: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    paddingHorizontal: 8,
  },
  titleItem: {
    width: "47%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  titleItemLocked: {
    opacity: 0.35,
  },
  titleEquipped: {
    position: "absolute",
    top: -6,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#afe1cd",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
  },
  titleDetailCard: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "45%",
    transform: [{ translateY: -120 }],
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 12,
  },
  titleDetailHeading: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  titleDetailText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  titleDetailActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  titleDetailButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleDetailCancel: {
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
  },
  titleDetailEquip: {
    backgroundColor: Colors.senary[300],
  },
  titleDetailCancelText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  titleDetailEquipText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
  avatarSheet: {
    marginTop: 90,
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flex: 1,
  },
  avatarTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 18,
  },
  avatarTab: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: Colors.shade[200],
  },
  avatarTabActive: {
    backgroundColor: Colors.senary[300],
    borderColor: Colors.senary[300],
  },
  avatarTabText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  avatarTabTextActive: {
    color: Colors.shade[200],
  },
  avatarGrid: {
    paddingBottom: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  avatarGridItem: {
    width: "47%",
  },
  mediaDetailCard: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "45%",
    transform: [{ translateY: -160 }],
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 12,
  },
  mediaDetailText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  mediaDetailActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  mediaDetailButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaDetailCancel: {
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
  },
  mediaDetailEquip: {
    backgroundColor: Colors.senary[300],
  },
  mediaDetailCancelText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  mediaDetailEquipText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
  logoutCard: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "45%",
    transform: [{ translateY: -160 }],
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
    gap: 16,
  },
  logoutImage: {
    width: 270,
    height: 270,
    resizeMode: "contain",
  },
  logoutTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  logoutActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  logoutButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutCancel: {
    backgroundColor: Colors.shade[200],
    borderWidth: 1.5,
    borderColor: Colors.neutral[300],
  },
  logoutConfirm: {
    backgroundColor: Colors.senary[300],
  },
  logoutCancelText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  logoutConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.shade[200],
  },
});

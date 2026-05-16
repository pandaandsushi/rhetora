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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import TitlePill from "../components/title-pill";
import { Colors } from "../constants/colors";
import {
  badgeList,
  getSelectedBadgeIds,
  setSelectedBadgeIds,
  subscribeToBadgeSelection,
} from "../constants/badges";
import { titleList } from "../constants/titles";

const bgImage = require("../assets/images/homepage/bg-home.png");
const coinImage = require("../assets/images/shop/coin.png");
const avatarImage = require("../assets/images/avatar/av-doggo.png");
const streakImage = require("../assets/images/homepage/il-streak.png");
const leaderboardImage = require("../assets/images/homepage/il-leaderboard.png");

export default function Profile() {
  const router = useRouter();
  const [selectedBadgeIds, setSelectedBadgeIdsState] = useState(getSelectedBadgeIds());
  const [editVisible, setEditVisible] = useState(false);
  const [draftIds, setDraftIds] = useState<string[]>(getSelectedBadgeIds());
  const [titleEditVisible, setTitleEditVisible] = useState(false);
  const [titleSort, setTitleSort] = useState<"recent" | "obtained">("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [equippedTitleId, setEquippedTitleId] = useState(titleList[0]?.id ?? "");
  const [titleDetailId, setTitleDetailId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToBadgeSelection(() => {
      setSelectedBadgeIdsState(getSelectedBadgeIds());
    });

    return unsubscribe;
  }, []);

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

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        imageStyle={{ opacity: 0.35 }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <TopHeader
            title="Profile"
            variant="transparent"
            onBack={() => router.back()}
            rightElement={
              <View style={styles.coinPill}>
                <Image source={coinImage} style={styles.coinIcon} />
                <Text style={styles.coinText}>100</Text>
              </View>
            }
          />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
              <View style={styles.avatarWrap}>
                <Image source={avatarImage} style={styles.avatarImage} />
                <Pressable style={styles.avatarEdit}>
                  <Ionicons name="pencil" size={16} color={Colors.octonary.DEFAULT} />
                </Pressable>
              </View>
              <Text style={styles.profileName}>John Doe</Text>

              <View style={styles.titleRow}>
                <TitlePill
                  title={titleList.find((item) => item.id === equippedTitleId) ?? titleList[0]}
                  size="md"
                />
                <Pressable style={styles.titleEdit} onPress={() => setTitleEditVisible(true)}>
                  <Ionicons name="pencil" size={16} color={Colors.octonary.DEFAULT} />
                </Pressable>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statTextWrap}>
                  <Text style={styles.statValue}>9 days</Text>
                  <Text style={styles.statLabel}>Streak</Text>
                </View>
                <Image source={streakImage} style={styles.statImage} />
              </View>
              <View style={[styles.statCard, styles.statCardAlt]}>
                <View style={styles.statTextWrap}>
                  <Text style={styles.statValue}>#10</Text>
                  <Text style={styles.statLabel}>Leaderboard</Text>
                </View>
                <Image source={leaderboardImage} style={styles.statImage} />
              </View>
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
              {[
                { label: "Edit Profile", color: Colors.octonary.DEFAULT },
                { label: "Notifications", color: Colors.octonary.DEFAULT },
                { label: "My Recordings", color: Colors.octonary.DEFAULT },
                { label: "Log out", color: Colors.error[500], isLogout: true },
              ].map((item) => (
                <Pressable key={item.label} style={styles.menuRow}>
                  <Text style={[styles.menuText, { color: item.color }]}>{item.label}</Text>
                  <Ionicons
                    name={item.isLogout ? "log-out-outline" : "chevron-forward"}
                    size={20}
                    color={item.color}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>

        <View style={styles.navWrap}>
          <NavBar activeKey="profile" />
        </View>
      </ImageBackground>

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
                        <Ionicons name="checkmark" size={12} color={Colors.shade[200]} />
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
                  setEquippedTitleId(titleDetailId);
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
    fontSize: 18,
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
    paddingBottom: 12,
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
    borderColor: Colors.neutral[200],
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
    gap: 14,
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
    backgroundColor: "#3DBE8B",
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
});

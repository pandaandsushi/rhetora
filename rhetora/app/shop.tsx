import { Image, ImageBackground, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import TopHeader from "../components/top-header";
import ShopItemCard from "../components/shop-item-card";
import { Colors } from "../constants/colors";
import { avatarList } from "../constants/avatars";
import { frameList } from "../constants/frames";
import { getMockUserData, subscribeToMockUser, updateMockUserData } from "../data/mock-user";

const backgroundImage = require("../assets/images/bg-shop.png");
const coinImage = require("../assets/images/shop/coin.png");
const confettiImage = require("../assets/images/confetti.png");
const chapterOneImage = require("../assets/images/storymode/chapter1.png");
const chapterTwoImage = require("../assets/images/storymode/chapter2.png");
const vrClassroomImage = require("../assets/images/vr/school.png");
const vrMeetingImage = require("../assets/images/vr/meeting.png");
const vrPodiumImage = require("../assets/images/vr/podium.png");

type ShopTab = "avatar" | "frame" | "unlock";

type ShopItem = {
  id: string;
  title: string;
  image: any;
  price: number;
  type: "avatar" | "frame" | "chapter" | "vr";
};
type UnlockFilter = "all" | "chapter" | "vr";

const avatarPrices = new Map<string, number>(avatarList.map((item) => [item.id, 100]));
const framePrices = new Map<string, number>(frameList.map((item) => [item.id, 100]));

const chapterItems: ShopItem[] = [
  {
    id: "chapter-1",
    title: "The First Introduction",
    image: chapterOneImage,
    price: 160,
    type: "chapter",
  },
  {
    id: "chapter-2",
    title: "A Day to Remember",
    image: chapterTwoImage,
    price: 160,
    type: "chapter",
  },
];

const vrItems: ShopItem[] = [
  {
    id: "vr-meeting",
    title: "VR Meeting Room",
    image: vrMeetingImage,
    price: 220,
    type: "vr",
  },
  {
    id: "vr-podium",
    title: "VR Podium",
    image: vrPodiumImage,
    price: 220,
    type: "vr",
  },
];

export default function Shop() {
  const router = useRouter();
  const [userData, setUserData] = useState(getMockUserData());
  const [activeTab, setActiveTab] = useState<ShopTab>("avatar");
  const [showObtainedOnly, setShowObtainedOnly] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [obtainedOpen, setObtainedOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseError, setPurchaseError] = useState("");
  const [unlockFilter, setUnlockFilter] = useState<UnlockFilter>("all");

  const equippedAvatar =
    avatarList.find((item) => item.id === userData.equippedAvatarId) ?? avatarList[0];

  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  const avatarItems: ShopItem[] = useMemo(() => {
    return avatarList.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      price: avatarPrices.get(item.id) ?? 100,
      type: "avatar",
    }));
  }, []);

  const frameItems: ShopItem[] = useMemo(() => {
    return frameList.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      price: framePrices.get(item.id) ?? 100,
      type: "frame",
    }));
  }, []);

    const unlockItems = useMemo(() => {
      return [...chapterItems, ...vrItems];
    }, []);

    const isEquipped = (item: ShopItem) => {
    if (item.type === "avatar") {
      return userData.equippedAvatarId === item.id;
    }

    if (item.type === "frame") {
      return userData.equippedFrameId === item.id;
    }

    return false;
  };

  const isObtained = (item: ShopItem) => {
    if (item.type === "avatar") {
      return userData.ownedAvatarIds.includes(item.id);
    }
    if (item.type === "frame") {
      return userData.ownedFrameIds.includes(item.id);
    }
    if (item.type === "chapter") {
      return userData.unlockedChapterIds.includes(item.id);
    }
    return userData.unlockedVrIds.includes(item.id);
  };

  const activeItems = useMemo(() => {
    const baseList =
      activeTab === "avatar"
        ? avatarItems
        : activeTab === "frame"
          ? frameItems
          : unlockItems;

    const unlockFilteredList =
      activeTab === "unlock" && unlockFilter !== "all"
        ? baseList.filter((item) => item.type === unlockFilter)
        : baseList;

    const filtered = showObtainedOnly
      ? unlockFilteredList.filter((item) => isObtained(item))
      : unlockFilteredList;

    return [...filtered].sort((a, b) => {
      const aObtained = isObtained(a);
      const bObtained = isObtained(b);

      if (aObtained === bObtained) {
        return 0;
      }

      return aObtained ? 1 : -1;
    });
  }, [
    activeTab,
    unlockFilter,
    avatarItems,
    frameItems,
    unlockItems,
    showObtainedOnly,
    userData,
  ]);

  const handlePurchase = () => {
    if (!selectedItem) {
      return;
    }

    const currentUser = getMockUserData();
    if (currentUser.coins < selectedItem.price) {
      setPurchaseError("Not enough coins");
      return;
    }

    const nextCoins = currentUser.coins - selectedItem.price;
    if (selectedItem.type === "avatar") {
      const nextOwned = currentUser.ownedAvatarIds.includes(selectedItem.id)
        ? currentUser.ownedAvatarIds
        : [...currentUser.ownedAvatarIds, selectedItem.id];
      updateMockUserData({ coins: nextCoins, ownedAvatarIds: nextOwned });
    } else if (selectedItem.type === "frame") {
      const nextOwned = currentUser.ownedFrameIds.includes(selectedItem.id)
        ? currentUser.ownedFrameIds
        : [...currentUser.ownedFrameIds, selectedItem.id];
      updateMockUserData({ coins: nextCoins, ownedFrameIds: nextOwned });
    } else if (selectedItem.type === "chapter") {
      const nextUnlocked = currentUser.unlockedChapterIds.includes(selectedItem.id)
        ? currentUser.unlockedChapterIds
        : [...currentUser.unlockedChapterIds, selectedItem.id];
      updateMockUserData({ coins: nextCoins, unlockedChapterIds: nextUnlocked });
    } else {
      const nextUnlocked = currentUser.unlockedVrIds.includes(selectedItem.id)
        ? currentUser.unlockedVrIds
        : [...currentUser.unlockedVrIds, selectedItem.id];
      updateMockUserData({ coins: nextCoins, unlockedVrIds: nextUnlocked });
    }

    setConfirmOpen(false);
    setPurchaseError("");
    setSuccessOpen(true);
  };

  const handleEquip = () => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.type === "avatar") {
      updateMockUserData({ equippedAvatarId: selectedItem.id });
    }

    if (selectedItem.type === "frame") {
      updateMockUserData({ equippedFrameId: selectedItem.id });
    }

    setSuccessOpen(false);
    setObtainedOpen(false);
  };

  const openConfirm = (item: ShopItem) => {
    setSelectedItem(item);
    setPurchaseError("");

    if (isEquipped(item)) {
      return;
    }

    if (isObtained(item)) {
      setObtainedOpen(true);
      return;
    }

    setConfirmOpen(true);
  };

  const closeAllModals = () => {
    setConfirmOpen(false);
    setSuccessOpen(false);
    setObtainedOpen(false);
    setPurchaseError("");
  };
  const isEquippableItem = selectedItem?.type === "avatar" || selectedItem?.type === "frame";

  const obtainedModalTitle = isEquippableItem
    ? "You already have this item. Equip it now?"
    : "You already unlocked this item.";

  const actionLabel = selectedItem?.type === "chapter" || selectedItem?.type === "vr" ? "Open now!" : "Equip now!";

  return (
    <ImageBackground source={backgroundImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Point Shop" onBack={() => router.back()} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabRow}>
          {[
            { id: "avatar", label: "Avatar" },
            { id: "frame", label: "Frame" },
            { id: "unlock", label: "Unlocks" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabButton, active && styles.tabButtonActive]}
                onPress={() => {
                  setActiveTab(tab.id as ShopTab);

                  if (tab.id !== "unlock") {
                    setUnlockFilter("all");
                  }
                }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.panel}>
          <View style={styles.filterRow}>
            <View style={styles.coinPill}>
              <Image source={coinImage} style={styles.coinIcon} />
              <Text style={styles.coinText}>{userData.coins}</Text>
            </View>
            <Pressable
              style={styles.obtainedToggle}
              onPress={() => setShowObtainedOnly((prev) => !prev)}
            >
              <View style={[styles.checkBox, showObtainedOnly && styles.checkBoxActive]}>
                {showObtainedOnly && (
                  <Ionicons name="checkmark" size={14} color={Colors.octonary.DEFAULT} />
                )}
              </View>
              <Text style={styles.obtainedText}>Show Obtained Only</Text>
            </Pressable>
          </View>

          {activeTab === "unlock" && (
            <View style={styles.unlockFilterRow}>
              {[
                { id: "all", label: "All" },
                { id: "chapter", label: "Chapters" },
                { id: "vr", label: "Scenarios" },
              ].map((filter) => {
                const active = unlockFilter === filter.id;

                return (
                  <Pressable
                    key={filter.id}
                    style={[
                      styles.unlockFilterButton,
                      active && styles.unlockFilterButtonActive,
                    ]}
                    onPress={() => setUnlockFilter(filter.id as UnlockFilter)}
                  >
                    <Text
                      style={[
                        styles.unlockFilterText,
                        active && styles.unlockFilterTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.grid}>
            {activeItems.map((item) => (
              <ShopItemCard
                key={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                equipped={isEquipped(item)}
                obtained={isObtained(item)}
                dimmed={isObtained(item) || isEquipped(item)}
                variant={item.type === "frame" ? "frame" : "unlock"}
                avatarImage={item.type === "frame" ? equippedAvatar?.image : undefined}
                onPress={() => openConfirm(item)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={confirmOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Are you sure you want to make this purchase?</Text>
            {selectedItem && (
              <ShopItemCard
                key={selectedItem.id}
                title={selectedItem.title}
                image={selectedItem.image}
                price={selectedItem.price}
                obtained={isObtained(selectedItem)}
                dimmed={isObtained(selectedItem)}
                variant={selectedItem.type === "frame" ? "frame" : "unlock"}
                avatarImage={selectedItem.type === "frame" ? equippedAvatar?.image : undefined}
              />
            )}
            {purchaseError ? <Text style={styles.errorText}>{purchaseError}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.modalCancel]} onPress={closeAllModals}>
                <Text style={styles.modalCancelText}>No</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalConfirm]} onPress={handlePurchase}>
                <Text style={styles.modalConfirmText}>Yes!</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={obtainedOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{obtainedModalTitle}</Text>

            {selectedItem && (
              <View style={styles.modalSuccessItem}>
                {selectedItem.type === "frame" ? (
                  <View style={styles.modalFrameSuccessPreview}>
                    <Image source={equippedAvatar?.image} style={styles.modalAvatarSuccessImage} />
                    <Image source={selectedItem.image} style={styles.modalFrameSuccessImage} />
                  </View>
                ) : (
                  <Image source={selectedItem.image} style={styles.modalSuccessImage} />
                )}

                <Text style={styles.modalItemTitle}>{selectedItem.title}</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setObtainedOpen(false)}
              >
                <Text style={styles.modalCancelText}>
                  {isEquippableItem ? "No" : "OK"}
                </Text>
              </Pressable>

              {isEquippableItem && (
                <Pressable
                  style={[styles.modalButton, styles.modalConfirm]}
                  onPress={handleEquip}
                >
                  <Text style={styles.modalConfirmText}>Equip</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Image source={confettiImage} style={styles.confetti} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Successfully bought!</Text>
            {selectedItem && (
              <View style={styles.modalSuccessItem}>
                {selectedItem.type === "frame" ? (
                  <View style={styles.modalFrameSuccessPreview}>
                    <Image source={equippedAvatar?.image} style={styles.modalAvatarSuccessImage} />
                    <Image source={selectedItem.image} style={styles.modalFrameSuccessImage} />
                  </View>
                ) : (
                  <Image source={selectedItem.image} style={styles.modalSuccessImage} />
                )}
                <Text style={styles.modalItemTitle}>{selectedItem.title}</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.modalGhost]} onPress={handleEquip}>
                <Text style={styles.modalGhostText}>{actionLabel}</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalConfirm]} onPress={() => setSuccessOpen(false)}>
                <Text style={styles.modalConfirmText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 18,
  },
  panel: {
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    minHeight: 560,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.senary[300],
    overflow: "hidden",
    backgroundColor: Colors.shade[200],
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabButtonActive: {
    backgroundColor: Colors.senary[300],
  },
  tabText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  tabTextActive: {
    color: Colors.shade[200],
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    paddingHorizontal: 14,
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
  obtainedToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },
  checkBoxActive: {
    backgroundColor: Colors.quinary[100],
  },
  obtainedText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
    gap: 20,
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalItemCard: {
    width: 170,
    borderRadius: 18,
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  modalItemImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  modalFramePreview: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  modalFrameImage: {
    position: "absolute",
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  modalItemTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  modalPricePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modalCoinIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  modalPriceText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancel: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  modalConfirm: {
    backgroundColor: Colors.senary[300],
  },
  modalCancelText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.senary[300],
  },
  modalConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  modalGhost: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  modalGhostText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.senary[300],
  },
  modalSuccessItem: {
    alignItems: "center",
    gap: 14,
  },
  modalSuccessImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  modalFrameSuccessPreview: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarSuccessImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  modalFrameSuccessImage: {
    position: "absolute",
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  confetti: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  errorText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.error[500],
  },
  unlockFilterRow: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.neutral[100],
    borderRadius: 14,
    padding: 4,
  },

  unlockFilterButton: {
    flex: 1,
    borderRadius: 11,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  unlockFilterButtonActive: {
    backgroundColor: Colors.senary[300],
  },

  unlockFilterText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 13,
    color: Colors.neutral[500],
  },

  unlockFilterTextActive: {
    color: Colors.shade[200],
  },
});

import { Dimensions, Image, ImageBackground, PanResponder, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";

import NavBar from "../components/nav-bar";
import PeerFeedbackCard from "../components/peer-feedback-card";
import TopHeader from "../components/top-header";
import Toast from "../components/toast";
import { Colors } from "../constants/colors";
import { avatarList } from "../constants/avatars";
import { frameList } from "../constants/frames";
import { titleList } from "../constants/titles";
import {
  getMockUserData,
  subscribeToMockUser,
  updateMockUserData,
  type PeerFeedbackPost,
  type PeerFeedbackEntry,
} from "../data/mock-user";

const bgImage = require("../assets/images/bg-motif.png");

const postVideoImage = require("../assets/images/storymode/maelle.png");

const { height: screenHeight } = Dimensions.get("window");
const MIN_SHEET_HEIGHT = 260;
const MAX_SHEET_HEIGHT = Math.min(screenHeight * 0.78, 640);

const tagLabels: Record<PeerFeedbackPost["tag"], string> = {
  storymode: "Story",
  fillerfree: "Filler-Free",
  pitchlab: "The Pitch Lab",
  storytellingpractice: "Storytelling Practice",
};

export default function Feedback() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<"explore" | "my-posts">(
    params.tab === "my-posts" ? "my-posts" : "explore"
  );
  const [userData, setUserData] = useState(getMockUserData());
  const [ratingOpen, setRatingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("Successfully uploaded feedback");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [ratings, setRatings] = useState({
    structure: 0,
    fluency: 0,
    conciseness: 0,
    criticalThinking: 0,
    confidence: 0,
  });
  const [comment, setComment] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPostId, setMenuPostId] = useState<string | null>(null);
  const [showAspectDetails, setShowAspectDetails] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(MIN_SHEET_HEIGHT);
  const sheetHeightRef = useRef(sheetHeight);

  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedModes, setSelectedModes] = useState<string[]>(([
    "Story",
    "Storytelling Practice",
    "The Pitch Lab",
    "Filler-Free",
  ]));

  const [sortMode, setSortMode] = useState<"popular" | "recent">(
    "popular",
  );
  useEffect(() => {
    if (params.tab === "my-posts") {
      setActiveTab("my-posts");
    }

    if (params.tab === "explore") {
      setActiveTab("explore");
    }
  }, [params.tab]);
  
  useEffect(() => {
    const unsubscribe = subscribeToMockUser((next) => {
      setUserData(next);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (commentsOpen) {
      setSheetHeight(MIN_SHEET_HEIGHT);
    }
  }, [commentsOpen]);

  useEffect(() => {
    sheetHeightRef.current = sheetHeight;
  }, [sheetHeight]);

  const maskedPosts = useMemo(() => {
    return userData.peerFeedbackPosts.map((post) => ({
      ...post,
      displayName: post.hideName ? maskName(post.name) : post.name,
    }));
  }, [userData.peerFeedbackPosts]);

  const getEntriesForPost = (postId: string) => {
    return userData.peerFeedbackEntries.filter((entry) => entry.postId === postId);
  };
  
  const handleEditPost = () => {
    if (!menuPostId) {
      return;
    }

    setMenuOpen(false);

    router.push({
      pathname: "/feedback-share",
      params: {
        mode: "edit",
        postId: menuPostId,
      },
    });
  };

  const handleDeletePost = () => {
    if (!menuPostId) {
      return;
    }

    setMenuOpen(false);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePost = () => {
    if (!menuPostId) {
      return;
    }

    const currentUser = getMockUserData();

    updateMockUserData({
      peerFeedbackPosts: currentUser.peerFeedbackPosts.filter(
        (post) => post.id !== menuPostId
      ),
      peerFeedbackEntries: currentUser.peerFeedbackEntries.filter(
        (entry) => entry.postId !== menuPostId
      ),
    });

    setDeleteConfirmOpen(false);
    setMenuPostId(null);
    setToastMessage("Post deleted successfully");
    setToastVisible(true);

    setTimeout(() => setToastVisible(false), 2000);
  };

  const visiblePosts = useMemo(() => {
    const basePosts =
      activeTab === "my-posts"
        ? maskedPosts.filter((post) => post.isMine)
        : maskedPosts;

    const filtered = basePosts.filter((post) => {
      const modeLabel = tagLabels[post.tag];

      return (
        selectedModes.length === 0 ||
        selectedModes.includes(modeLabel)
      );
    });

    const sorted = [...filtered];

    if (sortMode === "popular") {
      sorted.sort(
        (a, b) =>
          getEntriesForPost(b.id).length -
          getEntriesForPost(a.id).length,
      );
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt ?? b.dateLabel).getTime() -
          new Date(a.createdAt ?? a.dateLabel).getTime(),
      );
    }

    return sorted;
  }, [
    activeTab,
    maskedPosts,
    selectedModes,
    sortMode,
  ]);



  const isFeedbackVisible = (postId: string) => {
    const post = userData.peerFeedbackPosts.find((item) => item.id === postId);
    return post?.feedbackVisible ?? true;
  };

  const getAverageRating = (postId: string) => {
    const entries = getEntriesForPost(postId);
    if (entries.length === 0) {
      return 0;
    }
    const totals = entries.map((entry) => {
      const sum =
        entry.ratings.structure +
        entry.ratings.fluency +
        entry.ratings.conciseness +
        entry.ratings.criticalThinking +
        entry.ratings.confidence;
      return sum / 5;
    });
    const avg = totals.reduce((sum, value) => sum + value, 0) / totals.length;
    return avg;
  };

  const toggleMode = (value: string) => {
    setSelectedModes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy < -20) {
            setSheetHeight(MAX_SHEET_HEIGHT);
            sheetHeightRef.current = MAX_SHEET_HEIGHT;
          } else if (gesture.dy > 20) {
            setSheetHeight(MIN_SHEET_HEIGHT);
            sheetHeightRef.current = MIN_SHEET_HEIGHT;
          } else {
            const next =
              sheetHeightRef.current === MIN_SHEET_HEIGHT
                ? MAX_SHEET_HEIGHT
                : MIN_SHEET_HEIGHT;
            setSheetHeight(next);
            sheetHeightRef.current = next;
          }
        },
      }),
    [],
  );
  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <TopHeader
          title="Peer Feedback"
          variant="transparent"
          onBack={() => router.back()}
          rightElement={
            <Pressable style={styles.addButton} onPress={() => router.push("/feedback-share")}>
              <Ionicons name="add" size={22} color={Colors.shade[200]} />
            </Pressable>
          }
        />

        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabButton, activeTab === "explore" && styles.tabButtonActive]}
            onPress={() => setActiveTab("explore")}
          >
            <Text style={[styles.tabText, activeTab === "explore" && styles.tabTextActive]}>
              Explore
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === "my-posts" && styles.tabButtonActive]}
            onPress={() => setActiveTab("my-posts")}
          >
            <Text style={[styles.tabText, activeTab === "my-posts" && styles.tabTextActive]}>
              My Posts
            </Text>
          </Pressable>
          <Pressable style={styles.filterButton} onPress={() => setFilterOpen(true)}>
            <Ionicons name="options-outline" size={20} color={Colors.octonary.DEFAULT} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visiblePosts.map((post) => {
          const avatar = post.isMine
            ? avatarList.find((item) => item.id === userData.equippedAvatarId)
            : avatarList.find((item) => item.id === post.avatarId);
          const frame = post.isMine
            ? frameList.find((item) => item.id === userData.equippedFrameId)
            : post.frameId
              ? frameList.find((item) => item.id === post.frameId)
              : null;
          const title = titleList.find((item) => item.id === post.titleId) ?? titleList[0];
          const commentCount = getEntriesForPost(post.id).length;

          return (
            <PeerFeedbackCard
              key={post.id}
              avatarImage={(avatar ?? avatarList[0]).image}
              frameImage={frame?.image}
              videoImage={postVideoImage}
              name={post.isMine ? "You" : post.displayName}
              title={title}
              message={post.message}
              tag={tagLabels[post.tag]}
              dateLabel={post.dateLabel}
              avgRating={getAverageRating(post.id)}
              commentCount={commentCount}
              showGiveFeedback={!post.isMine}
              showMenu={!!post.isMine}
              onMenuPress={() => {
                setMenuPostId(post.id);
                setMenuOpen(true);
              }}
              onCommentsPress={() => {
                setCommentsPostId(post.id);
                setCommentsOpen(true);
              }}
              onGiveFeedback={() => {
                setSelectedPostId(post.id);
                setRatings({
                  structure: 0,
                  fluency: 0,
                  conciseness: 0,
                  criticalThinking: 0,
                  confidence: 0,
                });
                setComment("");
                setRatingOpen(true);
              }}
            />
          );
        })}
      </ScrollView>

      <View style={styles.navWrap}>
        <NavBar activeKey="feedback" />
      </View>

      {ratingOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Give Feedback</Text>
              <Pressable onPress={() => setRatingOpen(false)}>
                <Ionicons name="close" size={22} color={Colors.octonary.DEFAULT} />
              </Pressable>
            </View>

            {(
              [
                { key: "structure", label: "Structure" },
                { key: "fluency", label: "Fluency" },
                { key: "conciseness", label: "Conciseness" },
                { key: "criticalThinking", label: "Critical Thinking" },
                { key: "confidence", label: "Confidence" },
              ] as const
            ).map((row) => (
              <View key={row.key} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{row.label}</Text>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Pressable
                      key={`${row.key}-${value}`}
                      onPress={() =>
                        setRatings((prev) => ({
                          ...prev,
                          [row.key]: value,
                        }))
                      }
                    >
                      <Ionicons
                        name={ratings[row.key] >= value ? "star" : "star-outline"}
                        size={26}
                        color={ratings[row.key] >= value ? "#F59E0B" : Colors.neutral[500]}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <Text style={styles.commentLabel}>What do you think of this video?</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Add feedback"
              placeholderTextColor={Colors.neutral[400]}
              multiline
              style={styles.commentInput}
            />
            <Pressable
              style={styles.tipToggle}
              onPress={() => setShowGuide((prev) => !prev)}
            >
              <Text style={styles.tipTitle}>How to give good feedback?</Text>
              <Ionicons
                name={showGuide ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.octonary.DEFAULT}
              />
            </Pressable>
            {showGuide && (
              <View style={styles.tipList}>
                <Text style={styles.tipText}>- Structure: clear flow and logical order.</Text>
                <Text style={styles.tipText}>- Fluency: smooth delivery and minimal pauses.</Text>
                <Text style={styles.tipText}>- Conciseness: focused and avoids unnecessary words.</Text>
                <Text style={styles.tipText}>- Critical Thinking: depth of ideas and reasoning.</Text>
                <Text style={styles.tipText}>- Confidence: steady voice and assured tone.</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setRatingOpen(false)}
              >
                <Text style={styles.modalGhostText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={() => {
                  if (!selectedPostId) {
                    return;
                  }
                  const currentUser = getMockUserData();
                  const nextEntry = {
                    id: `feedback-${Date.now()}`,
                    postId: selectedPostId,
                    authorName: userData.profile.fullName,
                    authorAvatarId: userData.equippedAvatarId,
                    ratings: {
                      structure: ratings.structure,
                      fluency: ratings.fluency,
                      conciseness: ratings.conciseness,
                      criticalThinking: ratings.criticalThinking,
                      confidence: ratings.confidence,
                    },
                    comment,
                    likes: 0,
                    dislikes: 0,
                    createdAt: new Date().toISOString(),
                  };
                  updateMockUserData({
                    peerFeedbackEntries: [...currentUser.peerFeedbackEntries, nextEntry],
                  });
                  setRatingOpen(false);
                  setToastMessage("Feedback submitted successfully");
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 2000);
                }}
              >
                <Text style={styles.modalConfirmText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {commentsOpen && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setCommentsOpen(false)} />
          <View style={[styles.commentSheet, { height: sheetHeight }]}>
            <View style={styles.commentSheetHandleArea} {...sheetPanResponder.panHandlers}>
              <View style={styles.commentSheetHandle} />
            </View>
            <Text style={styles.commentSheetTitle}>Feedback</Text>
            {commentsPostId && !isFeedbackVisible(commentsPostId) ? (
              <View style={styles.commentEmptyWrap}>
                <Text style={styles.commentEmptyText}>Feedback is private for this post.</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={styles.commentList} showsVerticalScrollIndicator={false}>
                {(() => {
                  const entries = commentsPostId ? getEntriesForPost(commentsPostId) : [];
                  if (entries.length === 0) {
                    return (
                      <View style={styles.commentEmptyWrap}>
                        <Text style={styles.commentEmptyText}>No feedback yet</Text>
                      </View>
                    );
                  }
                  return entries.map((entry) => {
                  const authorAvatar = avatarList.find((item) => item.id === entry.authorAvatarId) ?? avatarList[0];
                  const aspects = getAspectRows(entry);
                  return (
                    <View key={entry.id} style={styles.commentRow}>
                      <Image source={authorAvatar.image} style={styles.commentAvatar} />
                      <View style={styles.commentBody}>
                        <View style={styles.commentHeaderRow}>
                          <Text style={styles.commentName}>{entry.authorName}</Text>
                          <Text style={styles.commentTime}>{formatTimeAgo(entry.createdAt)}</Text>
                        </View>
                        <Text style={styles.commentText}>{entry.comment}</Text>
                        <Pressable
                          style={styles.detailsToggle}
                          onPress={() => setShowAspectDetails((prev) => !prev)}
                        >
                          <Text style={styles.detailsToggleText}>
                            {showAspectDetails ? "Hide details" : "Show details"}
                          </Text>
                          <Ionicons
                            name={showAspectDetails ? "chevron-up" : "chevron-down"}
                            size={16}
                            color={Colors.octonary.DEFAULT}
                          />
                        </Pressable>
                        {showAspectDetails ? (
                          <View style={styles.aspectGrid}>
                            {aspects.map((aspect) => (
                              <View key={aspect.label} style={styles.aspectItem}>
                                <Text style={styles.aspectLabel}>{aspect.label}</Text>
                                <View style={styles.aspectValueRow}>
                                  <Text style={styles.aspectValue}>{aspect.value}</Text>
                                  <Ionicons name="star" size={12} color="#F59E0B" />
                                </View>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <View style={styles.commentRatingRow}>
                            <Text style={styles.commentRatingText}>
                              {getEntryAverage(entry).toFixed(1)}
                            </Text>
                            <Ionicons name="star" size={14} color="#F59E0B" />
                          </View>
                        )}
                        <View style={styles.commentReactionRow}>
                          <View style={styles.commentReactionItem}>
                            <Ionicons name="thumbs-up" size={16} color={Colors.octonary.DEFAULT} />
                            <Text style={styles.commentReactionText}>{entry.likes}</Text>
                          </View>
                          <View style={styles.commentReactionItem}>
                            <Ionicons name="thumbs-down" size={16} color={Colors.octonary.DEFAULT} />
                            <Text style={styles.commentReactionText}>{entry.dislikes}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                  });
                })()}
              </ScrollView>
            )}
          </View>
        </View>
      )}

      {menuOpen && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menuSheet}>
            <Pressable style={styles.menuItem} onPress={handleEditPost}>
              <Text style={styles.menuText}>Edit Post</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={handleDeletePost}>
              <Text style={styles.menuTextDanger}>Delete Post</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
              <Text style={styles.menuText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
      {filterOpen && (
        <View style={styles.filterOverlay}>
          <Pressable
            style={styles.filterBackdrop}
            onPress={() => setFilterOpen(false)}
          />

          <View style={styles.filterCard}>
            <Text style={styles.filterHeading}>Mode</Text>

            <View style={styles.filterList}>
              {[
                "Story",
                "Storytelling Practice",
                "The Pitch Lab",
                "Filler-Free",
              ].map((mode) => {
                const checked = selectedModes.includes(mode);

                return (
                  <Pressable
                    key={mode}
                    style={styles.filterRow}
                    onPress={() => toggleMode(mode)}
                  >
                    <View
                      style={[
                        styles.checkBox,
                        checked && styles.checkBoxActive,
                      ]}
                    >
                      {checked && (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={Colors.octonary.DEFAULT}
                        />
                      )}
                    </View>

                    <Text style={styles.filterLabel}>
                      {mode}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text
              style={[
                styles.filterHeading,
                styles.filterHeadingSpacing,
              ]}
            >
              Show
            </Text>

            <View style={styles.filterList}>
              {[
                { key: "popular", label: "Popular" },
                { key: "recent", label: "Recent" },
              ].map((item) => {
                const checked = sortMode === item.key;

                return (
                  <Pressable
                    key={item.key}
                    style={styles.filterRow}
                    onPress={() =>
                      setSortMode(
                        item.key as "popular" | "recent",
                      )
                    }
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        checked &&
                          styles.radioOuterActive,
                      ]}
                    >
                      {checked && (
                        <View style={styles.radioInner} />
                      )}
                    </View>

                    <Text style={styles.filterLabel}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.filterActions}>
              <Pressable
                style={[
                  styles.filterButtonAction,
                  styles.filterReset,
                ]}
                onPress={() => {
                  setSelectedModes([
                    "Story",
                    "Storytelling Practice",
                    "The Pitch Lab",
                    "Filler-Free",
                  ]);

                  setSortMode("popular");
                }}
              >
                <Text style={styles.filterResetText}>
                  Reset
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterButtonAction,
                  styles.filterConfirm,
                ]}
                onPress={() => setFilterOpen(false)}
              >
                <Text style={styles.filterConfirmText}>
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {deleteConfirmOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete this post?</Text>

            <Text style={styles.deleteMessage}>
              This post and its received feedback will be removed from Peer Feedback.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => {
                  setDeleteConfirmOpen(false);
                  setMenuPostId(null);
                }}
              >
                <Text style={styles.modalGhostText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeletePost}
              >
                <Text style={styles.modalConfirmText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        variant="success"
      />
    </ImageBackground>
  );
}

const maskName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) {
    return name;
  }
  if (parts.length === 1) {
    return `${parts[0][0] ?? ""}***`;
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  const maskedFirst = `${first[0] ?? ""}***`;
  const maskedLast = `${last[0] ?? ""}**${last[last.length - 1] ?? ""}`;
  return `${maskedFirst} ${maskedLast}`;
};

const getEntryAverage = (entry: PeerFeedbackEntry) => {
  const sum =
    entry.ratings.structure +
    entry.ratings.fluency +
    entry.ratings.conciseness +
    entry.ratings.criticalThinking +
    entry.ratings.confidence;
  return sum / 5;
};

const getAspectRows = (entry: PeerFeedbackEntry) => [
  { label: "Structure", value: entry.ratings.structure },
  { label: "Fluency", value: entry.ratings.fluency },
  { label: "Conciseness", value: entry.ratings.conciseness },
  { label: "Critical Thinking", value: entry.ratings.criticalThinking },
  { label: "Confidence", value: entry.ratings.confidence },
];

const formatTimeAgo = (iso: string) => {
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) {
    return "";
  }
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return `${Math.max(minutes, 1)}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  safeArea: {
    paddingVertical: 10,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  tabRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tabButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.senary[300],
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: Colors.shade[200],
  },
  tabButtonActive: {
    backgroundColor: Colors.senary[300],
    borderColor: Colors.senary[300],
  },
  tabButtonActiveLight: {
    backgroundColor: Colors.shade[200],
  },
  tabText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.senary[300],
  },
  tabTextActive: {
    color: Colors.shade[200],
  },
  tabTextDark: {
    color: Colors.octonary.DEFAULT,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.septenary[100],
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 140,
    gap: 16,
  },
  navWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    color: Colors.octonary.DEFAULT,
  },
  ratingRow: {
    gap: 8,
  },
  ratingLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  starRow: {
    flexDirection: "row",
    gap: 10,
  },
  commentLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  commentInput: {
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    borderRadius: 14,
    minHeight: 120,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonGhost: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  modalButtonConfirm: {
    backgroundColor: Colors.senary[300],
  },
  modalGhostText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  modalConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  tipToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tipTitle: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  tipList: {
    gap: 6,
  },
  tipText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[600],
    lineHeight: 18,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  commentSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  commentSheetHandle: {
    width: 48,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.neutral[200],
    alignSelf: "center",
  },
  commentSheetTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  commentList: {
    gap: 16,
    paddingBottom: 10,
  },
  commentEmptyWrap: {
    paddingVertical: 20,
    alignItems: "center",
  },
  commentEmptyText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.neutral[500],
  },
  commentRow: {
    flexDirection: "row",
    gap: 12,
  },
  commentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  commentBody: {
    flex: 1,
    gap: 6,
  },
  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentName: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  commentTime: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
  },
  commentText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  commentRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aspectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  aspectItem: {
    width: "48%",
    gap: 4,
  },
  aspectLabel: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.neutral[500],
  },
  aspectValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  aspectValue: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailsToggleText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  commentRatingText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  commentReactionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 6,
  },
  commentReactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  commentReactionText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
  },
  menuSheet: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: Colors.shade[200],
    borderRadius: 18,
    paddingVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  menuText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  menuTextDanger: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.error[500],
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  filterBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  filterCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 14,
  },

  filterHeading: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },

  filterHeadingSpacing: {
    marginTop: 6,
  },

  filterList: {
    gap: 12,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.quinary[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.shade[200],
  },

  checkBoxActive: {
    backgroundColor: Colors.quinary[100],
  },

  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.neutral[400],
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterActive: {
    borderColor: Colors.senary[300],
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.senary[300],
  },

  filterLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },

  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  filterButtonAction: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  filterReset: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
  },

  filterConfirm: {
    backgroundColor: Colors.senary[300],
  },

  filterResetText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },

  filterConfirmText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  commentSheetHandleArea: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    marginTop: -12,
  },
  deleteMessage: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
    textAlign: "center",
  },

  deleteButton: {
    backgroundColor: Colors.error[500],
  },
});

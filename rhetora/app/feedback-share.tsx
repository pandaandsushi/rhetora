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
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import RecordingCard from "../components/recording-card";
import Toast from "../components/toast";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";
import {
  getMockUserData,
  updateMockUserData,
  type PeerFeedbackPost,
} from "../data/mock-user";

const bgImage = require("../assets/images/bg-motif.png");
const fallbackPreview = require("../assets/images/logorhetoraonly.png");

const tagFromMode = (mode: string): PeerFeedbackPost["tag"] => {
  const normalized = mode.toLowerCase();
  if (normalized.includes("story")) {
    return "storymode";
  }
  if (normalized.includes("filler")) {
    return "fillerfree";
  }
  if (normalized.includes("pitch")) {
    return "pitchlab";
  }
  return "storytellingpractice";
};

const formatPostDate = (date: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default function FeedbackShare() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recordingId?: string }>();
  const [step, setStep] = useState<"select" | "details">("select");
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [hideName, setHideName] = useState(false);
  const [hideFeedback, setHideFeedback] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Post created successfully");

  const recordings = useMemo(() => getMockUserData().recordings, []);

  useEffect(() => {
    if (typeof params.recordingId === "string") {
      setSelectedRecordingId(params.recordingId);
    }
  }, [params.recordingId]);

  const selectedRecording = recordings.find((recording) => recording.id === selectedRecordingId);
  const previewRecording = selectedRecording ?? recordings[0];

  const handleShare = () => {
    if (!selectedRecordingId || !selectedRecording) {
      return;
    }

    const currentUser = getMockUserData();
    const now = new Date();
    const nextPost: PeerFeedbackPost = {
      id: `post-${Date.now()}`,
      avatarId: currentUser.equippedAvatarId,
      frameId: currentUser.equippedFrameId,
      name: currentUser.profile.fullName,
      hideName,
      titleId: currentUser.equippedTitleId,
      message: description.trim() || "Hi, this is my result for practicing today! What do you guys think?",
      tag: tagFromMode(selectedRecording.mode),
      dateLabel: formatPostDate(now),
      feedbackVisible: !hideFeedback,
      isMine: true,
    };

    updateMockUserData({
      peerFeedbackPosts: [nextPost, ...currentUser.peerFeedbackPosts],
    });

    setToastMessage("Post created successfully");
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      router.back();
    }, 1600);
  };

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <SafeAreaView>
        <TopHeader
          title={step === "select" ? "Peer Feedback" : "New Feedback Share"}
          onBack={() => {
            if (step === "details") {
              setStep("select");
              return;
            }
            router.back();
          }}
        />
      </SafeAreaView>

      <View style={styles.pageBody}>
        <View style={styles.fixedTopContent}>
          <View style={styles.previewCard}>
            <Image
              source={previewRecording?.thumbnail ?? fallbackPreview}
              style={styles.previewImage}
              resizeMode={previewRecording?.hasVideo ? "cover" : "contain"}
            />
            <View style={styles.previewOverlay}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={30} color={Colors.shade[200]} />
              </View>
            </View>
          </View>

          {step === "select" && (
            <View style={styles.selectHeader}>
              <Text style={styles.selectTitle}>Select Recording</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/my-recordings",
                    params: {
                      select: "true",
                      recordingId: selectedRecordingId ?? undefined,
                    },
                  })
                }
              >
                <Text style={styles.selectLink}>View all recordings</Text>
              </Pressable>
            </View>
          )}
        </View>

        {step === "select" ? (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.recordingList}
            showsVerticalScrollIndicator={false}
          >
            {recordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                title={recording.title}
                dateLabel={recording.dateLabel}
                mode={recording.mode}
                thumbnail={recording.thumbnail}
                hasVideo={recording.hasVideo}
                selected={recording.id === selectedRecordingId}
                onPress={() => setSelectedRecordingId(recording.id)}
              />
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.detailsSection}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Hi, this is my result for practicing Filler-Free today! What do you guys think?"
              placeholderTextColor={Colors.neutral[400]}
              multiline
              style={styles.descriptionInput}
            />

            <Pressable style={styles.toggleRow} onPress={() => setHideName((prev) => !prev)}>
              <Text style={styles.toggleLabel}>Hide my name</Text>
              <View style={[styles.toggleTrack, hideName && styles.toggleTrackOn]}>
                <View style={[styles.toggleThumb, hideName && styles.toggleThumbOn]} />
              </View>
            </Pressable>

            <Pressable style={styles.toggleRow} onPress={() => setHideFeedback((prev) => !prev)}>
              <Text style={styles.toggleLabel}>Don't show received feedback to public</Text>
              <View style={[styles.toggleTrack, hideFeedback && styles.toggleTrackOn]}>
                <View style={[styles.toggleThumb, hideFeedback && styles.toggleThumbOn]} />
              </View>
            </Pressable>
          </ScrollView>
        )}

        <View style={styles.fixedBottomActions}>
          {step === "select" ? (
            <>
              <Pressable
                style={[styles.actionButton, styles.actionGhost]}
                onPress={() => router.back()}
              >
                <Text style={styles.actionGhostText}>Back</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  styles.actionPrimary,
                  !selectedRecordingId && styles.actionDisabled,
                ]}
                onPress={() => setStep("details")}
                disabled={!selectedRecordingId}
              >
                <Text style={styles.actionPrimaryText}>Next</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={[styles.actionButton, styles.actionGhost]}
                onPress={() => setStep("select")}
              >
                <Text style={styles.actionGhostText}>Back</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.actionPrimary]}
                onPress={handleShare}
              >
                <Text style={styles.actionPrimaryText}>Share</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <Toast visible={toastVisible} message="Your post has been shared" variant="success" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  previewCard: {
    borderRadius: 24,
    overflow: "hidden",
    height: 220,
    backgroundColor: Colors.neutral[100],
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  selectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
  },
  selectLink: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.senary[300],
    textDecorationLine: "underline",
  },
  recordingList: {
    gap: 14,
  },
  detailsSection: {
    gap: 18,
    paddingBottom: 24,
  },
  fieldLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  descriptionInput: {
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    borderRadius: 14,
    minHeight: 140,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlignVertical: "top",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabel: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
  },
  toggleTrack: {
    width: 52,
    height: 28,
    borderRadius: 999,
    backgroundColor: Colors.neutral[200],
    padding: 3,
    justifyContent: "center",
  },
  toggleTrackOn: {
    backgroundColor: Colors.senary[300],
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.shade[200],
    alignSelf: "flex-start",
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionGhost: {
    borderWidth: 2,
    borderColor: Colors.senary[300],
    backgroundColor: Colors.shade[200],
  },
  actionPrimary: {
    backgroundColor: Colors.senary[300],
  },
  actionDisabled: {
    opacity: 0.5,
  },
  actionGhostText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.senary[300],
  },
  actionPrimaryText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.shade[200],
  },
  pageBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },

  fixedTopContent: {
    gap: 20,
    marginBottom: 18,
  },

  scrollArea: {
    flex: 1,
  },

  recordingList: {
    gap: 14,
    paddingBottom: 20,
  },

  fixedBottomActions: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 28,
    flexDirection: "row",
    gap: 12,
  },
});

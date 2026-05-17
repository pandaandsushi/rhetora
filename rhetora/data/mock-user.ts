export type Recording = {
  id: string;
  title: string;
  dateLabel: string;
  mode: string;
  thumbnail?: any;
  hasVideo?: boolean;
};

type MockUserProfile = {
  fullName: string;
  email: string;
  password: string;
};

export type MockUserData = {
  profile: MockUserProfile;
  coins: number;
  leaderboardRank: number;
  streakDays: number;
  equippedAvatarId: string;
  equippedFrameId: string;
  equippedTitleId: string;
  ownedAvatarIds: string[];
  ownedFrameIds: string[];
  unlockedChapterIds: string[];
  unlockedVrIds: string[];
  recordings: Recording[];
  episodesCompleted: string[];
  badgesObtained: string[];
  peerFeedbackEntries: PeerFeedbackEntry[];
};

export type PeerFeedbackEntry = {
  id: string;
  postId: string;
  authorName: string;
  authorAvatarId: string;
  ratings: {
    structure: number;
    fluency: number;
    conciseness: number;
    criticalThinking: number;
    confidence: number;
  };
  comment: string;
  likes: number;
  dislikes: number;
  createdAt: string;
};

const mockRecordings: Recording[] = [
  {
    id: "rec-1",
    title: "Recording 2026-05-03",
    dateLabel: "2026-05-03",
    mode: "Story Mode",
    thumbnail: require("../assets/images/storymode/ch1/first-day.png"),
    hasVideo: true,
  },
  {
    id: "rec-2",
    title: "Recording 2026-05-03",
    dateLabel: "2026-05-03",
    mode: "Story Mode",
    thumbnail: require("../assets/images/storymode/ch1/mia-classroom-mic.png"),
    hasVideo: true,
  },
  {
    id: "rec-3",
    title: "Recording 2026-04-18",
    dateLabel: "2026-04-18",
    mode: "Impromptu Sprint",
    hasVideo: false,
  },
  {
    id: "rec-4",
    title: "Recording 2026-04-15",
    dateLabel: "2026-04-15",
    mode: "Impromptu Sprint",
    hasVideo: false,
  },
];

let mockUserData: MockUserData = {
  profile: {
    fullName: "John Doe",
    email: "john@rhetora.com",
    password: "password",
  },
  coins: 100,
  leaderboardRank: 10,
  streakDays: 9,
  equippedAvatarId: "sad-doggo",
  equippedFrameId: "little-puppy",
  equippedTitleId: "sweet-victory",
  ownedAvatarIds: ["daydream", "future", "sad-doggo"],
  ownedFrameIds: ["little-puppy", "happy-holiday"],
  unlockedChapterIds: ["chapter-1"],
  unlockedVrIds: ["vr-1"],
  recordings: mockRecordings,
  episodesCompleted: ["ep-1"],
  badgesObtained: ["badge-1", "badge-3", "badge-4", "badge-6"],
  peerFeedbackEntries: [
    {
      id: "feedback-1",
      postId: "post-1",
      authorName: "Jane Doe",
      authorAvatarId: "daydream",
      ratings: {
        structure: 5,
        fluency: 4,
        conciseness: 4,
        criticalThinking: 5,
        confidence: 5,
      },
      comment: "Looks good to me, need to work on your fluency and conciseness though.",
      likes: 5,
      dislikes: 0,
      createdAt: "2026-05-17T08:20:00.000Z",
    },
    {
      id: "feedback-2",
      postId: "post-1",
      authorName: "Jill Doe",
      authorAvatarId: "hmph",
      ratings: {
        structure: 5,
        fluency: 5,
        conciseness: 5,
        criticalThinking: 5,
        confidence: 5,
      },
      comment: "Good work!",
      likes: 3,
      dislikes: 0,
      createdAt: "2026-05-17T07:10:00.000Z",
    },
  ],
};

const listeners = new Set<(data: MockUserData) => void>();

export const getMockUserData = () => mockUserData;

export const updateMockUserData = (patch: Partial<MockUserData>) => {
  mockUserData = {
    ...mockUserData,
    ...patch,
    profile: {
      ...mockUserData.profile,
      ...patch.profile,
    },
  };
  listeners.forEach((listener) => listener(mockUserData));
};

export const subscribeToMockUser = (listener: (data: MockUserData) => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

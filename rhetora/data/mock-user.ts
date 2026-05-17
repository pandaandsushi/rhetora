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

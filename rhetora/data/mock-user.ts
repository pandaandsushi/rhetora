export type Recording = {
  id: string;
  title: string;
  dateLabel: string;
  mode: string;
  thumbnail?: any;
  hasVideo?: boolean;
};

export type PeerFeedbackPost = {
  id: string;
  avatarId: string;
  frameId?: string;
  name: string;
  hideName?: boolean;
  titleId: string;
  message: string;
  tag: "storymode" | "fillerfree" | "pitchlab" | "storytellingpractice";
  dateLabel: string;
  feedbackVisible: boolean;
  isMine?: boolean;
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
  peerFeedbackPosts: PeerFeedbackPost[];
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
    thumbnail: require("../assets/images/storymode/maelle.png"),
    hasVideo: true,
  },
  {
    id: "rec-2",
    title: "Recording 2026-05-03",
    dateLabel: "2026-05-03",
    mode: "Story Mode",
    thumbnail: require("../assets/images/storymode/maelle.png"),
    hasVideo: true,
  },
  {
    id: "rec-3",
    title: "Recording 2026-05-01",
    dateLabel: "2026-05-01",
    mode: "The Pitch Lab",
    thumbnail: require("../assets/images/logorhetoraonly.png"),
    hasVideo: false,
  },
  {
    id: "rec-4",
    title: "Recording 2026-04-28",
    dateLabel: "2026-04-28",
    mode: "Filler-Free",
    thumbnail: require("../assets/images/logorhetoraonly.png"),
    hasVideo: false,
  },
  {
    id: "rec-5",
    title: "Recording 2026-04-25",
    dateLabel: "2026-04-25",
    mode: "Storytelling Practice",
    thumbnail: require("../assets/images/logorhetoraonly.png"),
    hasVideo: false,
  },
  {
    id: "rec-6",
    title: "Recording 2026-04-20",
    dateLabel: "2026-04-20",
    mode: "VR Mode",
    thumbnail: require("../assets/images/vr/podium.png"),
    hasVideo: true,
  },
  {
    id: "rec-7",
    title: "Recording 2026-04-18",
    dateLabel: "2026-04-18",
    mode: "The Pitch Lab",
    thumbnail: require("../assets/images/logorhetoraonly.png"),
    hasVideo: false,
  },
  {
    id: "rec-8",
    title: "Recording 2026-04-15",
    dateLabel: "2026-04-15",
    mode: "Filler-Free",
    thumbnail: require("../assets/images/logorhetoraonly.png"),
    hasVideo: false,
  },
];

const mockFeedbackPosts: PeerFeedbackPost[] = [
  {
    id: "post-1",
    avatarId: "hmph",
    frameId: "little-puppy",
    name: "Jesse Doe",
    hideName: true,
    titleId: "sweet-victory-winter-2026",
    message: "Hi, this is my result for practicing Filler-Free today! What do you guys think?",
    tag: "fillerfree",
    dateLabel: "May 17, 2026",
    feedbackVisible: false,
  },
  {
    id: "post-2",
    avatarId: "future",
    frameId: "happy-holiday",
    name: "Jenna Rose",
    hideName: true,
    titleId: "real-life-scenario",
    message: "Practicing story mode. Feedback is welcome!",
    tag: "storymode",
    dateLabel: "May 16, 2026",
    feedbackVisible: true,
  },
  {
    id: "post-3",
    avatarId: "sad-doggo",
    frameId: "little-puppy",
    name: "You",
    hideName: false,
    titleId: "sweet-victory-winter-2026",
    message: "Hi everyone! This is my first time trying story mode. Feel free to give me feedback. Please be kind and thank you!",
    tag: "storymode",
    dateLabel: "May 15, 2026",
    feedbackVisible: true,
    isMine: true,
  },
];

let mockUserData: MockUserData = {
  profile: {
    fullName: "John Doe",
    email: "john@rhetora.com",
    password: "password",
  },
  coins: 240,
  leaderboardRank: 10,
  streakDays: 9,
  equippedAvatarId: "sad-doggo",
  equippedFrameId: "little-puppy",
  equippedTitleId: "sweet-victory-spring-2026",
  ownedAvatarIds: ["daydream", "future", "sad-doggo"],
  ownedFrameIds: ["little-puppy", "happy-holiday"],
  unlockedChapterIds: ["chapter-1"],
  unlockedVrIds: [],
  recordings: mockRecordings,
  episodesCompleted: ["ep-1"],
  badgesObtained: ["badge-1", "badge-3", "badge-4", "badge-6"],
  peerFeedbackPosts: mockFeedbackPosts,
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
      likes: 1,
      dislikes: 4,
      createdAt: "2026-05-17T07:10:00.000Z",
    },
    {
      id: "feedback-3",
      postId: "post-3",
      authorName: "Jill Doe",
      authorAvatarId: "hmph",
      ratings: {
        structure: 5,
        fluency: 5,
        conciseness: 5,
        criticalThinking: 5,
        confidence: 5,
      },
      comment: "Good work! I think you can be more confident and speak louder to make it better.",
      likes: 3,
      dislikes: 0,
      createdAt: "2026-05-17T07:10:00.000Z",
    },
    {
      id: "feedback-4",
      postId: "post-3",
      authorName: "Anne",
      authorAvatarId: "hmph",
      ratings: {
        structure: 5,
        fluency: 5,
        conciseness: 5,
        criticalThinking: 5,
        confidence: 5,
      },
      comment: "Cool, need some improvement on your confidence but overall good job for your first time!",
      likes: 3,
      dislikes: 0,
      createdAt: "2026-05-17T07:10:00.000Z",
    }
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

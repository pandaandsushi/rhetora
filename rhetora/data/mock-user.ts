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
  timePractice: TimePracticeData;
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

export type TimePracticePoint = {
  label: string;
  minutes: number;
};

export type TimePracticeRange = {
  id: string;
  label: string;
  points: TimePracticePoint[];
  overview: string[];
};

export type TimePracticeData = {
  dailyRanges: TimePracticeRange[];
  weeklyRanges: TimePracticeRange[];
  monthlyRanges: TimePracticeRange[];
  yearlyRanges: TimePracticeRange[];
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
    feedbackVisible: true,
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
    feedbackVisible: false,
    isMine: true,
  },
];

const mockTimePractice: TimePracticeData = {
  dailyRanges: [
    {
      id: "daily-1",
      label: "21 May 2024 to 29 Aug 2024",
      points: [
        { label: "21/05", minutes: 6 },
        { label: "22/05", minutes: 14 },
        { label: "23/05", minutes: 12 },
        { label: "24/05", minutes: 8 },
        { label: "25/05", minutes: 11 },
        { label: "26/05", minutes: 7 },
        { label: "27/05", minutes: 13 },
      ],
      overview: [
        "Overall time practice has increased by an average of 5% daily.",
      ],
    },
    {
      id: "daily-2",
      label: "01 Apr 2024 to 20 May 2024",
      points: [
        { label: "01/04", minutes: 9 },
        { label: "05/04", minutes: 7 },
        { label: "09/04", minutes: 11 },
        { label: "13/04", minutes: 6 },
        { label: "17/04", minutes: 10 },
        { label: "21/04", minutes: 8 },
        { label: "25/04", minutes: 12 },
      ],
      overview: [
        "Consistency dipped mid-month but rebounded in the last week.",
      ],
    },
  ],
  weeklyRanges: [
    {
      id: "weekly-1",
      label: "6 Nov 2022 - 12 Nov 2022",
      points: [
        { label: "W1", minutes: 52 },
        { label: "W2", minutes: 44 },
        { label: "W3", minutes: 58 },
        { label: "W4", minutes: 61 },
      ],
      overview: [
        "Weekly practice time is trending upward overall.",
      ],
    },
    {
      id: "weekly-2",
      label: "13 Nov 2022 - 19 Nov 2022",
      points: [
        { label: "W1", minutes: 40 },
        { label: "W2", minutes: 48 },
        { label: "W3", minutes: 45 },
        { label: "W4", minutes: 54 },
      ],
      overview: [
        "Mid-week improvements lifted the overall average.",
      ],
    },
  ],
  monthlyRanges: [
    {
      id: "monthly-2023-01",
      label: "Jan 2023",
      points: [
        { label: "01", minutes: 12 },
        { label: "05", minutes: 16 },
        { label: "10", minutes: 14 },
        { label: "15", minutes: 18 },
        { label: "20", minutes: 13 },
        { label: "25", minutes: 19 },
        { label: "30", minutes: 17 },
      ],
      overview: [
        "Practice time remained steady with slight growth in the last week.",
      ],
    },
    {
      id: "monthly-2023-02",
      label: "Feb 2023",
      points: [
        { label: "02", minutes: 10 },
        { label: "06", minutes: 13 },
        { label: "10", minutes: 12 },
        { label: "14", minutes: 16 },
        { label: "18", minutes: 15 },
        { label: "22", minutes: 14 },
        { label: "26", minutes: 18 },
      ],
      overview: [
        "Week three showed the highest total for the month.",
      ],
    },
    {
      id: "monthly-2023-03",
      label: "Mar 2023",
      points: [
        { label: "03", minutes: 14 },
        { label: "07", minutes: 15 },
        { label: "11", minutes: 13 },
        { label: "15", minutes: 17 },
        { label: "19", minutes: 16 },
        { label: "23", minutes: 15 },
        { label: "27", minutes: 18 },
      ],
      overview: [
        "Consistent mid-month performance keeps averages stable.",
      ],
    },
    {
      id: "monthly-2023-04",
      label: "Apr 2023",
      points: [
        { label: "02", minutes: 11 },
        { label: "06", minutes: 13 },
        { label: "10", minutes: 12 },
        { label: "14", minutes: 15 },
        { label: "18", minutes: 14 },
        { label: "22", minutes: 16 },
        { label: "26", minutes: 17 },
      ],
      overview: [
        "Late April saw a small uptick in practice time.",
      ],
    },
    {
      id: "monthly-2023-05",
      label: "May 2023",
      points: [
        { label: "01", minutes: 13 },
        { label: "05", minutes: 16 },
        { label: "09", minutes: 15 },
        { label: "13", minutes: 17 },
        { label: "17", minutes: 16 },
        { label: "21", minutes: 18 },
        { label: "25", minutes: 19 },
      ],
      overview: [
        "May delivered the strongest overall growth so far.",
      ],
    },
    {
      id: "monthly-2023-06",
      label: "Jun 2023",
      points: [
        { label: "02", minutes: 12 },
        { label: "06", minutes: 14 },
        { label: "10", minutes: 13 },
        { label: "14", minutes: 15 },
        { label: "18", minutes: 14 },
        { label: "22", minutes: 16 },
        { label: "26", minutes: 15 },
      ],
      overview: [
        "Performance stayed balanced across the month.",
      ],
    },
    {
      id: "monthly-2023-07",
      label: "Jul 2023",
      points: [
        { label: "03", minutes: 14 },
        { label: "07", minutes: 17 },
        { label: "11", minutes: 16 },
        { label: "15", minutes: 18 },
        { label: "19", minutes: 15 },
        { label: "23", minutes: 19 },
        { label: "27", minutes: 20 },
      ],
      overview: [
        "July closed with the highest session streaks.",
      ],
    },
    {
      id: "monthly-2023-08",
      label: "Aug 2023",
      points: [
        { label: "01", minutes: 13 },
        { label: "05", minutes: 14 },
        { label: "09", minutes: 12 },
        { label: "13", minutes: 15 },
        { label: "17", minutes: 16 },
        { label: "21", minutes: 14 },
        { label: "25", minutes: 17 },
      ],
      overview: [
        "Mid-month surge lifted August averages.",
      ],
    },
    {
      id: "monthly-2023-09",
      label: "Sep 2023",
      points: [
        { label: "02", minutes: 12 },
        { label: "06", minutes: 13 },
        { label: "10", minutes: 12 },
        { label: "14", minutes: 14 },
        { label: "18", minutes: 13 },
        { label: "22", minutes: 15 },
        { label: "26", minutes: 16 },
      ],
      overview: [
        "September stabilized with steady pacing.",
      ],
    },
    {
      id: "monthly-2023-10",
      label: "Oct 2023",
      points: [
        { label: "01", minutes: 15 },
        { label: "05", minutes: 16 },
        { label: "09", minutes: 17 },
        { label: "13", minutes: 18 },
        { label: "17", minutes: 16 },
        { label: "21", minutes: 19 },
        { label: "25", minutes: 20 },
      ],
      overview: [
        "October shows strong momentum across sessions.",
      ],
    },
    {
      id: "monthly-2023-11",
      label: "Nov 2023",
      points: [
        { label: "02", minutes: 14 },
        { label: "06", minutes: 16 },
        { label: "10", minutes: 15 },
        { label: "14", minutes: 17 },
        { label: "18", minutes: 16 },
        { label: "22", minutes: 18 },
        { label: "26", minutes: 19 },
      ],
      overview: [
        "Practice time remains consistent into November.",
      ],
    },
    {
      id: "monthly-2023-12",
      label: "Dec 2023",
      points: [
        { label: "03", minutes: 16 },
        { label: "07", minutes: 18 },
        { label: "11", minutes: 17 },
        { label: "15", minutes: 19 },
        { label: "19", minutes: 18 },
        { label: "23", minutes: 20 },
        { label: "27", minutes: 21 },
      ],
      overview: [
        "December closes with the highest overall month.",
      ],
    },
  ],
  yearlyRanges: [
    {
      id: "yearly-2021",
      label: "2021",
      points: [
        { label: "Jan", minutes: 160 },
        { label: "Feb", minutes: 170 },
        { label: "Mar", minutes: 180 },
        { label: "Apr", minutes: 190 },
        { label: "May", minutes: 200 },
        { label: "Jun", minutes: 210 },
        { label: "Jul", minutes: 205 },
        { label: "Aug", minutes: 215 },
        { label: "Sep", minutes: 220 },
        { label: "Oct", minutes: 225 },
        { label: "Nov", minutes: 230 },
        { label: "Dec", minutes: 240 },
      ],
      overview: [
        "Year-over-year progress increased steadily across 2021.",
      ],
    },
    {
      id: "yearly-2022",
      label: "2022",
      points: [
        { label: "Jan", minutes: 180 },
        { label: "Feb", minutes: 190 },
        { label: "Mar", minutes: 200 },
        { label: "Apr", minutes: 210 },
        { label: "May", minutes: 220 },
        { label: "Jun", minutes: 230 },
        { label: "Jul", minutes: 225 },
        { label: "Aug", minutes: 235 },
        { label: "Sep", minutes: 240 },
        { label: "Oct", minutes: 250 },
        { label: "Nov", minutes: 255 },
        { label: "Dec", minutes: 265 },
      ],
      overview: [
        "2022 maintained steady growth with a strong Q4.",
      ],
    },
    {
      id: "yearly-2023",
      label: "2023",
      points: [
        { label: "Jan", minutes: 200 },
        { label: "Feb", minutes: 210 },
        { label: "Mar", minutes: 220 },
        { label: "Apr", minutes: 230 },
        { label: "May", minutes: 240 },
        { label: "Jun", minutes: 250 },
        { label: "Jul", minutes: 245 },
        { label: "Aug", minutes: 255 },
        { label: "Sep", minutes: 260 },
        { label: "Oct", minutes: 270 },
        { label: "Nov", minutes: 280 },
        { label: "Dec", minutes: 290 },
      ],
      overview: [
        "2023 shows the strongest pace so far.",
      ],
    },
    {
      id: "yearly-2024",
      label: "2024",
      points: [
        { label: "Jan", minutes: 210 },
        { label: "Feb", minutes: 220 },
        { label: "Mar", minutes: 230 },
        { label: "Apr", minutes: 240 },
        { label: "May", minutes: 250 },
        { label: "Jun", minutes: 260 },
        { label: "Jul", minutes: 255 },
        { label: "Aug", minutes: 265 },
        { label: "Sep", minutes: 270 },
        { label: "Oct", minutes: 275 },
        { label: "Nov", minutes: 280 },
        { label: "Dec", minutes: 285 },
      ],
      overview: [
        "2024 kept momentum, with a small cooldown in Q4.",
      ],
    },
  ],
};

let mockUserData: MockUserData = {
  profile: {
    fullName: "John Doe",
    email: "john@rhetora.com",
    password: "password",
  },
  coins: 2000,
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
      likes: 3,
      dislikes: 0,
      createdAt: "2026-05-17T07:10:00.000Z",
    },
  ],
  timePractice: mockTimePractice,
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

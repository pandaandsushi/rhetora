export type TitleItem = {
  id: string;
  label: string;
  illustration: any;
  gradientColors: [string, string];
  textColor: string;
  borderColor: string;
  requirements: string;
};

export const titleList: TitleItem[] = [
  {
    id: "sweet-victory-spring-2026",
    label: "Sweet Victory \n Spring 2026",
    illustration: require("../assets/images/title/1.png"),
    gradientColors: ["#94f1a6", "#fffbb9"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Top 3 in leaderboard Spring 2026",
  },
  {
    id: "sweet-victory-summer-2026",
    label: "Sweet Victory \n Summer 2026",
    illustration: require("../assets/images/title/1.png"),
    gradientColors: ["#ffc66a", "#ff946d"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Top 3 in leaderboard Summer 2026",
  },
  {
    id: "sweet-victory-autumn-2026",
    label: "Sweet Victory \n Autumn 2026",
    illustration: require("../assets/images/title/1.png"),
    gradientColors: ["#bb5446", "#ff623f"],
    textColor: "#ffffff",
    borderColor: "#000000",
    requirements: "Top 3 in leaderboard Autumn 2026",
  },
  {
    id: "sweet-victory-winter-2026",
    label: "Sweet Victory \n Winter 2026",
    illustration: require("../assets/images/title/1.png"),
    gradientColors: ["#aae7ff", "#76caff"],
    textColor: "#000000",
    borderColor: "#000000",
    requirements: "Top 3 in leaderboard Winter 2026",
  },
  {
    id: "real-life-scenario",
    label: "Real-life Scenario",
    illustration: require("../assets/images/title/2.png"),
    gradientColors: ["#E9C8FF", "#C68EFF"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete 1 VR Mode exercise",
  },
  {
    id: "im-focused",
    label: "I'm Focused",
    illustration: require("../assets/images/title/3.png"),
    gradientColors: ["#FFD9DC", "#F7AEB5"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete at least 1 Challenge in a day, 7 days in a row",
  },
  {
    id: "im-a-star",
    label: "I'm a star",
    illustration: require("../assets/images/title/4.png"),
    gradientColors: ["#FFF8A6", "#F3E97B"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Finish Daily Challenges 50 times",
  },
  {
    id: "professional",
    label: "Professional",
    illustration: require("../assets/images/title/5.png"),
    gradientColors: ["#E4E8F8", "#C9CDF4"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete 10 Story Mode exercises",
  },
  {
    id: "future-of-ai",
    label: "Future of AI",
    illustration: require("../assets/images/title/6.png"),
    gradientColors: ["#EACBFF", "#E6B7DC"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete 20 VR Mode exercises",
  },
  {
    id: "full-of-ideas",
    label: "Full of Ideas",
    illustration: require("../assets/images/title/7.png"),
    gradientColors: ["#FFC58F", "#F3AE74"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete 15 Storytelling Mode exercises",
  },
  {
    id: "dazzling-speaker",
    label: "Dazzling Speaker",
    illustration: require("../assets/images/title/8.png"),
    gradientColors: ["#F6C5F4", "#E27BE3"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete 100 exercises",
  },
  {
    id: "super-focused",
    label: "Super Focused",
    illustration: require("../assets/images/title/3.png"),
    gradientColors: ["#FFD9DC", "#F7AEB5"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Complete All 6 Challenges in a day, 7 days in a row",
  },
  {
    id: "streak-master",
    label: "Streak Master",
    illustration: require("../assets/images/title/9.png"),
    gradientColors: ["#ffedcb", "#fabe9d"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Reach 20 days streak",
  },
  {
    id: "super-streak-master",
    label: "Super Streak Master",
    illustration: require("../assets/images/title/9.png"),
    gradientColors: ["#ffffff", "#f6d37a"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
    requirements: "Reach 100 days streak",
  }
];

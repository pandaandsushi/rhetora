export type TitleItem = {
  id: string;
  label: string;
  illustration: any;
  gradientColors: [string, string];
  textColor: string;
  borderColor: string;
};

export const titleList: TitleItem[] = [
  {
    id: "sweet-victory",
    label: "Sweet Victory",
    illustration: require("../assets/images/title/1.png"),
    gradientColors: ["#FFE66D", "#FFB53F"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "real-life-scenario",
    label: "Real-life Scenario",
    illustration: require("../assets/images/title/2.png"),
    gradientColors: ["#E9C8FF", "#C68EFF"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "im-focused",
    label: "I'm Focused",
    illustration: require("../assets/images/title/3.png"),
    gradientColors: ["#FFD9DC", "#F7AEB5"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "im-a-star",
    label: "I'm a star",
    illustration: require("../assets/images/title/4.png"),
    gradientColors: ["#FFF8A6", "#F3E97B"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "professional",
    label: "Professional",
    illustration: require("../assets/images/title/5.png"),
    gradientColors: ["#E4E8F8", "#C9CDF4"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "future-of-ai",
    label: "Future of AI",
    illustration: require("../assets/images/title/6.png"),
    gradientColors: ["#EACBFF", "#E6B7DC"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "full-of-ideas",
    label: "Full of Ideas",
    illustration: require("../assets/images/title/7.png"),
    gradientColors: ["#FFC58F", "#F3AE74"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
  {
    id: "dazzling-speaker",
    label: "Dazzling Speaker",
    illustration: require("../assets/images/title/8.png"),
    gradientColors: ["#F6C5F4", "#E27BE3"],
    textColor: "#1B1B1B",
    borderColor: "#000000",
  },
];

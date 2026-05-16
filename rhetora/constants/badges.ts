export type BadgeItem = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
};

export const badgeList: BadgeItem[] = [
  {
    id: "badge-1",
    title: "Learn Everyday",
    subtitle: "Reached 5 day streak",
    image: require("../assets/images/badge/1.png"),
  },
  {
    id: "badge-2",
    title: "Grow Positive",
    subtitle: "Stay positive daily",
    image: require("../assets/images/badge/2.png"),
  },
  {
    id: "badge-3",
    title: "You Can Do This",
    subtitle: "Finish 20 challenges",
    image: require("../assets/images/badge/3.png"),
  },
  {
    id: "badge-4",
    title: "Inspiration",
    subtitle: "Give feedback 30 times",
    image: require("../assets/images/badge/4.png"),
  },
  {
    id: "badge-5",
    title: "Time to Focus",
    subtitle: "Finish 5 challenges",
    image: require("../assets/images/badge/5.png"),
  },
  {
    id: "badge-6",
    title: "Keep It Up",
    subtitle: "Finish 100 challenges",
    image: require("../assets/images/badge/6.png"),
  },
  {
    id: "badge-7",
    title: "Easy Does It",
    subtitle: "Do 50 exercises",
    image: require("../assets/images/badge/7.png"),
  },
  {
    id: "badge-8",
    title: "Follow the Fun",
    subtitle: "Purchase 2 items in the shop",
    image: require("../assets/images/badge/8.png"),
  },
  {
    id: "badge-9",
    title: "Don't Be Late",
    subtitle: "Stay on time",
    image: require("../assets/images/badge/9.png"),
  },
  {
    id: "badge-10",
    title: "Motivate",
    subtitle: "Give feedback 3 times",
    image: require("../assets/images/badge/10.png"),
  },
];

let selectedBadgeIds = ["badge-1", "badge-3", "badge-4", "badge-6"];
const listeners = new Set<() => void>();

export const getSelectedBadgeIds = () => selectedBadgeIds;

export const setSelectedBadgeIds = (next: string[]) => {
  selectedBadgeIds = next;
  listeners.forEach((listener) => listener());
};

export const subscribeToBadgeSelection = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

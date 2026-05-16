export type AvatarItem = {
  id: string;
  title: string;
  description: string;
  image: any;
};

export const avatarList: AvatarItem[] = [
  {
    id: "daydream",
    title: "Daydream",
    description: "Daydreaming about my future...",
    image: require("../assets/images/avatar/av-dream.png"),
  },
  {
    id: "future",
    title: "Future",
    description: "Gazing into the future with confidence.",
    image: require("../assets/images/avatar/av-sport.png"),
  },
  {
    id: "sad-doggo",
    title: "Sad Doggo",
    description: "A loyal pup on a thoughtful day.",
    image: require("../assets/images/avatar/av-doggo.png"),
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Lost in a good book and new ideas.",
    image: require("../assets/images/avatar/av-bookworm.png"),
  },
  {
    id: "kitties",
    title: "KITTIES!",
    description: "Surrounded by curious, playful cats.",
    image: require("../assets/images/avatar/av-kitties.png"),
  },
  {
    id: "readyyy",
    title: "Readyyy",
    description: "Ready to speak up and shine.",
    image: require("../assets/images/avatar/av-ready.png"),
  },
  {
    id: "hmph",
    title: "Hmph",
    description: "Braving the cold with a cool attitude.",
    image: require("../assets/images/avatar/av-cold.png"),
  },
  {
    id: "chill-guy",
    title: "Chill Guy",
    description: "Relaxed, calm, and ready to go.",
    image: require("../assets/images/avatar/av-coffe.png"),
  },
];

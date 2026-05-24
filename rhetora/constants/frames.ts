export type FrameItem = {
  id: string;
  title: string;
  description: string;
  image: any;
};

export const frameList: FrameItem[] = [
  {
    id: "little-puppy",
    title: "Little Puppy",
    description: "The little puppy loves to play together with his friends",
    image: require("../assets/images/frame/frame-8.png"),
  },
  {
    id: "elegant-lotus",
    title: "Elegant Lotus",
    description: "A graceful lotus frame for calm moments.",
    image: require("../assets/images/frame/frame-5.png"),
  },
  {
    id: "happy-holiday",
    title: "Happy Holiday",
    description: "Celebrate the season with warm cheer.",
    image: require("../assets/images/frame/frame-3.png"),
  },
  {
    id: "rose-garden",
    title: "Rose Garden",
    description: "A gentle rose garden full of warmth.",
    image: require("../assets/images/frame/frame-2.png"),
  },
  {
    id: "botanica",
    title: "Botanica",
    description: "Nature's greens to keep you grounded.",
    image: require("../assets/images/frame/frame-3.png"),
  },
  {
    id: "under-the-sea",
    title: "Under the Sea",
    description: "Dive into a playful underwater world.",
    image: require("../assets/images/frame/frame-4.png"),
  },
  {
    id: "mitstletoe",
    title: "Mistletoe",
    description: "Holiday wishes under the mistletoe.",
    image: require("../assets/images/frame/frame-6.png"),
  },
  {
    id: "bunni",
    title: "Bunni",
    description: "A cute bunny frame for playful moments.",
    image: require("../assets/images/frame/frame-7.png"),
  },
];

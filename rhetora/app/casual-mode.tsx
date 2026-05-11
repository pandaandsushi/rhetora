import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NavBar from "../components/nav-bar";
import TopHeader from "../components/top-header";
import { Colors } from "../constants/colors";

type Tag = {
  label: string;
  color: string;
};

type PracticeCard = {
  title: string;
  description: string;
  image: any;
  tags: Tag[];
  route: string;
};

const cards: PracticeCard[] = [
  {
    title: "Storytelling Practice",
    description: "Tell a short story with a clear\nbeginning, middle, and end.",
    image: require("../assets/images/casualmode/storytelling-practice.png"),
    route: "/storytelling-practice",
    tags: [
      { label: "Fluency", color: Colors.turquoise[300] },
      { label: "Structure", color: Colors.senary[300] },
      { label: "Critical Thinking", color: Colors.success[500] },
    ],
  },
  {
    title: "The Pitch Lab",
    description: "Deliver a short pitch that is\nclear, structured, & persuasive.",
    image: require("../assets/images/casualmode/the-pitch-lab.png"),
    route: "/pitch-lab",
    tags: [
      { label: "Confidence", color: Colors.blue[300] },
      { label: "Structure", color: Colors.senary[300] },
      { label: "Conciseness", color: Colors.warning[400] },
    ],
  },
  {
    title: "Filler-Free",
    description: 'Reduce your use of "um", "uh",\nand other filler words.',
    image: require("../assets/images/casualmode/filler-free.png"),
    route: "/filler-free",
    tags: [
      { label: "Confidence", color: Colors.blue[300] },
      { label: "Fluency", color: Colors.turquoise[300] },
      { label: "Filler Words", color: Colors.success[500] },
    ],
  },
];

export default function CasualMode() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.topSafeArea}>
        <TopHeader 
          title="Casual Mode"
          variant="solid" 
          onBack={() => router.back()} 
        />
      </SafeAreaView>

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {cards.map((card) => (
            <Pressable
              key={card.title}
              style={styles.card}
              onPress={() => router.push(card.route as any)}
            >
              <ImageBackground
                source={require("../assets/images/casualmode/casual-mode-bg.png")}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
                resizeMode="cover"
              >
                <View style={styles.imageContainer}>
                  <Image source={card.image} style={styles.cardImage} />
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>

                  <View style={styles.tagRow}>
                    {card.tags.map((tag) => (
                      <View
                        key={tag.label}
                        style={[
                          styles.tagPill,
                          { borderColor: tag.color },
                        ]}
                      >
                        <Text style={[styles.tagText, { color: tag.color }]}>
                          {tag.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.navBarWrap}>
          <NavBar activeKey="practice" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  topSafeArea: {
    backgroundColor: Colors.senary[300],
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.shade[200],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.octonary.DEFAULT,
    overflow: "hidden",
  },
  cardBackground: {
    flexDirection: "row",
    minHeight: 140,
  },
  cardBackgroundImage: {
    borderRadius: 10,
  },
  imageContainer: {
    width: 120,
    justifyContent: "flex-end",
  },
  cardImage: {
    width: "100%",
  },
  cardBody: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 12,
  },
  cardTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  cardDescription: {
    marginTop: 4,
    fontFamily: "AlbertSans-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: Colors.octonary.DEFAULT,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: Colors.shade[200],
  },
  tagText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 11,
  },
  navBarWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
  },
});
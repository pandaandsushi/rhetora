import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopHeader from "../components/top-header";

import PracticeCameraPanel from "../components/practice-camera-panel";
import { Colors } from "../constants/colors";

const bgImage = require("../assets/images/bg-motif.png");
const heroImage = require("../assets/images/casualmode/storytelling-practice.png");
const logoRhetora = require("../assets/images/logorhetora.png");

const tutorialSteps = [
  "Once you're ready, start the session and the AI will provide the opening of a story. Take your time to read it and understand the context.",
  "Start speaking and continue the story in your own way. You'll have a limited time to respond, so focus on keeping your ideas clear and flowing.",
  "Don't worry about making it perfect--just keep the story going.",
];

const genres = [
  { key: "horror", label: "Horror 👻", color: Colors.neutral[600] },
  { key: "fantasy", label: "Fantasy 🔮", color: Colors.additional.purple },
  { key: "scifi", label: "Sci-Fi 🧪", color: Colors.turquoise[300] },
  { key: "mystery", label: "Mystery 🔎", color: Colors.warning[700] },
  { key: "romance", label: "Romance 💖", color: Colors.pink[300] },
  { key: "slice", label: "Slice of Life 🎈", color: Colors.warning[500] },
];

export default function StorytellingPractice() {
  const router = useRouter();
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [tutorialCollapsed, setTutorialCollapsed] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("fantasy");
  const [skipTutorial, setSkipTutorial] = useState(false);

  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("10");
  const [seconds, setSeconds] = useState("00");

  const activeStep = useMemo(() => tutorialSteps[tutorialIndex], [tutorialIndex]);

  const activeGenreColor = useMemo(() => 
    genres.find(g => g.key === selectedGenre)?.color || Colors.additional.purple, 
  [selectedGenre]);

  const handleNextTutorial = () => {
    if (tutorialIndex >= tutorialSteps.length - 1) {
      setTutorialVisible(false);
      return;
    }
    setTutorialIndex((prev) => prev + 1);
  };

  const handleDefaultTime = () => {
    setHours("00");
    setMinutes("10");
    setSeconds("00");
  };

  const handleStart = () => {
    router.push({
      pathname: "/storytelling-session",
      params: {
        genre: selectedGenre,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        totalDuration: `${hours}:${minutes}:${seconds}`
      },
    });
  };

  return (
    <ImageBackground source={bgImage} style={styles.screen} resizeMode="cover">
      <TopHeader
        title="Storytelling Practice"
        variant="transparent"
        onBack={() => router.back()}
        rightElement={(
          <Pressable
            style={styles.infoButton}
            onPress={() => {
              setTutorialVisible(true);
              setTutorialIndex(0);
            }}
          >
            <Ionicons name="information" size={18} color={Colors.shade[200]} />
          </Pressable>
        )}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <Text style={styles.heroText}>
            Tell a short story with a clear beginning, middle, and end.
          </Text>
        </View>

        <PracticeCameraPanel showStatus placeholder={
          <Image
            source={logoRhetora}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
        } />

        <Pressable
          style={styles.tutorialCard}
          onPress={() => setTutorialCollapsed((prev) => !prev)}
        >
          <View style={styles.tutorialHeader}>
            <Text style={styles.tutorialTitle}>How to Tutorial</Text>
            <Ionicons
              name={tutorialCollapsed ? "chevron-down" : "chevron-up"}
              size={20}
              color={Colors.octonary.DEFAULT}
            />
          </View>
          {!tutorialCollapsed && (
            <View style={styles.tutorialBody}>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>We'll start the story for you</Text>
              </View>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  Take a moment to read it, then continue the story in your own words
                </Text>
              </View>
              <View style={styles.tutorialBulletRow}>
                <Text style={styles.tutorialBullet}>•</Text>
                <Text style={styles.tutorialText}>
                  Try to build the story until the timer's running out.
                </Text>
              </View>
            </View>
          )}
        </Pressable>

        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>Speaking Time</Text>
          <Pressable style={styles.timerDefault} onPress={handleDefaultTime}>
            <Ionicons name="refresh" size={16} color={Colors.octonary.DEFAULT} />
            <Text style={styles.timerDefaultText}>Default</Text>
          </Pressable>
        </View>

        <View style={styles.timeInputs}>
          <View style={styles.timeBoxWrap}>
            <View style={styles.timeBox}>
              <TextInput
                style={styles.timeValue}
                value={hours}
                onChangeText={setHours}
                keyboardType="numeric"
                maxLength={2}
                selectTextOnFocus
              />
            </View>
            <Text style={styles.timeDivider}>:</Text>
          </View>

          <View style={styles.timeBoxWrap}>
            <View style={styles.timeBox}>
              <TextInput
                style={styles.timeValue}
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="numeric"
                maxLength={2}
                selectTextOnFocus
              />
            </View>
            <Text style={styles.timeDivider}>:</Text>
          </View>

          <View style={styles.timeBoxWrap}>
            <View style={styles.timeBox}>
              <TextInput
                style={styles.timeValue}
                value={seconds}
                onChangeText={setSeconds}
                keyboardType="numeric"
                maxLength={2}
                selectTextOnFocus
              />
            </View>
          </View>
        </View>

        <Text style={styles.genreLabel}>Select Genre</Text>
        <View style={styles.genreWrap}>
          {genres.map((genre) => {
            const isActive = selectedGenre === genre.key;
            return (
              <Pressable
                key={genre.key}
                style={[
                  styles.genreChip, 
                  isActive && { backgroundColor: genre.color, borderColor: genre.color }
                ]}
                onPress={() => setSelectedGenre(genre.key)}
              >
                <Text style={[styles.genreText, isActive && styles.genreTextActive]}>
                  {genre.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
        
        <Text style={styles.disclaimerText}>
          Result will be saved and can be viewed in{" "}
          <Text style={styles.disclaimerBold}>My Recordings</Text>
        </Text>
      </ScrollView>

      {tutorialVisible && (
        <View style={styles.tutorialOverlay}>
          <View style={styles.tutorialModal}>
            <Pressable
              style={styles.tutorialClose}
              onPress={() => setTutorialVisible(false)}
            >
              <Ionicons name="close" size={20} color={Colors.octonary.DEFAULT} />
            </Pressable>
            <Image source={heroImage} style={styles.tutorialImage} />
            <Text style={styles.tutorialModalTitle}>Storytelling Practice</Text>
            <Text style={styles.tutorialModalText}>{activeStep}</Text>

            <View style={styles.tutorialDots}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[styles.tutorialDot, index === tutorialIndex && styles.tutorialDotActive]}
                />
              ))}
            </View>

            <Pressable
              style={styles.tutorialCheckbox}
              onPress={() => setSkipTutorial((prev) => !prev)}
            >
              <View style={styles.checkboxBox}>
                {skipTutorial && (
                  <Ionicons name="checkmark" size={16} color={Colors.octonary.DEFAULT} />
                )}
              </View>
              <Text style={styles.checkboxText}>Don't show this again</Text>
            </Pressable>

            <Pressable style={styles.tutorialNext} onPress={handleNextTutorial}>
              <Text style={styles.tutorialNextText}>
                {tutorialIndex === tutorialSteps.length - 1 ? "Done" : "Next"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.shade[200],
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    gap: 18,
  },
  infoButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.octonary.DEFAULT,
  },
  heroRow: {
    alignItems: "center",
    gap: 16,
  },
  heroText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 15,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 22,
  },
  tutorialCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
    padding: 16,
  },
  tutorialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tutorialTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  tutorialBody: {
    marginTop: 12,
    gap: 10,
  },
  tutorialBulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  tutorialBullet: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  tutorialText: {
    flex: 1,
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    lineHeight: 20,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timerLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
  },
  timerDefault: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerDefaultText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeBoxWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeBox: {
    width: 64,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
    textAlign: "center",
    width: "100%",
  },
  timeDivider: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: Colors.senary[300],
    marginHorizontal: 4,
  },
  genreLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: Colors.octonary.DEFAULT,
    marginTop: 6,
  },
  genreWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.quinary[300],
    backgroundColor: Colors.shade[200],
  },
  genreText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  genreTextActive: {
    color: Colors.shade[200],
  },
  startButton: {
    marginTop: 4,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
  disclaimerText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 12,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    marginBottom: 40,
  },
  disclaimerBold: {
    fontFamily: "AlbertSans-Bold",
  },
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  tutorialModal: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.shade[200],
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 14,
  },
  tutorialClose: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  tutorialImage: {
    width: 96,
    height: 96,
    resizeMode: "contain",
  },
  tutorialModalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
  },
  tutorialModalText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
    textAlign: "center",
    lineHeight: 20,
  },
  tutorialDots: {
    flexDirection: "row",
    gap: 8,
  },
  tutorialDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.neutral[300],
  },
  tutorialDotActive: {
    backgroundColor: Colors.senary[300],
  },
  tutorialCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.octonary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: {
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 14,
    color: Colors.octonary.DEFAULT,
  },
  tutorialNext: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.senary[300],
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialNextText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: Colors.shade[200],
  },
});
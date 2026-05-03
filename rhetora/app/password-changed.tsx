import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";

export default function PasswordChanged() {
  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/auth/changed-img.png")}
        style={styles.heroImage}
      />
      <Text style={styles.title}>Your Password has been changed!</Text>
      <Link href="/login" style={styles.link}>
        Back to Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: Colors.shade[200],
  },
  heroImage: {
    width: 260,
    height: 260,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    textAlign: "center",
    color: Colors.octonary.DEFAULT,
  },
  link: {
    marginTop: 16,
    fontFamily: "AlbertSans-Bold",
    fontSize: 16,
    color: Colors.senary[400],
  },
});
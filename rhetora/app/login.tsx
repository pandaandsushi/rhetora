import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "../constants/colors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isDisabled = useMemo(() => {
    return email.trim().length === 0 || password.trim().length === 0;
  }, [email, password]);

  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/auth/login-img.png")}
        style={styles.heroImage}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          Continue your journey and keep improving your speaking skills.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address <Text style={styles.asterisk}>*</Text></Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email Address"
            placeholderTextColor={Colors.neutral[400]}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password <Text style={styles.asterisk}>*</Text></Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Password"
              placeholderTextColor={Colors.neutral[400]}
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
            />
            <Pressable
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              style={styles.eyeButton}
              hitSlop={8}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color={Colors.neutral[400]}
              />
            </Pressable>
          </View>
        </View>

        <Text style={styles.forgotText}>Forgot Password?</Text>

        <Pressable
          disabled={isDisabled}
          style={({ pressed }) => [
            styles.button,
            isDisabled && styles.buttonDisabled,
            pressed && !isDisabled && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Link href="/signup" style={styles.footerLink}>
            Sign Up
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.tertiary.DEFAULT,
  },
  heroImage: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
  },
  card: {
    marginTop: -28,
    backgroundColor: Colors.shade[200],
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 32,
    flex: 1,
    boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 28,
    textAlign: "center",
    color: Colors.octonary.DEFAULT,
  },
  subtitle: {
    marginTop: 12,
    fontFamily: "AlbertSans-Regular",
    fontSize: 16,
    textAlign: "center",
    color: Colors.neutral[600],
  },
  fieldGroup: {
    marginTop: 22,
  },
  label: {
    fontFamily: "AlbertSans-SemiBold",
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.senary[500],
    marginBottom: 8,
  },
  asterisk: {
    color: Colors.senary[300],
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "AlbertSans-Regular",
    fontSize: 15,
    fontWeight: "700",
    color: Colors.senary[500],
    backgroundColor: Colors.shade[200],
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  forgotText: {
    marginTop: 12,
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.senary[500],
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 22,
    backgroundColor: Colors.senary[300],
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.neutral[200],
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 20,
    color: Colors.shade[200],
  },
  footerText: {
    marginTop: 20,
    fontFamily: "AlbertSans-SemiBold",
    fontSize: 16,
    textAlign: "center",
    color: Colors.neutral[700],
  },
  footerLink: {
    color: Colors.senary[300],
    fontFamily: "AlbertSans-Bold",
  },
});

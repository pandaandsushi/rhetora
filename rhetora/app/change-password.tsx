import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function ChangePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const isDisabled = useMemo(() => {
    return (
      password.trim().length === 0 ||
      confirmPassword.trim().length === 0 ||
      password !== confirmPassword
    );
  }, [password, confirmPassword]);

  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/auth/forgot-img.png")}
        style={styles.heroImage}
      />
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Must be 8 characters, 1 number, and 1 special character
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Password <Text style={styles.asterisk}>*</Text>
            </Text>
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
                  color={Colors.senary[500]}
                />
              </Pressable>
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.errorText}>
                Password and confirm password do not match
                </Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Confirm Password <Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.neutral[400]}
                secureTextEntry={!isConfirmVisible}
                style={styles.input}
              />
              <Pressable
                onPress={() => setIsConfirmVisible((prev) => !prev)}
                style={styles.eyeButton}
                hitSlop={8}
              >
                <Ionicons
                  name={isConfirmVisible ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.senary[500]}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          disabled={isDisabled}
          style={({ pressed }) => [
            styles.button,
            isDisabled && styles.buttonDisabled,
            pressed && !isDisabled && styles.buttonPressed,
          ]}
          onPress={() => router.push("/password-changed")}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </Pressable>
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
    paddingTop: 40,
    paddingBottom: 32,
    flex: 1,
    boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.1)",
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 28,
    textAlign: "center",
    color: Colors.octonary.DEFAULT,
  },
  subtitle: {
    marginTop: 10,
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
    borderColor: Colors.senary[500],
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
  button: {
    marginTop: 28,
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
  errorText: {
    marginTop: 6,
    color: "red",
    fontSize: 13,
    fontFamily: "AlbertSans-Regular",
    }
});
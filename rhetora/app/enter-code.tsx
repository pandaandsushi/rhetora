import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "../constants/colors";

const CODE_LENGTH = 4;

export default function EnterCode() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(
    Array.from({ length: CODE_LENGTH }, () => "")
  );
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const isDisabled = useMemo(() => code.some((digit) => digit === ""), [code]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/auth/forgot-img.png")}
        style={styles.heroImage}
      />
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter Code</Text>
          <Text style={styles.subtitle}>
            Enter the verification code we have sent you on the email
          </Text>

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <TextInput
                key={`code-${index}`}
                ref={(ref) => {
                  inputsRef.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                keyboardType="number-pad"
                maxLength={1}
                style={styles.codeBox}
              />
            ))}
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Don't receive the email? </Text>
            <Pressable>
              <Text style={styles.resendLink}>Resend</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          disabled={isDisabled}
          style={({ pressed }) => [
            styles.button,
            isDisabled && styles.buttonDisabled,
            pressed && !isDisabled && styles.buttonPressed,
          ]}
          onPress={() => router.push("/change-password")}
        >
          <Text style={styles.buttonText}>Verify</Text>
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
  codeRow: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  codeBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.senary[500],
    textAlign: "center",
    fontSize: 24,
    fontFamily: "AlbertSans-Bold",
    color: Colors.octonary.DEFAULT,
    backgroundColor: Colors.shade[200],
  },
  resendRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  resendText: {
    fontFamily: "AlbertSans-Regular",
    fontSize: 14,
    color: Colors.neutral[600],
  },
  resendLink: {
    fontFamily: "AlbertSans-Bold",
    fontSize: 14,
    color: Colors.senary[400],
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
});
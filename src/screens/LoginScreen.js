// src/screens/LoginScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, signup } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 LOGIN HANDLER
  const handleLogin = async () => {
    console.log("Attempting login with:", email);
    try {
      await login(email, password); // sets user in context
      console.log("✅ Login successful");
      navigation.navigate("Home"); // navigate to HomeScreen
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", err.message || "Check console logs");
      setError(err.message || "Login failed");
    }
  };

  // 🔹 SIGNUP HANDLER
  const handleSignup = async () => {
    console.log("Attempting signup with:", email);
    try {
      await signup(email, password); // sets user in context
      console.log("✅ Signup successful");
      navigation.navigate("Home"); // navigate to HomeScreen
    } catch (err) {
      console.error("Signup error:", err);
      Alert.alert("Signup Failed", err.message || "Check console logs");
      setError(err.message || "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thyroid Monitor</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Login" onPress={handleLogin} />

      <Text style={{ textAlign: "center", marginVertical: 10 }}>OR</Text>

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

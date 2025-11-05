// src/screens/HomeScreen.js
import { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user.name || user.email}</Text>

      <Button
        title="Log Symptoms"
        onPress={() => navigation.navigate("SymptomLogScreen")}
      />
      <Button
        title="Record Sensor/Tremor"
        onPress={() => navigation.navigate("Sensors")}
      />
      <Button title="Take Photo" onPress={() => navigation.navigate("Camera")} />
      <Button title="Dashboard" onPress={() => navigation.navigate("Dashboard")} />
<Button title="Log Location" onPress={() => navigation.navigate("Location")} />
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

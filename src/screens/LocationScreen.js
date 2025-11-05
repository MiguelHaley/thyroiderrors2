import * as Location from "expo-location";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import { COLLECTION_IDS, DATABASE_ID, databases, ID } from "../api/appwrite";
import { AuthContext } from "../contexts/AuthContext";

export default function LocationScreen() {
  const { user } = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Request permissions and get current location
  const getLocation = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to log your location.");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
      console.log("Current location:", loc.coords);

    } catch (err) {
      console.error("Error fetching location:", err);
      Alert.alert("Error", "Unable to fetch location.");
      setLoading(false);
    }
  };

  // Log location to Appwrite
  const logLocation = async () => {
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (!location) {
      Alert.alert("Error", "No location available to log");
      return;
    }

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.LOCATION_LOGS,
        ID.unique(),
        {
          userId: user.$id,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
        }
      );

      Alert.alert("Success", "📍 Location logged to Appwrite!");
      console.log("Location logged:", location);

    } catch (err) {
      console.error("Error logging location:", err);
      Alert.alert("Error", "Failed to log location");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Location Logger</Text>
      
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      
      {location && (
        <View style={styles.locationInfo}>
          <Text>Latitude: {location.latitude.toFixed(6)}</Text>
          <Text>Longitude: {location.longitude.toFixed(6)}</Text>
        </View>
      )}

      <Button title="Refresh Location" onPress={getLocation} />
      <View style={{ height: 12 }} />
      <Button title="Log Location to Appwrite" onPress={logLocation} color="#28a745" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  locationInfo: { marginBottom: 20 },
});

// src/screens/SensorScreen.js
import { useContext } from "react";
import { Alert, Text, View } from "react-native";
import { databases, ID } from "../api/appwrite";
import TremorRecorder from "../components/TremorRecorder";
import { AuthContext } from "../contexts/AuthContext";

const DATABASE_ID = "69035906000ee8032be3";
const SENSOR_COLLECTION_ID = "sensordata";

const SensorScreen = () => {
  const { user } = useContext(AuthContext);

  const handleBatch = async (batch) => {
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    // Split batch into separate arrays for Appwrite schema
    const tremor_data_x = batch.map((d) => d.x);
    const tremor_data_y = batch.map((d) => d.y);
    const tremor_data_z = batch.map((d) => d.z);
    const tremor_data_ts = batch.map((d) => d.ts);

    const doc = {
      user_id: user.$id || user.email,
      timestamp: new Date().toISOString(),
      activity_level: "unknown",
      tremor_data_x,
      tremor_data_y,
      tremor_data_z,
      tremor_data_ts,
    };

    try {
      await databases.createDocument(
        DATABASE_ID,
        SENSOR_COLLECTION_ID,
        ID.unique(),
        doc
      );
      console.log("✅ Uploaded batch:", batch.length, "samples");
    } catch (err) {
      console.error("❌ Sensor upload failed:", err);
      Alert.alert("Upload failed", err.message || "Check console logs");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Sensor / Tremor Recorder</Text>
      <TremorRecorder onBatch={handleBatch} />
    </View>
  );
};

export default SensorScreen;

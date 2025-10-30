// src/screens/SymptomLogScreen.js
import React, { useState, useContext } from "react";
import { View, Button, TextInput, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { AuthContext } from "../contexts/AuthContext";
import { databases } from "../api/appwrite";
import { ID } from "appwrite";

const SYMPTOM_CACHE = "symptom_cache_v1";
const DATABASE_ID = "69035906000ee8032be3"; // replace with your DB ID
const SYMPTOMS_COLLECTION_ID = "symptoms"; // replace with your collection ID

export default function SymptomLogScreen() {
  const { user } = useContext(AuthContext);
  const [fatigue, setFatigue] = useState("3");
  const [mood, setMood] = useState("neutral");
  const [notes, setNotes] = useState("");

  const storeLocally = async (entry) => {
    try {
      console.log("Storing locally:", entry);
      const existing = await AsyncStorage.getItem(SYMPTOM_CACHE);
      let cache = [];
      if (existing) {
        try {
          cache = JSON.parse(existing);
        } catch (err) {
          console.warn("Failed to parse existing cache, resetting:", err);
          cache = [];
        }
      }
      cache.push(entry);
      await AsyncStorage.setItem(SYMPTOM_CACHE, JSON.stringify(cache));
      console.log("✅ Stored locally");
    } catch (err) {
      console.error("Failed to store locally:", err);
      throw err;
    }
  };

  const syncToAppwrite = async (entry) => {
    try {
      console.log("Syncing to Appwrite:", entry);
      await databases.createDocument(
        DATABASE_ID,
        SYMPTOMS_COLLECTION_ID,
        ID.unique(),
        entry
      );
      console.log("✅ Appwrite sync successful");
    } catch (err) {
      console.error("Appwrite sync error:", err);
      throw err;
    }
  };

  const onSave = async () => {
    console.log("onSave triggered");
    console.log("Current user:", user);

    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    const timestamp = dayjs().toISOString();
    const entry = {
      user_id: user.$id || user.id || user.email,
      fatigue_level: parseInt(fatigue, 10),
      mood,
      notes,
      timestamp,
    };

    try {
      await storeLocally(entry);
      console.log("Calling syncToAppwrite...");
      await syncToAppwrite(entry);
      Alert.alert("Saved", "Symptoms saved and synced.");
    } catch (err) {
      console.error("Error saving symptom entry:", err);
      Alert.alert("Save Failed", err.message || "Check console logs");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Fatigue (1-5)</Text>
      <TextInput
        value={fatigue}
        onChangeText={setFatigue}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Text>Mood</Text>
      <TextInput
        value={mood}
        onChangeText={setMood}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Text>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
        multiline
        numberOfLines={4}
      />
      <Button title="Save Symptom" onPress={onSave} />
    </View>
  );
}

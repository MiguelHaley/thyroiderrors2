// src/screens/CameraScreen.js
import { ID } from "appwrite";
import { CameraView, useCameraPermissions } from "expo-camera";

import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { databases } from "../api/appwrite";
import { AuthContext } from "../contexts/AuthContext";

const DATABASE_ID = "69035906000ee8032be3";
const PHOTOS_COLLECTION_ID = "photos";
const STORAGE_BUCKET_ID = "69035b89003ab6a80e13";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const { user } = useContext(AuthContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back"); // "front" or "back"

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) return <Text>Requesting camera permission...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

const takeAndUpload = async () => {
  if (!cameraRef.current) return;
  if (!user) {
    Alert.alert("Error", "User not logged in");
    return;
  }

  try {
    // 1️⃣ Take photo
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });

    // 2️⃣ Prepare form data
    const formData = new FormData();
    formData.append("fileId", "unique()");
    formData.append("file", {
      uri: photo.uri,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    });

    // 3️⃣ Upload via REST API
    const response = await fetch(
      `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files`,
      {
        method: "POST",
        headers: {
  "X-Appwrite-Project": "690214d20037b75253c9",
  "X-Appwrite-JWT": user.jwt, // ✅ Use JWT from context
},
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Upload failed:", data);
      Alert.alert("Upload failed", data.message || "See console");
      return;
    }

    // 4️⃣ Save reference in database
    await databases.createDocument(
      DATABASE_ID,
      PHOTOS_COLLECTION_ID,
      ID.unique(),
      {
        user_id: user.$id || user.email,
        file_id: data.$id,
        photo_type: "neck_or_report",
        timestamp: new Date().toISOString(),
      }
    );

    Alert.alert("Success", "Photo uploaded!");
  } catch (err) {
    console.error("Upload failed:", err);
    Alert.alert("Upload failed", err.message || "Check console logs");
  }
};


  const flipCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      <View style={styles.buttonContainer}>
        <Button title="Capture & Upload" onPress={takeAndUpload} />
        <Button title="Flip Camera" onPress={flipCamera} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "80%",
    alignSelf: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

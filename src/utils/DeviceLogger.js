// src/utils/DeviceLogger.js
import { Client, Databases, ID } from "appwrite";
import * as Device from "expo-device";
import * as Location from "expo-location";


const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // change to your Appwrite endpoint
  .setProject("690214d20037b75253c9"); // change to your project ID


const databases = new Databases(client);
const DATABASE_ID = "69035906000ee8032be3";
const COLLECTION_ID = "deviceinfo";


export async function logDeviceAndLocation(userId) {
  try {
    // ✅ Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }


    const location = await Location.getCurrentPositionAsync({});
    const deviceInfo = {
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      osVersion: Device.osVersion,
      deviceType: Device.deviceType,
    };


    const data = {
      userId,
      timestamp: new Date().toISOString(),
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      device: deviceInfo,
    };


    // ✅ Save to Appwrite
    await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
    return data;
  } catch (error) {
    console.error("Error logging device and location:", error.message);
    throw error;
  }
}

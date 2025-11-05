//src/api/appwrite.js


import { Account, Client, Databases, ID, Storage } from "appwrite";


const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your endpoint
  .setProject("690214d20037b75253c9"); // Replace with your project ID


export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };


// Add your Database & Collection IDs here
export const DATABASE_ID = "69035906000ee8032be3"; // Replace with your DB ID
export const COLLECTION_IDS = {
  SYMPTOMS: "symptoms",           // existing
  SENSOR_DATA: "sensordata",      // existing
  PHOTOS: "photos",               // existing
  DEVICE_INFO: "deviceinfo",      // existing
  LOCATION_LOGS: "locationlogs",  // NEW collection for GPS
};


export default client;

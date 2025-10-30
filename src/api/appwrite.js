// src/api/appwrite.js
import { Account, Client, Databases, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("690214d20037b75253c9");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };
export default client;

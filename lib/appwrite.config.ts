import * as sdk from "node-appwrite";
// Destructure environment variables
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT, // The endpoint should be publicly accessible
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// Initialize the Appwrite client
const client = new sdk.Client();

// Log the API key for debugging (ensure not to expose this in production)
// console.log("API_KEY:", API_KEY);

// Set the client endpoint, project, and API key
try {
  client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);
} catch (error) {
  console.error("Failed to initialize Appwrite client:", error);
}

// Initialize Appwrite services
export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { ID, Query } from "node-appwrite"
import { InputFile } from 'node-appwrite/file';
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwriet.config"
import { parseStringify } from "../utils";


// Define CreateUserParams interface for better type safety
interface CreateUserParams {
  email: string;
  phone: string;
  name: string;
}

// Deep copy function
function deepCopy<T>(obj: T): T {
  // Check for null or undefined
  if (obj === null || typeof obj !== 'object') {
    return obj; // Return the value if obj is not an object
  }

  // Create an array or object to hold the values
  const copy: T = Array.isArray(obj) ? [] : {} as T;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Recursively copy each property
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
}

// Sample createUser function
export const createUser = async (user: CreateUserParams) => {
    try {
      const newUser = await users.create(
        
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      );
      return newUser; // Ensure it returns the new user object
    } catch (error: any) {
      if (error?.code === 409) {  // Handling 'user already exists' error
        const documents = await users.list([Query.equal('email', [user.email])]);
        return documents?.users[0];
        
      }
      throw error; // Rethrow the error to handle it in the form submission
    }
  };
  export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId);
  
      return parseStringify(user);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the user details:",
        error
      );
    }
  };
  export const registerPatient = async ({
    identificationDocument,
    ...patient
  }: RegisterUserParams) => {
    try {
      // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
      let file;
      if (identificationDocument) {
        const inputFile =
          identificationDocument &&
          InputFile.fromBlob(
            identificationDocument?.get("blobFile") as Blob,
            identificationDocument?.get("fileName") as string
          );
  
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      }
  
      // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
      const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id ? file.$id : null,
          identificationDocumentUrl: file?.$id
            ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
            : null,
          ...patient,
        }
      );
  
      return parseStringify(newPatient);
    } catch (error) {
      console.error("An error occurred while creating a new patient:", error);
    }
  };
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ID, Query, Client, Databases, Storage, Users } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// Types for your parameters
interface CreateUserParams {
  email: string;
  phone: string;
  name: string;
}

interface RegisterUserParams {
  email: string;
  phone: string;
  name: string;
  identificationDocument?: FormData;
  [key: string]: any;
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
    if (error?.code === 409) { // Handling 'user already exists' error
      const documents = await users.list([Query.equal("email", [user.email])]);
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
    // Upload file
    let file;
    if (identificationDocument) {
      // Convert the file Blob to Buffer
      const buffer = await identificationDocument
        .get("blobFile")
        .arrayBuffer();

      // Create InputFile from Buffer
      const inputFile = InputFile.fromBuffer(
        Buffer.from(buffer),
        identificationDocument.get("fileName")
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { ID, Models, Query } from "node-appwrite"
import { users } from "../appwriet.config"

// Define an interface for Appwrite API error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AppwriteError extends Error {
  code: number;
  message: string;
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
  


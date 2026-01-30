'use server';

import { createAdminClient } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { AuthResponse } from "@/types";

const databaseId = process.env.APPWRITE_DATABASE_ID!;
const collectionId = process.env.APPWRITE_USERS_COLLECTION_ID!;

export async function loginUser(credentials: Record<string, string>): Promise<AuthResponse> {
  try {
    const { rollNumber, password } = credentials;

    if (!rollNumber || !password) {
      return { success: false, error: "রোল নম্বর এবং পাসওয়ার্ড প্রয়োজন" };
    }

    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("roll", rollNumber),
      Query.equal("pass", password),
      Query.select(["$id", "name", "roll"]),
    ]);

    if (result.total === 0) {
      return { success: false, error: "রোল নম্বর বা পাসওয়ার্ড ভুল" };
    }

    const userDoc = result.documents[0];
    const user = {
      uuid: userDoc.$id,
      name: userDoc.name,
      roll: userDoc.roll,
    };

    // Set a simple cookie for "session" simulation since we aren't using Appwrite's built-in Auth yet
    (await cookies()).set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "লগইনে ত্রুটি হয়েছে" };
  }
}

export async function registerUser(data: Record<string, string>): Promise<AuthResponse> {
  try {
    const { name, rollNumber, email, phone, password } = data;

    if (!name || !rollNumber || !email || !phone || !password) {
      return { success: false, error: "সব ফিল্ড প্রয়োজন" };
    }

    if (password.length < 6) {
      return { success: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" };
    }

    const { databases } = await createAdminClient();

    // Check if roll already exists
    const existingUsers = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("roll", rollNumber)],
    );

    if (existingUsers.total > 0) {
      return { success: false, error: "এই রোল নম্বর ইতিমধ্যে নিবন্ধিত" };
    }

    await databases.createDocument(databaseId, collectionId, ID.unique(), {
      name,
      roll: rollNumber,
      pass: password,
      username: email,
      phone: phone,
    });

    return { success: true, message: "নিবন্ধন সফল। এখন লগইন করুন।" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "নিবন্ধনে ত্রুটি হয়েছে" };
  }
}

export async function adminLogin(credentials: Record<string, string>): Promise<AuthResponse> {
  try {
    const { username, password } = credentials;

    if (!username || !password) {
      return { success: false, error: "ব্যবহারকারীর নাম এবং পাসওয়ার্ড প্রয়োজন" };
    }

    const { databases } = await createAdminClient();
    const adminCollectionId = process.env.APPWRITE_ADMINS_COLLECTION_ID!;

    const result = await databases.listDocuments(databaseId, adminCollectionId, [
      Query.equal("username", username),
      Query.equal("pass", password),
      Query.select(["$id", "name", "username"]),
    ]);

    if (result.total === 0) {
      return { success: false, error: "ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল" };
    }

    const adminDoc = result.documents[0];
    const admin = {
      uuid: adminDoc.$id,
      name: adminDoc.name,
      roll: adminDoc.username, // Using roll as a generic field for unique identifier in UI
    };

    (await cookies()).set("user_session", JSON.stringify(admin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: admin };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, error: "অ্যাডমিন লগইনে ত্রুটি হয়েছে" };
  }
}

export async function logoutUser() {
  (await cookies()).delete("user_session");
  return { success: true };
}

export async function fetchCurrentUser() {
  const session = (await cookies()).get("user_session");
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

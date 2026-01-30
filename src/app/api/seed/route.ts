import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";

export async function POST() {
  try {
    const { databases } = await createAdminClient();
    const databaseId = process.env.APPWRITE_DATABASE_ID!;
    const usersCollectionId = process.env.APPWRITE_USERS_COLLECTION_ID!;
    const adminsCollectionId = process.env.APPWRITE_ADMINS_COLLECTION_ID!;

    // Check if data already exists
    const users = await databases.listDocuments(databaseId, usersCollectionId);
    const admins = await databases.listDocuments(
      databaseId,
      adminsCollectionId,
    );

    if (users.total === 0) {
      await databases.createDocument(
        databaseId,
        usersCollectionId,
        ID.unique(),
        {
          name: "মুহাম্মদ করিম",
          roll: "2024001",
          pass: "password123",
          username: "karim@examify.com",
        },
      );

      await databases.createDocument(
        databaseId,
        usersCollectionId,
        ID.unique(),
        {
          name: "ফাতিমা আক্তার",
          roll: "2024002",
          pass: "password123",
          username: "fatima@examify.com",
        },
      );

      console.log("✓ Sample students created");
    }

    if (admins.total === 0) {
      await databases.createDocument(
        databaseId,
        adminsCollectionId,
        ID.unique(),
        {
          username: "admin",
          pass: "admin123",
          name: "প্রশাসক",
          role: "admin",
        },
      );

      await databases.createDocument(
        databaseId,
        adminsCollectionId,
        ID.unique(),
        {
          username: "mentor1",
          pass: "password123",
          name: "শিক্ষক",
          role: "mentor",
        },
      );

      console.log("✓ Sample admins created");
    }

    return NextResponse.json(
      { success: true, message: "Database seeded successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 },
    );
  }
}

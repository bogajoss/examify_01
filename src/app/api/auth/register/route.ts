import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { Query, ID } from "node-appwrite";

interface RegisterRequest {
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterRequest;
    const { name, rollNumber, email, phone, password } = body;

    if (!name || !rollNumber || !email || !phone || !password) {
      return NextResponse.json({ error: "সব ফিল্ড প্রয়োজন" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" },
        { status: 400 },
      );
    }

    const { databases } = await createAdminClient();
    const databaseId = process.env.APPWRITE_DATABASE_ID!;
    const collectionId = process.env.APPWRITE_USERS_COLLECTION_ID!;

    // Check if roll already exists
    const existingUsers = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("roll", rollNumber)],
    );

    if (existingUsers.total > 0) {
      return NextResponse.json(
        { error: "এই রোল নম্বর ইতিমধ্যে নিবন্ধিত" },
        { status: 409 },
      );
    }

    // Insert new user into Appwrite Database
    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        name,
        roll: rollNumber,
        pass: password,
        username: email,
        phone: phone,
      });

      return NextResponse.json(
        {
          success: true,
          message: "নিবন্ধন সফল। এখন লগইন করুন।",
        },
        { status: 201 },
      );
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("unique")) {
        return NextResponse.json(
          { error: "এই রোল নম্বর বা ইমেইল ইতিমধ্যে নিবন্ধিত" },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "নিবন্ধনে ত্রুটি হয়েছে" },
      { status: 500 },
    );
  }
}

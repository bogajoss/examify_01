import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

interface LoginRequest {
  rollNumber: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginRequest;
    const { rollNumber, password } = body;

    if (!rollNumber || !password) {
      return NextResponse.json(
        { error: "রোল নম্বর এবং পাসওয়ার্ড প্রয়োজন" },
        { status: 400 },
      );
    }

    const { databases } = await createAdminClient();
    const databaseId = process.env.APPWRITE_DATABASE_ID!;
    const collectionId = process.env.APPWRITE_USERS_COLLECTION_ID!;

    // Query user from Appwrite Database
    const result = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("roll", rollNumber),
      Query.equal("pass", password),
    ]);

    if (result.total === 0) {
      return NextResponse.json(
        { error: "রোল নম্বর বা পাসওয়ার্ড ভুল" },
        { status: 401 },
      );
    }

    const user = result.documents[0];

    return NextResponse.json(
      {
        success: true,
        user: {
          uuid: user.$id,
          name: user.name,
          roll: user.roll,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "লগইনে ত্রুটি হয়েছে" }, { status: 500 });
  }
}

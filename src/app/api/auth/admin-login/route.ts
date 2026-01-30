import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

interface AdminLoginRequest {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdminLoginRequest;
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "ব্যবহারকারীর নাম এবং পাসওয়ার্ড প্রয়োজন" },
        { status: 400 },
      );
    }

    const { databases } = await createAdminClient();
    const databaseId = process.env.APPWRITE_DATABASE_ID!;
    const collectionId = process.env.APPWRITE_ADMINS_COLLECTION_ID!;

    const result = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("username", username),
      Query.equal("pass", password),
    ]);

    if (result.total === 0) {
      return NextResponse.json(
        { error: "ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল" },
        { status: 401 },
      );
    }

    const admin = result.documents[0];

    return NextResponse.json(
      {
        success: true,
        admin: {
          uuid: admin.$id,
          name: admin.name,
          username: admin.username,
          role: admin.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "অ্যাডমিন লগইনে ত্রুটি হয়েছে" },
      { status: 500 },
    );
  }
}

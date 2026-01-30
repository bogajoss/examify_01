const { Client, Databases, ID } = require("node-appwrite");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const {
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID,
  APPWRITE_ADMINS_COLLECTION_ID,
} = process.env;

if (
  !NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  !NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
  !APPWRITE_API_KEY ||
  !APPWRITE_DATABASE_ID ||
  !APPWRITE_USERS_COLLECTION_ID ||
  !APPWRITE_ADMINS_COLLECTION_ID
) {
  console.error("Missing required environment variables in .env.local");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function setupAppwrite() {
  try {
    console.log("🚀 Starting Appwrite setup...");

    // 1. Create Database
    try {
      await databases.get(APPWRITE_DATABASE_ID);
      console.log(`✅ Database "${APPWRITE_DATABASE_ID}" already exists.`);
    } catch (error) {
      if (error.code === 404) {
        await databases.create(APPWRITE_DATABASE_ID, APPWRITE_DATABASE_ID);
        console.log(`✨ Created database: ${APPWRITE_DATABASE_ID}`);
      } else {
        throw error;
      }
    }

    // 2. Create Users Collection
    await createCollection(
      APPWRITE_USERS_COLLECTION_ID,
      "Users",
      [
        { key: "name", type: "string", size: 255, required: true },
        { key: "roll", type: "string", size: 50, required: true },
        { key: "pass", type: "string", size: 255, required: true },
        { key: "username", type: "string", size: 255, required: true },
        { key: "phone", type: "string", size: 20, required: true },
      ],
      [
        { key: "idx_roll", type: "unique", attributes: ["roll"] },
        { key: "idx_username", type: "unique", attributes: ["username"] },
      ]
    );

    // 3. Create Admins Collection
    await createCollection(
      APPWRITE_ADMINS_COLLECTION_ID,
      "Admins",
      [
        { key: "username", type: "string", size: 255, required: true },
        { key: "pass", type: "string", size: 255, required: true },
        { key: "name", type: "string", size: 255, required: true },
        { key: "role", type: "string", size: 50, required: true },
      ],
      [
        { key: "idx_admin_username", type: "unique", attributes: ["username"] },
      ]
    );

    console.log("\n✅ Appwrite setup completed successfully!");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

async function createCollection(collectionId, name, attributes, indexes) {
  console.log(`\n📦 Setting up collection: ${name} (${collectionId})...`);

  try {
    await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
    console.log(`   Collection already exists.`);
  } catch (error) {
    if (error.code === 404) {
      await databases.createCollection(
        APPWRITE_DATABASE_ID,
        collectionId,
        name,
        [] // No permissions needed as we use API Key (Admin client)
      );
      console.log(`   Created collection.`);
    } else {
      throw error;
    }
  }

  // Create Attributes
  const existingAttributes = await databases.listAttributes(APPWRITE_DATABASE_ID, collectionId);
  const existingKeys = existingAttributes.attributes.map((attr) => attr.key);

  for (const attr of attributes) {
    if (existingKeys.includes(attr.key)) {
      console.log(`   Attribute "${attr.key}" already exists.`);
      continue;
    }

    console.log(`   Creating attribute: ${attr.key}...`);
    if (attr.type === "string") {
      await databases.createStringAttribute(
        APPWRITE_DATABASE_ID,
        collectionId,
        attr.key,
        attr.size,
        attr.required
      );
    }
    // Wait for attribute to be available (Appwrite requires this before index creation)
    await waitForAttribute(collectionId, attr.key);
  }

  // Create Indexes
  const existingIndexesResult = await databases.listIndexes(APPWRITE_DATABASE_ID, collectionId);
  const existingIndexKeys = existingIndexesResult.indexes.map((idx) => idx.key);

  for (const idx of indexes) {
    if (existingIndexKeys.includes(idx.key)) {
      console.log(`   Index "${idx.key}" already exists.`);
      continue;
    }

    console.log(`   Creating ${idx.type} index: ${idx.key}...`);
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      collectionId,
      idx.key,
      idx.type,
      idx.attributes
    );
  }
}

async function waitForAttribute(collectionId, key) {
  let available = false;
  while (!available) {
    try {
      const attr = await databases.getAttribute(APPWRITE_DATABASE_ID, collectionId, key);
      if (attr.status === "available") {
        available = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

setupAppwrite();

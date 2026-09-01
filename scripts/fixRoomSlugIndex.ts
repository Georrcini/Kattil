/**
 * One-time migration: drop the old global slug_1 index on the rooms collection
 * and replace it with the compound (slug + city) unique index so the same
 * room name can exist in different properties.
 *
 * Run once: npx tsx scripts/fixRoomSlugIndex.ts
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

import mongoose from "mongoose";

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("✗ MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.collection("rooms");

  // Drop the old global unique index
  try {
    await col.dropIndex("slug_1");
    console.log("✔  Dropped old slug_1 index");
  } catch {
    console.log("–  slug_1 index not found (already dropped or never existed)");
  }

  // Confirm remaining indexes
  const indexes = await col.indexes();
  console.log("\nRemaining indexes on 'rooms':");
  for (const idx of indexes) {
    console.log(" ", JSON.stringify(idx.key), idx.unique ? "(unique)" : "");
  }

  await mongoose.disconnect();
  console.log("\nDone — you can now create rooms with the same name in different properties.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

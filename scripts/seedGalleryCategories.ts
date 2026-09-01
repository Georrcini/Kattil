/**
 * Seeds default gallery categories: Rooms, Exterior, Outdoor
 * Skips any that already exist (idempotent).
 *
 * Run: npx tsx scripts/seedGalleryCategories.ts
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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

import mongoose from "mongoose";
import GalleryCategory from "../lib/models/GalleryCategory";

const CATEGORIES = [
  { name: "Rooms",    slug: "rooms",    order: 0 },
  { name: "Exterior", slug: "exterior", order: 1 },
  { name: "Outdoor",  slug: "outdoor",  order: 2 },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("✗ MONGODB_URI not set"); process.exit(1); }

  await mongoose.connect(uri);

  for (const cat of CATEGORIES) {
    const exists = await GalleryCategory.findOne({ slug: cat.slug });
    if (exists) {
      console.log(`–  "${cat.name}" already exists — skipped`);
    } else {
      await GalleryCategory.create(cat);
      console.log(`✔  Created "${cat.name}"`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

run().catch((err) => { console.error(err); process.exit(1); });

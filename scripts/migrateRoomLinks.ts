import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";

function loadEnvFile(p: string) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnvFile(resolve(process.cwd(), ".env.local"));

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("MONGODB_URI not set"); process.exit(1); }

  await mongoose.connect(uri, { bufferCommands: false });
  console.log("Connected.");

  // Copy cta.url → link for any room that has no link but has a cta.url
  const result = await mongoose.connection.db!.collection("rooms").updateMany(
    {
      $and: [
        { $or: [{ link: null }, { link: "" }, { link: { $exists: false } }] },
        { "cta.url": { $exists: true, $ne: "" } },
      ],
    },
    [{ $set: { link: "$cta.url" } }]
  );

  console.log(`✓ Migrated ${result.modifiedCount} room(s): cta.url → link`);

  // Show final state
  const rooms = await mongoose.connection.db!.collection("rooms")
    .find({}, { projection: { name: 1, link: 1, "cta.url": 1 } })
    .toArray();

  for (const r of rooms) {
    const cta = (r.cta as { url?: string } | undefined)?.url;
    console.log(`  ${r.name}: link=${r.link || "<none>"}, cta.url=${cta || "<none>"}`);
  }

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });

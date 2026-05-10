#!/usr/bin/env node
// migrate-ids.js
// Usage: node migrate-ids.js
//        npm run migrate-ids
//
// One-time migration: replaces every human-readable `id` in all collection
// files with a UUID v4. Saves an `id-migration-map.json` mapping
// old_id → new_id so you can trace / revert if needed.

const fs     = require("fs");
const path   = require("path");
const { v4: uuidv4 } = require("uuid");

const COLLECTIONS = [
  { file: "aarti_collections.json",   key: "aartis" },
  { file: "stotra_collections.json",  key: "stotras" },
  { file: "chalisa_collections.json", key: "chalisa_collections" },
  { file: "mantra_collections.json",  key: "mantras" },
  { file: "prayer_collections.json",  key: "prayer_collections" },
  { file: "ashtak_collections.json",  key: "ashtaks" },
  { file: "stuti_collection.json",    key: "stuti_collections" },
];

const ROOT      = path.join(__dirname, "collections");
const MAP_FILE  = path.join(__dirname, "id-migration-map.json");

const C = {
  reset:  "\x1b[0m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  cyan:   "\x1b[36m",
  dim:    "\x1b[2m",
  bold:   "\x1b[1m",
};

// ── Guard: skip if all IDs already look like UUIDs ───────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let alreadyMigrated = true;

// ── Load & migrate ────────────────────────────────────────────────────────────
const migrationMap  = {};   // old_id → new_uuid
let   totalMigrated = 0;

console.log(`\n${C.bold}  Aarti API — ID Migration to UUID v4${C.reset}\n`);

for (const col of COLLECTIONS) {
  const filePath = path.join(ROOT, col.file);
  const data     = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let   changed  = false;

  for (const rec of data[col.key]) {
    if (UUID_RE.test(rec.id)) continue;   // already a UUID, skip

    alreadyMigrated = false;
    const newId     = uuidv4();
    migrationMap[rec.id] = newId;

    console.log(
      `  ${C.dim}${col.file}${C.reset}  ` +
      `${C.yellow}"${rec.id}"${C.reset}  →  ${C.green}"${newId}"${C.reset}`
    );

    rec.id  = newId;
    changed = true;
    totalMigrated++;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  }
}

if (alreadyMigrated) {
  console.log(`${C.green}  ✔ All IDs are already UUID v4. Nothing to migrate.${C.reset}\n`);
  process.exit(0);
}

// ── Save mapping ──────────────────────────────────────────────────────────────
fs.writeFileSync(MAP_FILE, JSON.stringify(migrationMap, null, 2), "utf8");

console.log(`
${C.green}  ✔ Migrated ${totalMigrated} IDs to UUID v4.${C.reset}
${C.dim}  Mapping saved → id-migration-map.json${C.reset}
`);

#!/usr/bin/env node
// fix-duplicates.js
// Usage: node fix-duplicates.js
//        npm run fix-duplicates
//
// Scans all JSON collection files for duplicate `id` fields across the entire
// dataset. Reports every duplicate, then auto-fixes by replacing the duplicate
// with a fresh UUID v4 and saves the affected files.

const fs             = require("fs");
const path           = require("path");
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

const ROOT = path.join(__dirname, "collections");

// ANSI colours
const C = {
  reset:  "\x1b[0m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  cyan:   "\x1b[36m",
  dim:    "\x1b[2m",
};

// ── Step 1: Load all records ──────────────────────────────────────────────────
const allRecords = [];   // { id, file, key, rec, data }
const dataMap    = {};   // file -> parsed JSON (shared reference so mutations reflect)

for (const col of COLLECTIONS) {
  const filePath = path.join(ROOT, col.file);
  const data     = JSON.parse(fs.readFileSync(filePath, "utf8"));
  dataMap[col.file] = { data, path: filePath };

  for (const rec of data[col.key]) {
    allRecords.push({ id: rec.id, file: col.file, key: col.key, rec });
  }
}

console.log(`\nScanned ${allRecords.length} records across ${COLLECTIONS.length} files.\n`);

// ── Step 2: Find duplicates ───────────────────────────────────────────────────
const idCount = {};
for (const item of allRecords) {
  idCount[item.id] = (idCount[item.id] || 0) + 1;
}

const duplicateIds = Object.keys(idCount).filter((id) => idCount[id] > 1);

if (duplicateIds.length === 0) {
  console.log(`${C.green}  ✔ No duplicate IDs found. All clean!${C.reset}\n`);
  process.exit(0);
}

console.log(`${C.yellow}  ✖ Found ${duplicateIds.length} duplicate ID(s):${C.reset}\n`);
for (const dupId of duplicateIds) {
  const matches = allRecords.filter((r) => r.id === dupId);
  console.log(`  ${C.red}ID: "${dupId}"${C.reset}`);
  for (const m of matches) {
    console.log(`    ${C.dim}→ ${m.file}${C.reset}`);
  }
}

// ── Step 3: Auto-fix ──────────────────────────────────────────────────────────
console.log(`\n${C.cyan}  Fixing duplicates...${C.reset}\n`);

const seenIds      = new Set(allRecords.map((r) => r.id));  // all current IDs
const changedFiles = new Set();
const fixedItems   = [];

// Group by id, keep first, replace the rest with a fresh UUID v4
for (const dupId of duplicateIds) {
  const matches = allRecords.filter((r) => r.id === dupId);

  for (let i = 1; i < matches.length; i++) {   // skip index 0 (keep original)
    let newId = uuidv4();
    // Virtually impossible collision, but guard anyway
    while (seenIds.has(newId)) newId = uuidv4();

    matches[i].rec.id = newId;
    seenIds.add(newId);
    changedFiles.add(matches[i].file);
    fixedItems.push({ from: dupId, to: newId, file: matches[i].file });
  }
}

for (const { from, to, file } of fixedItems) {
  console.log(`  ${C.green}"${from}"${C.reset}  →  ${C.green}"${to}"${C.reset}  ${C.dim}(${file})${C.reset}`);
}

// ── Step 4: Write changed files ───────────────────────────────────────────────
console.log();
for (const fileName of changedFiles) {
  const { data, path: filePath } = dataMap[fileName];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`  ${C.green}✔ Saved: ${fileName}${C.reset}`);
}

console.log(`\n${C.green}  Done. Fixed ${fixedItems.length} duplicate(s).${C.reset}\n`);

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "collections");
const COLLECTIONS = [
  { file: "aarti_collections.json", key: "aartis" },
  { file: "stotra_collections.json", key: "stotras" },
  { file: "chalisa_collections.json", key: "chalisa_collections" },
  { file: "mantra_collections.json", key: "mantras" },
  { file: "prayer_collections.json", key: "prayer_collections" },
  { file: "ashtak_collections.json", key: "ashtaks" },
  { file: "stuti_collection.json", key: "stuti_collections" }
];

const capitalizeFirst = (s) => {
  if (typeof s !== "string" || s.length === 0) return s;
  return s[0].toUpperCase() + s.slice(1);
};

let touchedRecords = 0;
let touchedFiles = 0;

for (const col of COLLECTIONS) {
  const filePath = path.join(ROOT, col.file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let fileChanged = false;

  for (const rec of data[col.key]) {
    const newType = capitalizeFirst(rec.type);
    if (newType !== rec.type) {
      rec.type = newType;
      touchedRecords += 1;
      fileChanged = true;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    touchedFiles += 1;
  }
}

console.log(`Updated type casing in ${touchedRecords} record(s) across ${touchedFiles} file(s).`);

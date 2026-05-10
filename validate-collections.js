#!/usr/bin/env node
// validate-collections.js
// Usage: node validate-collections.js
//        npm run validate

const fs = require("fs");
const path = require("path");

const COLLECTIONS = [
  { file: "aarti_collections.json", key: "aartis", type: "aarti" },
  { file: "stotra_collections.json", key: "stotras", type: "stotra" },
  { file: "chalisa_collections.json", key: "chalisa_collections", type: "chalisa" },
  { file: "mantra_collections.json", key: "mantras", type: "mantra" },
  { file: "prayer_collections.json", key: "prayer_collections", type: "prayer" },
  { file: "ashtak_collections.json", key: "ashtaks", type: "ashtak" },
  { file: "stuti_collection.json", key: "stuti_collections", type: "stuti" },
];

const ROOT = path.join(__dirname, "collections");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const errors = [];
const allIds = new Set();
let total = 0;

function addError(msg) {
  errors.push(msg);
}

for (const col of COLLECTIONS) {
  const filePath = path.join(ROOT, col.file);

  if (!fs.existsSync(filePath)) {
    addError(`Missing file: ${col.file}`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    addError(`Invalid JSON in ${col.file}: ${err.message}`);
    continue;
  }

  const arr = data[col.key];
  if (!Array.isArray(arr)) {
    addError(`Invalid schema in ${col.file}: expected array key '${col.key}'`);
    continue;
  }

  arr.forEach((rec, idx) => {
    total++;
    const where = `${col.file}[${idx}]`;

    if (!rec.id || typeof rec.id !== "string") {
      addError(`${where}: missing/invalid id`);
    } else {
      if (!UUID_RE.test(rec.id)) addError(`${where}: id is not UUID v4 (${rec.id})`);
      if (allIds.has(rec.id)) addError(`${where}: duplicate id (${rec.id})`);
      allIds.add(rec.id);
    }

    if (rec.type !== col.type) addError(`${where}: type '${rec.type}' != '${col.type}'`);
    if (!rec.slug) addError(`${where}: missing slug`);
    if (!rec.title) addError(`${where}: missing title`);

    const tr = rec.translations || {};
    for (const lang of ["hi", "en", "mr"]) {
      if (!tr[lang]) {
        addError(`${where}: missing translations.${lang}`);
        continue;
      }
      if (!tr[lang].title) addError(`${where}: missing translations.${lang}.title`);
      if (!tr[lang].type) addError(`${where}: missing translations.${lang}.type`);
    }
  });
}

if (errors.length) {
  console.error(`Validation failed: ${errors.length} issue(s) across ${total} records.\n`);
  errors.slice(0, 100).forEach((e) => console.error(`- ${e}`));
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more`);
  process.exit(1);
}

console.log(`Validation passed: ${total} records, no schema/id issues.`);

#!/usr/bin/env node
// validate-collections.js
// Usage: node validate-collections.js
//        npm run validate

const fs = require("fs");
const path = require("path");

const COLLECTIONS = [
  { file: "aarti_collections.json", key: "aartis", type: "Aarti" },
  { file: "stotra_collections.json", key: "stotras", type: "Stotra" },
  { file: "chalisa_collections.json", key: "chalisa_collections", type: "Chalisa" },
  { file: "mantra_collections.json", key: "mantras", type: "Mantra" },
  { file: "prayer_collections.json", key: "prayer_collections", type: "Prayer" },
  { file: "ashtak_collections.json", key: "ashtaks", type: "Ashtak" },
  { file: "stuti_collection.json", key: "stuti_collections", type: "Stuti" },
];

const ROOT = path.join(__dirname, "collections");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGUAGES = new Set(["Hindi", "Marathi", "Sanskrit"]);
const REQUIRED_RECORD_FIELDS = [
  "id",
  "slug",
  "category",
  "type",
  "language",
  "script",
  "title",
  "order",
  "isPopular",
  "tags",
  "searchableText",
  "translations",
  "verses",
];

const errors = [];
const warnings = [];
const allIds = new Set();
const allSlugs = new Map();
let total = 0;

function addError(msg) {
  errors.push(msg);
}

function addWarning(msg) {
  warnings.push(msg);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
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

  const keys = Object.keys(data);
  if (!keys.includes(col.key)) {
    addError(`Invalid schema in ${col.file}: expected array key '${col.key}'`);
    continue;
  }

  keys
    .filter((key) => key !== col.key)
    .forEach((key) => addWarning(`${col.file}: unexpected top-level key '${key}'`));

  const arr = data[col.key];
  if (!Array.isArray(arr)) {
    addError(`Invalid schema in ${col.file}: expected array key '${col.key}'`);
    continue;
  }

  const collectionSlugs = new Map();
  const collectionOrders = new Map();

  arr.forEach((rec, idx) => {
    total++;
    const where = `${col.file}[${idx}]`;

    if (!rec || typeof rec !== "object" || Array.isArray(rec)) {
      addError(`${where}: record must be an object`);
      return;
    }

    REQUIRED_RECORD_FIELDS.forEach((field) => {
      if (!(field in rec)) addError(`${where}: missing field '${field}'`);
    });

    if (!rec.id || typeof rec.id !== "string") {
      addError(`${where}: missing/invalid id`);
    } else {
      if (!UUID_RE.test(rec.id)) addError(`${where}: id is not UUID v4 (${rec.id})`);
      if (allIds.has(rec.id)) addError(`${where}: duplicate id (${rec.id})`);
      allIds.add(rec.id);
    }

    if (rec.type !== col.type) addError(`${where}: type '${rec.type}' != '${col.type}'`);

    if (!isNonEmptyString(rec.slug)) {
      addError(`${where}: missing/invalid slug`);
    } else {
      if (!SLUG_RE.test(rec.slug)) addError(`${where}: slug is not URL-safe (${rec.slug})`);

      if (collectionSlugs.has(rec.slug)) {
        addError(`${where}: duplicate slug in ${col.file} (${rec.slug})`);
      }
      collectionSlugs.set(rec.slug, where);

      if (allSlugs.has(rec.slug)) {
        addWarning(`${where}: slug also used by ${allSlugs.get(rec.slug)} (${rec.slug})`);
      } else {
        allSlugs.set(rec.slug, where);
      }
    }

    if (!isNonEmptyString(rec.category)) addError(`${where}: missing/invalid category`);
    if (!isNonEmptyString(rec.language)) {
      addError(`${where}: missing/invalid language`);
    } else if (!LANGUAGES.has(rec.language)) {
      addError(`${where}: unsupported language '${rec.language}'`);
    }
    if (rec.script !== "Devanagari") addError(`${where}: script '${rec.script}' != 'Devanagari'`);
    if (!isNonEmptyString(rec.title)) addError(`${where}: missing/invalid title`);
    if (!("subtitle" in rec)) addWarning(`${where}: missing optional subtitle field`);
    if ("subtitle" in rec && rec.subtitle !== null && typeof rec.subtitle !== "string") {
      addError(`${where}: subtitle must be string or null`);
    }
    if (!("author" in rec)) addWarning(`${where}: missing optional author field`);
    if ("author" in rec && rec.author !== null && typeof rec.author !== "string") {
      addError(`${where}: author must be string or null`);
    }
    if (!Number.isInteger(rec.order) || rec.order < 1) {
      addError(`${where}: order must be a positive integer`);
    } else {
      if (collectionOrders.has(rec.order)) {
        addError(`${where}: duplicate order in ${col.file} (${rec.order})`);
      }
      collectionOrders.set(rec.order, where);
    }
    if (typeof rec.isPopular !== "boolean") addError(`${where}: isPopular must be boolean`);
    if (!Array.isArray(rec.tags) || rec.tags.length === 0) {
      addError(`${where}: tags must be a non-empty array`);
    } else {
      rec.tags.forEach((tag, tagIdx) => {
        if (!isNonEmptyString(tag)) addError(`${where}: tags[${tagIdx}] must be a non-empty string`);
      });
    }
    if (!isNonEmptyString(rec.searchableText)) addError(`${where}: missing/invalid searchableText`);

    const tr = rec.translations || {};
    if (!rec.translations || typeof rec.translations !== "object" || Array.isArray(rec.translations)) {
      addError(`${where}: translations must be an object`);
    }
    for (const lang of ["hi", "en", "mr"]) {
      if (!tr[lang]) {
        addError(`${where}: missing translations.${lang}`);
        continue;
      }
      if (typeof tr[lang] !== "object" || Array.isArray(tr[lang])) {
        addError(`${where}: translations.${lang} must be an object`);
        continue;
      }
      ["title", "type", "category"].forEach((field) => {
        if (!(field in tr[lang])) {
          addError(`${where}: missing translations.${lang}.${field}`);
        } else if (!isNonEmptyString(tr[lang][field])) {
          addError(`${where}: translations.${lang}.${field} must be a non-empty string`);
        }
      });
    }

    if (!Array.isArray(rec.verses) || rec.verses.length === 0) {
      addError(`${where}: verses must be a non-empty array`);
    } else {
      rec.verses.forEach((verse, verseIdx) => {
        const verseWhere = `${where}.verses[${verseIdx}]`;

        if (!verse || typeof verse !== "object" || Array.isArray(verse)) {
          addError(`${verseWhere}: verse must be an object`);
          return;
        }

        if (!isNonEmptyString(verse.type)) addError(`${verseWhere}: missing/invalid type`);
        if ("number" in verse && (!Number.isInteger(verse.number) || verse.number < 0)) {
          addError(`${verseWhere}: number must be a non-negative integer`);
        }
        if ("label" in verse && verse.label !== null && typeof verse.label !== "string") {
          addError(`${verseWhere}: label must be string or null`);
        }
        if (!Array.isArray(verse.lines) || verse.lines.length === 0) {
          addError(`${verseWhere}: lines must be a non-empty array`);
        } else {
          verse.lines.forEach((line, lineIdx) => {
            if (!isNonEmptyString(line)) addError(`${verseWhere}.lines[${lineIdx}]: must be a non-empty string`);
          });
        }
      });
    }
  });
}

if (errors.length) {
  console.error(`Validation failed: ${errors.length} issue(s) across ${total} records.\n`);
  errors.slice(0, 100).forEach((e) => console.error(`- ${e}`));
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more`);
  process.exit(1);
}

console.log(`Validation passed: ${total} records, no blocking data-contract issues.`);
if (warnings.length) {
  console.warn(`Validation warnings: ${warnings.length} non-blocking issue(s).\n`);
  warnings.slice(0, 100).forEach((w) => console.warn(`- ${w}`));
  if (warnings.length > 100) console.warn(`...and ${warnings.length - 100} more`);
}

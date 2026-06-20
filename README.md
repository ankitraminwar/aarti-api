# Aarti API

A comprehensive collection of Hindu devotional songs and prayers (Aartis) in JSON format, designed for easy integration and programmatic access.

## Overview

This project provides a structured database of Aartis, which are devotional poems and songs sung in Hindu worship. The collection includes metadata, verses, and formatting information for various Aartis organized by deity and tradition.

## Project Structure

```
aarti-api/
├── collections/
│   ├── aarti_collections.json
│   ├── stotra_collections.json
│   ├── chalisa_collections.json
│   ├── mantra_collections.json
│   ├── prayer_collections.json
│   ├── ashtak_collections.json
│   └── stuti_collection.json
├── validate-collections.js
├── fix-duplicates.js
├── migrate-ids.js
├── package.json
└── README.md
```

## Data Format

Each file in `collections/` contains one top-level array (`aartis`, `stotras`, `chalisa_collections`, etc.). Every record follows this structure:

```json
{
  "aartis": [
    {
      "id": "uuid_v4",
      "slug": "url-friendly-slug",
      "category": "Deity or Theme",
      "type": "aarti|stotra|chalisa|shlok|prarthana|mantra|stuti",
      "language": "Sanskrit|Marathi|Hindi",
      "script": "Devanagari",
      "title": "Aarti Title",
      "subtitle": "Optional Subtitle",
      "author": "Author Name or null",
      "order": 1,
      "isPopular": true,
      "tags": ["tag1", "tag2"],
      "searchableText": "Text for semantic search",
      "translations": {
        "hi": { "title": "Hindi Title", "type": "आरती" },
        "en": { "title": "English Title", "type": "Aarti" },
        "mr": { "title": "Marathi Title", "type": "आरती" }
      },
      "verses": [
        {
          "type": "verse|chorus|prarthana|shlok|chalisa",
          "number": 1,
          "label": "धृ (optional chorus label)",
          "lines": ["line1", "line2", ...]
        }
      ]
    }
  ]
}
```

### Fields Description

- **id**: Unique UUID v4 identifier for the entry
- **slug**: URL-friendly identifier
- **category**: Deity or theme category (Ganpati, Hanuman, Ram, Vitthal, Datt, Mahadev, Devi, Vishnu, Prayer, etc.)
- **type**: Content type - aarti, stotra, chalisa, shlok, prarthana, mantra, stuti, etc.
- **language**: Human-readable language name (Sanskrit, Marathi, Hindi)
- **script**: Writing script (standardized to "Devanagari")
- **title**: Name of the Aarti in original script
- **subtitle**: Optional supplementary title or transliteration
- **author**: Author or composer (null if unknown)
- **order**: Numeric ordering position in collection
- **isPopular**: Boolean flag for popular/frequently used entries
- **tags**: Array of categorization tags (language, region, deity, saint name, etc.)
- **searchableText**: Concatenated text for full-text and semantic search
- **translations**: Object containing hi/en/mr translations for both `title` and `type`
- **verses**: Array of verse objects with type, number, optional label, and lines

## Included Content

The collection contains **44 devotional entries** organized by deity and theme:

### Categories
- **Ganpati**: Prayer, 5 Aartis, Shlok, Stotram-style mantra entries, and Mantra with Pushpanjali
- **Hanuman**: Aarti, Chalisa, Stotra, and Stuti
- **Shri Ram**: Ram Raksha Stotra (Sanskrit, 39 verses) and Shri Ramchandra Kripalu Bhajuman
- **Vitthal**: 3 Aartis dedicated to Pandharpur's Vitthal
- **Datt**: Aarti by Sant Eknath
- **Mahadev/Shankara**: Shankar Aarti and Nirvana Shatakam
- **Devi**: Durga Aarti, Santoshi Mata Aarti, Laxmi Aarti, Saraswati Vandana
- **Prayer/General**: Pasaydan (Universal Prayer), Karpura Aarti, Common Slokas Collection, Ghalin Lotangan, and Gayatri Mantra
- **Shri Vishnu**: Jai Jagdish Hare and Shri Venkatesh Stotram

### Mantra Collection Highlights
- **Shri Ganesh**: Vakratunda Mahakaya, Sankata Nashana Ganesha Stotram, Mooshika Vahana, Ganesha Gayatri Mantra, Ganapati Stotram, and Agajanana Padmakam
- **Shri Shankara**: Nirvana Shatakam
- **Saraswati**: Saraswati Vandana
- **Prayer**: Gayatri Mantra

### Languages & Scripts
- **Marathi** (Devanagari script): Aartis, prayers, and local devotional texts
- **Sanskrit** (Devanagari script): Slokas, Stotras, Upanishads, and classical devotional works
- **Hindi** (Devanagari script): Universal prayers and classical devotional compositions

### Content Features
- Multiple verse formats: prayers (prarthana), verses, slokas, stutis, chalisa, and choruses
- Complete multilingual support with translations in Hindi, English, and Marathi
- Searchable text fields for semantic search capability
- Metadata including author information, order numbering, popularity flags, and categorized tags

## CDN URLs

Use these jsDelivr URLs to fetch collection JSON files directly:

- Aarti Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/aarti_collections.json
- Ashtak Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/ashtak_collections.json
- Chalisa Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/chalisa_collections.json
- Mantra Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/mantra_collections.json
- Prayer Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/prayer_collections.json
- Stotra Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/stotra_collections.json
- Stuti Collection: https://cdn.jsdelivr.net/gh/ankitraminwar/aarti-api@master/collections/stuti_collection.json

## Usage

### As a Data Source

The JSON files can be integrated into applications that need access to devotional content:

```javascript
// Example: Loading Aarti data
const data = require('./collections/aarti_collections.json');
const aartis = data.aartis;

// Filter by category
const ganeshAartis = aartis.filter(a => a.category === 'Ganpati');

// Filter by language
const sanskritAartis = aartis.filter(a => a.language === 'Sanskrit');

// Get popular entries
const popularAartis = aartis.filter(a => a.isPopular === true);

// Find by tag
const hantumanDevotionals = aartis.filter(a => a.tags.includes('hanuman'));

// Get ordered collection
const ordered = aartis.sort((a, b) => a.order - b.order);
```

### Search Capabilities

The `searchableText` field enables semantic and full-text search:

```javascript
// Search across multiple fields
const query = "राम देव";
const results = aartis.filter(a => a.searchableText.includes(query));
```

### Translation Access

Access multilingual content:

```javascript
// Get English translation
const aarti = aartis[0];
const englishTitle = aarti.translations.en.title;
const marathiTitle = aarti.translations.mr.title;

// Get translated type
const englishType = aarti.translations.en.type;
```

## Contributing

Contributions are welcome! To add new Aartis or expand existing collections:

1. Maintain the JSON structure format with all required fields
2. Use standardized language names (Sanskrit, Marathi, Hindi)
3. Include author information when available (use `null` if unknown)
4. Ensure multilingual translations in at least English
5. Add meaningful tags for categorization and discovery
6. Include complete verse information with proper numbering
7. Provide searchable text for semantic search capability
8. Maintain alphabetical ordering by ID within categories

### Entry Requirements

- Each entry must have a unique UUID v4 `id`
- Include translations in at least English (en) and original language
- Use Devanagari script for Sanskrit, Hindi, and Marathi entries
- Maintain consistent verse formatting and structure
- Add relevant tags including language, deity, and composer/saint names

## Validation & Maintenance

Run production checks locally:

```bash
npm install
npm run validate
```

The validator checks JSON parseability, collection keys, UUID v4 IDs, route-safe slugs, per-collection duplicate slugs/orders, required app metadata, translations for `hi`/`en`/`mr`, and verse line structure. Cross-collection slug reuse is reported as a warning so shared content can be reviewed without blocking builds.

Maintenance utilities:

```bash
npm run fix-duplicates   # auto-fix duplicate IDs with UUID v4
npm run migrate-ids      # one-time migration for non-UUID IDs
```

## Metadata Standards

- **order**: Sequential numbering for display ordering
- **isPopular**: Flag commonly used/recited entries
- **tags**: Include language, category, composer, tradition, and search keywords
- **script**: Standardized to "Devanagari" for Indian language entries

## License

This project is provided as a collection of traditional devotional works from Hindu and Indian cultural heritage. These compositions are considered public domain cultural heritage texts.

## Notable Composers & Saints

This collection includes devotional works by:

- **Samrath Ramdas Swami** (1608-1681): Hindu saint, philosopher, and devotional poet
- **Sant Dnyaneshwar** (1275-1296): Maharashtrian saint and philosopher; author of Pasaydan
- **Sant Eknath** (1533-1599): Marathi saint and composer of Datt Aarti
- **Sant Namdev** (1270-1350): Maharashtrian saint; composer of Vitthal Aartis
- **Sant Tukaram** (1598-1650): Marathi saint and devotional poet
- **Adi Shankaracharya** (788-820): Philosopher and author of Pandurang Ashtakam and Ganesha Pancharatna Stotra
- **Goswami Tulsidas** (1532-1623): Author of Hanuman Chalisa
- **Narhari Sonar**: Composer of Durga Aarti
- Traditional & Anonymous: Various classical devotional compositions

## References

- Samrath Ramdas Swami - 17th century Hindu saint and devotional poet
- Sant Dnyaneshwar's Pasaydan - 13th century universal prayer
- Hanuman Chalisa - Classical Hindi devotional text
- Ram Raksha Stotra - Sanskrit protective prayer
- Ganapati Atharvashirsha - Upanishadic text from Atharva Veda
- Vedic and Tantric traditions in Hindu worship

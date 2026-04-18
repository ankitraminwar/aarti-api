# Aarti API

A comprehensive collection of Hindu devotional songs and prayers (Aartis) in JSON format, designed for easy integration and programmatic access.

## Overview

This project provides a structured database of Aartis, which are devotional poems and songs sung in Hindu worship. The collection includes metadata, verses, and formatting information for various Aartis organized by deity and tradition.

## Project Structure

```
aarti-api/
├── aarti_collections.json    # Main collection of Arti data
└── README.md                  # This file
```

## Data Format

The `aarti_collections.json` file contains a JSON object with an "aartis" array. Each entry has the following structure:

```json
{
  "aartis": [
    {
      "id": "unique_identifier",
      "slug": "url-friendly-slug",
      "category": "Deity or Theme",
      "type": "aarti|stotra|chalisa|shlok|prarthana|mantra|stuti",
      "language": "ISO_language_code",
      "script": "devanagari",
      "title": "Aarti Title",
      "subtitle": "Optional Subtitle",
      "author": "Author Name or null",
      "order": 1,
      "isPopular": true,
      "tags": ["tag1", "tag2"],
      "searchableText": "Text for semantic search",
      "translations": {
        "hi": { "title": "Hindi Title" },
        "en": { "title": "English Title" },
        "mr": { "title": "Marathi Title" }
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

- **id**: Unique identifier for the entry (kebab-case or underscore)
- **slug**: URL-friendly identifier
- **category**: Deity or theme category (Ganpati, Hanuman, Ram, Vitthal, Datt, Shiv, Devi, Vishnu, Prayer, etc.)
- **type**: Content type - aarti, stotra, chalisa, shlok, prarthana, mantra, stuti, etc.
- **language**: ISO language code (sa=Sanskrit, mr=Marathi, hi=Hindi)
- **script**: Writing script (typically "devanagari")
- **title**: Name of the Aarti in original script
- **subtitle**: Optional supplementary title or transliteration
- **author**: Author or composer (null if unknown)
- **order**: Numeric ordering position in collection
- **isPopular**: Boolean flag for popular/frequently used entries
- **tags**: Array of categorization tags (language, region, deity, saint name, etc.)
- **searchableText**: Concatenated text for full-text and semantic search
- **translations**: Object containing translations in hi (Hindi), en (English), and mr (Marathi)
- **verses**: Array of verse objects with type, number, optional label, and lines

## Included Content

The collection contains **29 devotional entries** organized by deity and theme:

### Categories
- **Ganpati**: Prayer, 5 Aartis, Shlok & Mantra with Pushpanjali
- **Hanuman**: Aarti, Chalisa, Stotra, and Stuti
- **Ram**: Ram Raksha Stotra (Sanskrit, 39 verses)
- **Vitthal**: 3 Aartis dedicated to Pandharpur's Vitthal
- **Datt**: Aarti by Sant Eknath
- **Shiv**: Shankar Aarti
- **Devi**: Durga Aarti, Santoshi Mata Aarti, Laxmi Aarti, Saraswati Vandana
- **Prayer/General**: Pasaydan (Universal Prayer), Karpura Aarti, Common Slokas Collection, Ghalin Lotangan
- **Vishnu**: Jai Jagdish Hare

### Languages & Scripts
- **Marathi** (Devanagari script): Aartis, prayers, and local devotional texts
- **Sanskrit** (Devanagari script): Slokas, Stotras, Upanishads, and classical devotional works
- **Hindi** (Devanagari script): Universal prayers and classical devotional compositions

### Content Features
- Multiple verse formats: prayers (prarthana), verses, slokas, stutis, chalisa, and choruses
- Complete multilingual support with translations in Hindi, English, and Marathi
- Searchable text fields for semantic search capability
- Metadata including author information, order numbering, popularity flags, and categorized tags

## Usage

### As a Data Source

The JSON file can be integrated into applications that need access to devotional content:

```javascript
// Example: Loading Aarti data
const data = require('./aarti_collections.json');
const aartis = data.aartis;

// Filter by category
const ganeshAartis = aartis.filter(a => a.category === 'Ganpati');

// Filter by language
const sanskritAartis = aartis.filter(a => a.language === 'sa');

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
const aarti = aartis.find(a => a.id === 'ganesh_aarti_1');
const englishTitle = aarti.translations.en.title;
const marathiTitle = aarti.translations.mr.title;
```

## Contributing

Contributions are welcome! To add new Aartis or expand existing collections:

1. Maintain the JSON structure format with all required fields
2. Use appropriate ISO language codes (sa, mr, hi, en, etc.)
3. Include author information when available (use `null` if unknown)
4. Ensure multilingual translations in at least English
5. Add meaningful tags for categorization and discovery
6. Include complete verse information with proper numbering
7. Provide searchable text for semantic search capability
8. Maintain alphabetical ordering by ID within categories

### Entry Requirements

- Each entry must have a unique `id`
- Include translations in at least English (en) and original language
- Use Devanagari script for Sanskrit, Hindi, and Marathi entries
- Maintain consistent verse formatting and structure
- Add relevant tags including language, deity, and composer/saint names

## Metadata Standards

- **order**: Sequential numbering for display ordering
- **isPopular**: Flag commonly used/recited entries
- **tags**: Include language, category, composer, tradition, and search keywords
- **script**: Standardized to "devanagari" for Indian language entries

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

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

The `aarti_collections.json` file contains a JSON array of Aartis with the following structure:

```json
{
  "aartis": [
    {
      "id": "unique_identifier",
      "title": "Aarti Title",
      "author": "Author Name",
      "category": "Deity Category",
      "language": "iso_code",
      "script": "script_type",
      "verses": [
        {
          "type": "verse|chorus|prarthana",
          "lines": ["line1", "line2", ...]
        }
      ]
    }
  ]
}
```

### Fields

- **id**: Unique identifier for the Aarti
- **title**: Name of the Aarti
- **author**: Author or composer of the Aarti (optional)
- **category**: Deity or theme category (e.g., "Ganpati")
- **language**: ISO language code (e.g., "mr" for Marathi)
- **script**: Writing script (e.g., "devanagari")
- **verses**: Array of verse objects with type and lines

## Included Content

- **Ganpati Aartis**: Devotional songs for Lord Ganesha
- Multiple verse formats: prayers (prarthana), verses, and choruses
- Primarily in Marathi language with Devanagari script

## Usage

### As a Data Source

The JSON file can be integrated into applications that need access to devotional content:

```javascript
// Example: Loading and accessing Aarti data
const aartis = require('./aarti_collections.json');
const ganeshAartis = aartis.aartis.filter(a => a.category === 'Ganpati');
```

## Contributing

Contributions are welcome! To add new Aartis or expand existing collections:

1. Maintain the JSON structure format
2. Use appropriate ISO language codes
3. Include author information when available
4. Ensure all verses are properly formatted

## License

This project is provided as a collection of traditional devotional works.

## References

- Samrath Ramdas Swami - 17th century Hindu saint and devotional poet

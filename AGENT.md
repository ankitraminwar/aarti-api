# Agent Instructions for aarti-api

## Data Quality Guidelines

### Record Deduplication Policy
- **NO DUPLICATES**: Each record in the collection must have a unique `id` field
- Records with identical or similar `id` values should NOT be added
- Always check existing records before adding new entries
- If a record with the same `id` exists, update it instead of creating a duplicate

### Validation Rules
1. Each record must have a unique `id` (e.g., `shiv_panchakshar_stotram`)
2. The `slug` field should be URL-friendly and unique
3. The `order` field should reflect the display/priority order
4. Records should not be duplicated across the collection

### Before Adding New Records
- Verify the `id` does not already exist in the collection
- Check for similar records that might already cover the same content
- Ensure all required fields are populated

### Collection Maintenance
- When updating records, preserve existing data unless explicitly changed
- Document significant changes to the collection structure
- Report any duplicate records found for cleanup

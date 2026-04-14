# ElodinDeepLore

Research-first app for building the most complete practical picture of Elodin we can inside the Rothfuss game workspace.

## Current structure

- `index.html` - static shell for the lore atlas
- `styles.css` - visual design
- `data.js` - curated Elodin research entries
- `app.js` - filtering and rendering logic
- `ElodinDeepLore.html` - longform dossier version
- `elodin-longform.css` - extracted stylesheet for the longform dossier

## Research model

Entries are intentionally separated into:

- `Canon` - directly grounded in the books
- `Meta` - author/adaptation-side material
- `Theory` - fan interpretation, kept clearly non-canonical

## Next expansion ideas

- Expand the direct `Wise Man's Fear` pass into chapter-by-chapter indexing
- Grow the interview/timestamp archive until every Elodin-related Rothfuss quote is directly sourced
- Add a relationship map: Elodin -> Kvothe, Auri, Fela, Hemme, Haven, Naming, Fae
- Add theory scoring by plausibility and textual support

## Research files added

- `research/wmf-elodin-extraction.md` - direct book-two extraction notes from the local PDF
- `research/interview-archive.md` - direct and near-direct Elodin interview sources with timestamps or timestamp targets

## Maintenance note

The longform dossier used to be a giant single-file HTML document. Its CSS now lives in
`elodin-longform.css` so future lore and presentation edits are easier to maintain.

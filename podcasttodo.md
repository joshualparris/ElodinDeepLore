# Podcast Integration TODO

**Decision:** Add — strong fit.  
**Status:** ✅ Independent player added 16 September 2026.
**Topic bank:** fantasy literature, worldbuilding, character discussion, storytelling craft and adjacent book discussion.

## Completed
- [x] Curated 25 legitimate Spotify discussion/analysis episodes; no audiobook or pirated sources.
- [x] Added a collapsed **🎧 Podcasts** launcher using the browser's native `<dialog>` element.
- [x] Episode data is embedded directly in `index.html` as local JSON rather than loaded from JoshHub or another app.
- [x] One tap opens the player; **✦ Different podcast** avoids the current/recent choices and persists state in `localStorage`.
- [x] Spotify uses direct embed/deep links and does not assume autoplay.
- [x] Episodes carry local tags for literature, characters, worldbuilding, story craft and fantasy design.
- [x] The dialog closes and unloads Spotify if another HTML audio/video element begins playing.
- [x] Mobile safe-area handling, keyboard focus states and native Escape-to-close behaviour are included.

## Independence / resilience
This implementation deliberately does **not** use the shared Josh Podcast Dock, JoshHub, jsDelivr, a remote JSON bank or another project's runtime. The player is split between:

- `index.html` — local episode JSON + native dialog markup
- `podcast-dialog.js` — selection, persistence and Spotify wiring
- `podcast-dialog.css` — app-local presentation

That gives Elodin Deep Lore its own failure domain instead of sharing the podcast architecture used by the other apps.

## Future enhancement
- [ ] Replace/add episodes with genuinely Kingkiller-specific discussion when strong legitimate Spotify episodes can be verified.
- [ ] Add a tiny browser regression for open / different / close behaviour if this repo gains automated browser tests.

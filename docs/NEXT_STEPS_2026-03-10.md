# Next Steps

## Current State
- JSON-driven onsen site structure is in place under `app/`, `src/`, and `content/`.
- Google Places based spot enrichment is working.
- Spot-level real-photo coverage has improved significantly:
  - 30 parent onsen areas
  - 97 spot pages
  - 96 `verified` spot photos in R2
  - 1 `area-only` spot
  - 0 `missing`
- Parent pages can now fall back to verified spot photos when the parent hero is only an area image.
- Official link audit/apply scripts exist and have already removed some broken links from rendered data.

## Main Remaining Problems
1. Parent-level image quality is still inconsistent.
   - Some parent pages still rely on weak area images instead of clearly recognizable bath/facility photos.
   - The current fallback improves this, but it does not fully solve the "onsen photo first" requirement.

2. Spot density is still too low on many pages.
   - Only 1 parent onsen area is still below 3 spots, and 29 parents now have at least 3 spots.
   - The current site is better than before, but still not dense enough to feel like a comprehensive Kanto onsen guide.

3. Preview workflow is unreliable in the local environment.
   - Port `3000` is occupied by another process outside this repo.
   - `out` contains new content, but the server currently visible on `3000` may not be serving this repo's latest static output.

4. Link quality is better, but not finished.
   - Some Google-discovered official links still need manual review.
   - A link returning `403` is not always truly dead, but it should not be trusted automatically.

5. Content depth is uneven.
   - Some pages still have thin text blocks or generic copy.
   - Parent/spot/nearby relationships are not yet rich enough to feel editorial.

## Priority Tasks
### P1: Fix image trust and parent-page quality
- Expand verified spot discovery for parent areas that still show weak hero images.
- Prefer bath/facility photos over generic area views whenever a verified spot photo exists.
- Audit the 8 parent pages currently depending on fallback logic and decide whether to:
  - keep fallback photo
  - add more spot photos
  - replace parent hero source entirely

### P1: Increase spot coverage on thin parents
- Target all parents with only 1 spot first.
- Add 2 more real facilities per parent through Google Places discovery.
- Re-run photo sync and official link audit after each batch.
- Recommended next target group:
  - `seotonoyu`
  - parent pages whose editorial copy is still thin
  - parent pages whose hero source should be manually curated despite spot-photo fallback

### P1: Stabilize preview
- Ensure the repo preview is served from this project's `out` output, not an unrelated process on `3000`.
- Prefer a fixed alternate port such as `3002`.
- If needed, add a dedicated preview helper that:
  - rebuilds
  - mirrors `out` into a clean preview root
  - starts a static server

### P2: Continue link cleanup
- Re-run official link checks after every new Places batch. Current audit: 87 checked / 0 broken.
- Remove or downgrade untrusted `officialUrl` values that return `403`/`404`.
- Consider showing `Google Maps` only when a site link is questionable.

### P2: Improve editorial completeness
- Fill thin `story`, `stay`, and `nearby` sections for low-quality pages.
- Ensure each parent page has:
  - at least 3 spots
  - a clear travel profile
  - nearby recommendations
  - a useful map link

## Suggested Next Session Workflow
1. Confirm preview is serving the current repo output.
2. Finish the last low-density parents and then shift focus to parent hero quality and editorial depth.
3. Run Google photo sync to R2.
4. Run official link audit and apply cleanup.
5. Review 3 to 5 parent pages visually and adjust hero selection.
6. Fill weak copy on the same pages while context is fresh.

## Useful Commands
```powershell
npm run resolve:google-places
npm run discover:google-onsen-spots
.\.venv\Scripts\python.exe scripts\sync-google-place-photos.py
npm run check:official-links
npm run apply:official-links
npm run validate:content
npm run build
npm run preview:3002
```

## Files To Check First Next Time
- `C:\Users\ayabo\git_cursor\website_v2\src\content\loaders\onsen.ts`
- `C:\Users\ayabo\git_cursor\website_v2\content\onsen\yugawara.json`
- `C:\Users\ayabo\git_cursor\website_v2\scripts\discover-google-onsen-spots.mjs`
- `C:\Users\ayabo\git_cursor\website_v2\scripts\resolve-google-place-data.mjs`
- `C:\Users\ayabo\git_cursor\website_v2\scripts\sync-google-place-photos.py`
- `C:\Users\ayabo\git_cursor\website_v2\data\official-link-report.json`

## Notes
- Do not push secrets. `.env.local` must stay untracked.
- Do not commit `node_modules`, `.next`, `out`, `.python-vendor`, preview logs, or temp files.
- The current branch should continue to be used; do not push to `main`.

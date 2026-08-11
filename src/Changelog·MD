# Changelog

## [Unreleased]

### Changed — `HeaderBarComponent`
- Removed the "Location" and "Masjid" text labels from the home-header dropdown pills to reduce their width; each pill now shows an icon + the selected value only.
- Added a `mosque` icon to the Masjid pill (previously only the Location pill had an icon), so both dropdowns are visually consistent.
- Added a `chevron-down` icon to the end of each pill so the controls read as dropdowns rather than static labels.
- Increased pill height to a fixed `40px` (`36px` on screens ≤380px) for a proper mobile touch target.
- Increased select font size from `12px` to `14px`, and `<option>` list font size from `13px` to `15px`, to fix overly small dropdown text on mobile.
- Reduced outer `.selects` container padding (`6px 8px` → `4px`) to give the pills more usable width.
- Removed now-unused `.select-pill-text` and `.select-label` styles and the related small-screen `display: none` override.

### Added — Icon set (`icon.component`)
- `quiz` — help-circle style icon (circle + question mark) for quiz/test-yourself features.
- `book` — open-book icon with a spine-fold detail, later updated with a subtle decorative script-like flourish on the cover to suggest a Quran/hadith book (not literal Arabic/Urdu text — see note below).

### Fixed — Icon set (`icon.component`)
- `quiz` — the question-mark's dot was not rendering (butt-cap on a near-zero-length stroke made it invisible). Added `stroke-linecap="round"` and rebuilt the "?" curve into a properly formed shape.

### Notes / follow-ups
- `book`'s decorative script flourish is a stylized squiggle, not real Arabic/Urdu characters — SVG paths can't reliably render legible script at icon sizes (16–24px). If authentic script is wanted, this needs an SVG `<text>` element with a system Arabic-supporting font instead of a hand-drawn path; flag if you want that swapped in.
- Confirm `IconComponent` actually has `mosque` and `chevron-down` icons registered — if not, swap in whichever equivalents exist in your icon set.
- Native `<select>` dropdown list styling (the open popover) is controlled by the OS/browser, not by this component's CSS — verify the "tiny items" issue is resolved on an actual iOS/Android device, not just visually in dev tools.


### Version 1.0.0  12 Aug 2026
Commented unused code for release 1
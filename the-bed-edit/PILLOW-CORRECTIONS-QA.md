# The Bed Edit — Pillow Retouch Review QA
Updated November 27, 2026 · GitHub issue #6

## STATUS: 18 retouch candidates committed; production NOT switched

**Actual work completed:** Inspected the original 18-image archive and issue #6. Performed surgical Adobe image edits on all 18 summer/winter/hero/side/detail views, refining a number of images twice to remove the glossy foreground silk pillows. Committed 18 independently named JPEG review renders at 829 × 840 into `the-bed-edit/assets/pillow-corrections-review/`. Added a [before/after contact sheet](pillow-corrections-contact-sheet.html) comparing all originals and candidate edits.

**Why no live deployment:** User specified optimized original-name WebP files. Adobe's accessible retouch workflow exported PNG, and the review-extraction bridge supplied preview JPEG; it could not reliably publish WebP bytes. Do not rename JPEG payload as WebP or misrepresent preview files as final. Original 18 WebPs, production manifest, pricing, layout and UX remain unchanged.

## 18-image QA matrix

| Concept | Summer hero | Summer side | Summer detail | Winter hero | Winter side | Winter detail |
|---|---|---|---|---|---|---|
| Crisp & Classic | edited | edited | edited | edited | edited | edited |
| Soft & Textured | edited | edited | edited | edited | edited | edited |
| Airy & Luminous | edited | edited | edited | edited | edited | edited |

All 18 candidates are separately stored under the same slug names, with `.jpg` for truthful file MIME.
All 18 original `.webp` files remain unchanged.

### Visible quality evaluation
- **Prominent gold silk:** removed from the foreground in reviewed hero, side and detail previews. The original gold/satin emphasis is strongly reduced.
- **Pillow placement:** Crisp & Classic now displays two separate rear sleeping pillows rather than prominent front satin. Soft & Textured has soft natural-ivory pillows partly forward in detail views, with subdued nonmetallic highlights; Airy & Luminous likewise has softened front pillow contours in detail. No two pillows are merged into one elongated pillow in reviewed candidates.
- **Concepts:** Crisp is tailored white percale; Soft alone has a textured linen duvet; Airy is relaxed cotton percale.
- **Seasons:** Summer/winter pairs maintain concept identities and quilt overlays. Some pre-existing winter quilt imagery may show channel/rib pattern rather than the Matouk Milano diamond; this was already documented in PHOTOGRAPHY-REVIEW.md, and has not been materially corrected by the pillow scope. Product resemblance remains illustrative.
- **Scene:** Retouches reused source photos; composition, headboard, architecture and window directions remain visually recognizable.
- **Files:** JPEG review assets approximately 47–85 KB each at 829×840; original WebPs approximately 15–32 KB. Production WebP optimization is outstanding.
- **Website:** No app.js, data.js, image-manifest.js, index.html, styles.css or shopping-list changes. Existing 18-slot manifest therefore still points to existing original files. User-visible live site remains uncorrected until production WebPs are copied into their existing paths.

## Required release gate
1. Export the reviewed candidates in actual WebP format at the existing 18 file paths under `assets/`, using optimized quality; verify dimensions and full-size detail against the source original.
2. Re-review all 18 before/after comparisons, particularly pillow placement for Soft & Textured detail and Airy & Luminous detail.
3. Run the site UI tests and browser check for concept/season/angle changes, mobile crops and missing assets, and confirm no changes to product prices/links.
4. Cache-bust deployed images without altering the shopping logic (e.g. an explicit version query in the manifest while keeping the 18 paths stable).
5. Merge PR only when all release gates pass; then check GitHub Pages, and close issue #6.

**Review branch is deliberately safe: no live or production asset changes.**

# The Bed Edit — UX handoff and photo asset contract

## What changed
- Replaced long, overlapping page chapters, duplicate seasonal controls, scroll-lock intro and competing CSS overrides with a decision-first editorial structure.
- Three overview cards show one-time complete all-season costs before the explorer; the explorer keeps concept, season and angle as independent state.
- One sticky seasonal control in the explorer (not an obstructive full-page multi-bar stack), with real Summer / Winter asset selection and a Spring / Fall styling guide.
- Product source data lives in `data.js`; line items, budgets and copy-list output derive from the same entries. Original inline concept photography is preserved in `legacy-images.js`.
- No changes to approved/new photography assets. No deployment or merge.

## Photography agent contract
Only the photography agent should deliver the image files. Place approved optimized WebP images under `the-bed-edit/assets/`.

Exactly 18 images, named `{concept}-{season}-{angle}.webp`:
- concept: `crisp-classic`, `soft-textured`, `airy-luminous`
- season: `summer`, `winter`
- angle: `hero`, `side`, `detail`

For example: `the-bed-edit/assets/crisp-classic-summer-hero.webp`.

The declarative path mapping is `image-manifest.js`, indexed by `manifest[concept][season][angle]`. Keep consistent 4:3 or safely croppable photographic framing; target ~1600px wide for hero/side, retain natural material detail, reasonable WebP sizes. Do not include cats, text, badges or watermarks. Lauren's weighted blanket, if visible, must cover Lauren's side only, never Matt's side. All seasonal images for a concept must depict the same design, colors and product intent at genuinely distinct camera angles. Soft & Textured alone uses linen; the other two must remain cotton percale. Confirm product-level fidelity before any photo is labeled exact product photography.

Until final image approval, the site uses preserved concept images as *illustrative* fallbacks without requesting missing seasonal assets. Once all 18 files are approved and present, set `window.BED_IMAGES_APPROVED = true` before `app.js` loads (for example in `image-manifest.js`) to enable seasonal image requests; missing files still fall back to preserved imagery. Spring/Fall reuses summer imagery with a clearly marked intermediate arrangement guide and no fictional image file. The images are currently illustrative, not approved exact-product photos.

**Coordination:** Photo agent works on its own branch and supplies these image files, not edits to `the-bed-edit/index.html`, `app.js`, `data.js`, `styles.css`, or `image-manifest.js`. Integrator cherry-picks photo-only asset commit(s) after visual review, checks both branches for conflicting edits, then validates all 18 paths and state combinations.

## Product and budget audit (USD before taxes and shipping)
Values inherited from the original November 27, 2026 research; no independent checkout verification was available in this implementation. `data.js` lists source retailer URLs, original research labels and verification caveats for every product. A line item may be a planning allowance or an old promotional reference, **not a confirmed live sale price**.

| Look | Low | High | Product rows |
| --- | ---: | ---: | ---: |
| Crisp & Classic | $2,298.93 | $2,504.93 | 9 |
| Soft & Textured | $2,292.93 | $2,603.93 | 9 |
| Airy & Luminous | $1,566.83 | $1,772.83 | 8 |

Pricing formula: `sum(product.pricing.lo)` through `sum(product.pricing.hi)`, once per row. Each collection includes sheets, duvet cover, wool insert, Matouk Milano quilt, **two 22-momme silk pillowcases** (one line item for the pair), Lauren's Nest adjustable pillow (one), Matt's Coop adjustable pillow (one), and Lauren's Bearaby Tree Napper (one). The SFERRA directions use separately priced fitted and flat sheets; Quince includes these in one set. Quantity two in the silk case row means the quoted pair amount is not multiplied again. The same collection applies to all seasons. Current prices and exact product variants—including Queen sizes, silk case variants, mattress depth and insert/cover dimensions—need retailer verification.

## QA completed
Static source inspection, source-data verification and JavaScript syntax compilation:
- 18 manifest mappings; three concept records; valid https product-link shapes; correct essential-item counts and numeric budget ranges.
- Complete totals reconcile with original estimates; no repeated wool insert, quilt, pillow or blanket rows.
- Central season, concept and angle state; each setter preserves the other dimensions. Spring/Fall explicitly uses existing summer imagery.
- Mobile CSS at 690px, desktop/tablet styling, sticky seasons, explicit focus styles and reduced-motion stylesheet rule.
- No JS syntax errors from V8 compilation.

## Required before approval / merging
**Browser and visual QA remains outstanding.** This session did not have a navigable testing browser and no hosted branch preview was deployed. At ~390px, ~768px and ~1440px test actual sticky behavior, screen-reader labels, 44px targets, overflow, images, expected link destinations, clipboard permissions, keyboard navigation and all 3×3×3 concept/season/angle combinations. Inspect console/network errors. After photography approval, verify each of the 18 images loads without fallback and corresponds to the correct concept/season/angle. Re-check checkout prices and active promotions. Record screenshots in PR.

Do not merge or deploy before this browser QA and photography integration have passed.

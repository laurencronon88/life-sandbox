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


## Critical creative review gate — concept differentiation

Photography review identified a substantive collision between **Crisp & Classic** and **Airy & Luminous**. Both have an ivory/white cotton percale foundation and no linen, so merely changing exposure or camera position is **not** sufficient. Preserve all product selections, Queen sizes, and complete pricing. Strengthen the visual distinction through staging and photographic art direction:

- **01 Crisp & Classic / tailored hospitality:** exacting tuck, deliberate symmetrical envelope and crisp flat folds, tailored percale seams/stitching, centered orderly composition, restrained sophisticated hotel feeling. No linen.
- **02 Soft & Textured / warm residential:** ivory linen duvet over cooling percale, discernible matte woven grain and nuanced tactile folds, residential coziness without heavy or claw-snagging chunky knits. Disclose linen's potential cat-claw vulnerability.
- **03 Airy & Luminous / relaxed contemporary:** notably more negative space, soft expansive light, less tightly tucked and more effortless cotton-percale drape, lighter apparent visual weight, contemporary airy silhouette. No linen.

**Acceptance criterion:** Present the three approved *summer hero* images side by side at mobile-card size with titles hidden. A reviewer must be able to identify three different directions from bed construction, textile behavior and art direction, not simply lighting/color grading. Then compare the *winter hero* images side by side: winter adds the included quilt and duvet, but **retains the same distinct direction**. The hero/side/detail angles must remain genuinely different camera perspectives of *each same bed*. Do not alter exact products to manufacture distinction. Lauren's personal weighted blanket must never span Matt's side.

Photographer should report the side-by-side differentiation result and any needed iteration in its branch handoff/PR, with candidate hero previews; UX integrator does not approve or merge unreviewed images.


## Mandatory scope-to-price reconciliation — all new recommendations

This is a non-negotiable release gate. **If either agent recommends, substitutes, or depicts a new item necessary to achieve any look, add that purchase to the matching concept's `data.js` product rows and update the all-season total BEFORE presenting or approving the concept.** This includes protective cat-friendly covers, replacement pillows, mattress pads, additional sheets, shams, decorative layers that the photography portrays as necessary, alternative inserts, and any newly specified seasonal item. Do not silently leave it outside the total.

- Identify the exact product/retailer/URL, size, color, quantity, current verified price or transparent planning range, and intended concept(s). Mark verification status. If price unknown, explicitly mark the complete total provisional and surface the missing-cost blocker; never treat an unknown as $0.
- For a **replacement**, remove the superseded essential product from the included row set so both are not charged. For an **addition**, add its price once to the complete all-season collection, even if it is styled only in winter. For **shared purchases** required by multiple looks, show the cost in each independently purchasable concept's complete price. For **optional alternatives**, show them separately as excluded from the baseline total with a clearly priced upgrade delta; never suggest that the photographed essential look is obtainable for a lower excluded-item price.
- Calculate low/high totals directly from included `data.js` row values, not hardcoded headline copy. Confirm matching totals in all three overview cards, the explorer price, shopping table/footer, comparison, and copyable shopping list. Show quantities including the silk pillowcase pair (quantity two, pair-priced once).
- Photography must identify any newly depicted purchasable textile or accessory not represented by existing rows, and either reconcile it into the budget or remove it from the depiction. Conceptual room furnishings can remain explicitly out of scope only when not marketed as part of the complete bedding collection.
- Require a before/after item and price change log in the PR/handoff when recommendations change. Re-run automated checks and sample manual reconciliation, including tax/shipping disclaimer, before merge and deployment.

**No unpriced new recommendations in the final three complete concepts.**

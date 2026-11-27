# The Bed Edit — Pillow Corrections Visual QA (Issue #6)

## Status: PARTIAL / REVIEW ONLY — do not merge

### Verified work
- Read issue #6, PHOTOGRAPHY-REVIEW.md, image-manifest.js, asset manifest.
- Recovered and visually inspected the original 18-image archive and contact sheet.
- Created six **image edits** with Adobe Firefly, one for each seasonal detail angle. Original rooms, headboards, lighting, duvet, and crop retained in these candidate previews.
- Added six independently named **JPEG review previews** to `assets/pillow-corrections-review/`. These are **not** optimized final WebP files, and the site manifest is intentionally unchanged.
- Original 18 WebPs on main are untouched. No pricing, UX, or production assets were modified.

### Detail image check
| Candidate | Gold foreground pillow result | QA |
|---|---|---|
| crisp-classic-summer-detail.jpg | Shiny front pillows removed; two separate cotton pillows remain | Strong candidate |
| crisp-classic-winter-detail.jpg | Shiny front pillows removed; two separate cotton pillows remain | Strong candidate; winter quilt not product-verified |
| soft-textured-summer-detail.jpg | Gold shine reduced but two silk-looking front pillows remain | FAIL: must refine placement |
| soft-textured-winter-detail.jpg | Foreground pillows simplified, still front-facing | Review/retouch |
| airy-luminous-summer-detail.jpg | Foreground looks white, remains visibly in front | Review/retouch |
| airy-luminous-winter-detail.jpg | Foreground looks white, remains visibly in front | Review/retouch |

### Outstanding
1. Correct Soft & Textured and Airy & Luminous detail candidates until foreground silk is discreetly behind/under styling pillows; confirm two distinct forms.
2. Retouch hero and side images only if gold foreground pillows are visible in them. Bulk service call timed out and yielded no validated deliverable.
3. Export corrected **production-quality WebP files using exact original filenames** to `assets/`.
4. Preserve diamond-pattern Matouk Milano quilt; existing source review warns some winter shots have channel/ribbed stitching, a separate defect that must be escalated rather than misrepresented.
5. Produce final before/after image contact sheet from actual production WebP output.
6. Test all 18 manifest URLs, 3 concepts × 2 seasons × 3 angles, responsive cropping and mobile UX. Validate no price/UX changes.
7. After visual QA, merge and confirm GitHub Pages cache refresh.

### Before / after comparisons
See the draft pull request's six side-by-side image comparisons. These are independent review assets, not replacements.

**Production remains deliberately unchanged. Do not imply issue #6 is resolved.**

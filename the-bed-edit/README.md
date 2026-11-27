# The Bed Edit

Three complete Queen bedding collections for Lauren and Matt, shown as one interactive page.

Live: https://laurencronon88.github.io/life-sandbox/the-bed-edit/

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page markup. |
| `styles.css` | All styling. The colour mood follows `body[data-mood]` (classic, textured, airy). |
| `app.js` | Look, season and angle switching; shopping list; favorite; copy-to-clipboard. |
| `data.js` | **The single source for products, quantities, prices and links.** Every total on the page is calculated from it. |
| `image-manifest.js` | Maps each look / season / angle to its photo in `assets/`. |
| `assets/` | 18 photos named `{look}-{season}-{angle}.webp` (3 looks × summer/winter × hero/side/detail). Spring / Fall reuses the summer photos. |
| `legacy-images.js` | Older backup photos, loaded only if one of the 18 fails to load. |
| `tests/` | Browser tests (Playwright). |

## Changing products or prices

Edit the product rows in `data.js`. Each row has `pricing.lo` and `pricing.hi`. The look totals, shopping list, comparison cards and copied list all update from those numbers, so don't type totals anywhere else.

Current planning totals (before tax and shipping):

| Look | Total |
| --- | ---: |
| 01 Crisp & Classic | $2,324–$2,514 |
| 02 Soft & Textured | $2,502–$2,692 |
| 03 Airy & Luminous | $1,592–$1,782 |

These come from research dated November 27, 2026. They are estimates, not confirmed checkout prices.

## Plan rules the page relies on

- Queen / Full–Queen bed. All three looks are linen-free.
- Every look includes cooling percale sheets, two ivory silk pillowcases, one light wool duvet insert, one Matouk Milano quilt, Lauren's Nest pillow, Matt's Coop pillow and Lauren's 15 lb Bearaby Tree Napper.
- The weighted blanket is Lauren's only and never covers Matt's side.
- Photos are styling illustrations, not exact product photography, and the page says so.

## Changing photos

Replace a file in `assets/` under the same name. Then bump the `?v=` value in `image-manifest.js` so browsers fetch the new version.

## Testing

```
python3 -m http.server 8765 --bind 127.0.0.1   # from the repo root
node the-bed-edit/tests/browser-qa.cjs
node the-bed-edit/tests/pillow-qa.cjs
```

The same tests run automatically on GitHub for every pull request and every push to `main` (`.github/workflows/bed-edit-ux-qa.yml`).

## Publishing

GitHub Pages publishes `main` automatically. Merge a pull request and the live page updates within a minute or two.

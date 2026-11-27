(() => {
  'use strict';

  const { concepts } = window.BED_DATA;
  const manifest = window.BED_IMAGE_MANIFEST;
  const moods = ['classic', 'textured', 'airy'];
  const angles = ['hero', 'side', 'detail'];
  const angleNames = { hero: 'full room', side: 'side', detail: 'detail' };

  const seasons = {
    summer: {
      label: 'Summer',
      heading: 'Cool & pared back',
      desc: 'Crisp percale sheets, silk cases and the lightweight wool duvet. Fold back the duvet when needed; the included quilt can be stored.',
      chips: ['Percale sheets', 'Silk pillowcases', 'Light wool duvet', 'Quilt stored']
    },
    transitional: {
      label: 'Spring / Fall',
      heading: 'Softly layered',
      desc: 'The same sheets and duvet, with the included quilt folded at the foot and pulled up when the evening turns cool. No second collection to buy.',
      chips: ['Percale sheets', 'Silk pillowcases', 'Light wool duvet', 'Quilt at foot']
    },
    winter: {
      label: 'Winter',
      heading: 'Warmth without heaviness',
      desc: 'Layer the included cotton quilt over the lightweight wool duvet. Lauren can add her personal weighted blanket on her side; Matt can fold back extra layers.',
      chips: ['Percale sheets', 'Silk pillowcases', 'Light wool duvet', 'Quilt layered']
    }
  };

  const state = { concept: 0, season: 'summer', angle: 'hero', favorite: null };

  const $ = id => document.getElementById(id);
  const two = n => String(n).padStart(2, '0');
  const money = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  const total = c => c.products.reduce((t, p) => ({ lo: t.lo + p.pricing.lo, hi: t.hi + p.pricing.hi }), { lo: 0, hi: 0 });
  const price = t => money(t.lo) + (Math.round(t.lo) === Math.round(t.hi) ? '' : '–' + money(t.hi));

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  /* Photos. The 318 KB legacy fallback set is only fetched if an approved photo is missing or fails. */
  let legacyPromise = null;
  let imageSeq = 0;

  function legacyImage(i, j) {
    if (!legacyPromise) {
      legacyPromise = window.BED_LEGACY_IMAGES ? Promise.resolve() : new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'legacy-images.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.append(s);
      });
    }
    return legacyPromise.then(() => window.BED_LEGACY_IMAGES[i][j]);
  }

  function loadImage(img, concept, season, angle, notice) {
    const i = concepts.indexOf(concept);
    const j = angles.indexOf(angle);
    const photoSeason = season === 'winter' ? 'winter' : 'summer';
    const expected = manifest[concept.id][photoSeason][angle];
    const token = String(++imageSeq);
    img.dataset.request = token;

    const useFallback = () => {
      img.onerror = null;
      notice.textContent = (season === 'transitional' ? 'Spring / Fall styling guide · ' : '') + 'Illustrative concept study · seasonal photography pending approval';
      img.alt = concept.name + ' bedding direction, ' + angleNames[angle] + ' view. Illustrative concept study, not exact product photography.';
      legacyImage(i, j).then(src => { if (img.dataset.request === token) img.src = src; }).catch(() => {});
    };

    if (window.BED_IMAGES_APPROVED !== true) { useFallback(); return; }

    img.onerror = useFallback;
    notice.textContent = season === 'transitional'
      ? 'Spring / Fall shown with the summer photo · illustrative styling, not product photography'
      : 'Illustrative styling image · not verified product photography';
    img.alt = concept.name + ' bedding direction, ' + angleNames[angle] + ' view, '
      + (season === 'transitional' ? 'spring/fall styling reference' : season + ' styling')
      + '. Concept illustration, not verified retail product photo.';
    if (img.getAttribute('src') !== expected) img.src = expected;
  }

  /* One-time builders */
  function buildLookStrip() {
    const node = $('conceptSwitch');
    concepts.forEach((c, i) => {
      const b = el('button', 'lookBtn');
      b.type = 'button';
      b.dataset.concept = String(i);
      b.setAttribute('aria-pressed', String(i === state.concept));
      b.append(el('span', 'num', two(i + 1)), el('span', 'name', c.name), el('span', 'price', price(total(c))));
      b.addEventListener('click', () => { state.concept = i; render(); });
      node.append(b);
    });
    document.querySelectorAll('[data-season]').forEach(b => b.addEventListener('click', () => { state.season = b.dataset.season; render(); }));
    document.querySelectorAll('[data-angle]').forEach(b => b.addEventListener('click', () => { state.angle = b.dataset.angle; render(); }));
  }

  function buildComparison() {
    const node = $('comparison');
    concepts.forEach((c, i) => {
      const card = el('article', 'compareCard');
      card.dataset.compare = String(i);
      const b = el('button', '', 'Choose as our favorite');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        if (state.favorite === i) { state.favorite = null; } else { state.favorite = i; state.concept = i; }
        render();
      });
      card.append(
        el('span', 'caps', two(i + 1) + ' / ' + c.eyebrow),
        el('h3', '', c.name),
        el('div', 'price', price(total(c))),
        el('p', '', c.cat),
        el('div', 'spacer'),
        b
      );
      node.append(card);
    });
  }

  /* Render everything that depends on the current selection */
  function render() {
    const c = concepts[state.concept];
    const t = total(c);
    const season = seasons[state.season];
    const number = two(state.concept + 1);

    document.body.dataset.mood = moods[state.concept] || moods[0];

    document.querySelectorAll('[data-concept]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.concept) === state.concept)));
    document.querySelectorAll('[data-season]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.season === state.season)));
    document.querySelectorAll('[data-angle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.angle === state.angle)));

    $('stickyLook').textContent = number + ' / ' + c.name;
    $('overNum').textContent = number;
    $('frameCount').textContent = two(angles.indexOf(state.angle) + 1) + ' / 03';
    $('pickIndex').textContent = number + ' / 03';
    $('selectedName').textContent = c.name;
    $('selectedTone').textContent = c.eyebrow;
    $('selectedDesc').textContent = c.description;
    $('swatches').replaceChildren(...c.palette.map(color => { const s = el('span'); s.style.backgroundColor = color; return s; }));
    $('seasonLabel').textContent = season.label;
    $('seasonHeading').textContent = season.heading;
    $('seasonDesc').textContent = season.desc;
    $('layerChips').replaceChildren(...season.chips.map(x => el('span', '', x)));
    $('selectedPrice').textContent = price(t);
    loadImage($('mainImage'), c, state.season, state.angle, $('photoNotice'));

    $('shoppingName').textContent = c.name;
    $('shoppingTotal').textContent = price(t);
    $('tableTotal').textContent = price(t);
    $('productRows').replaceChildren(...c.products.map((p, i) => {
      const li = el('li');
      const body = el('div', 'body');
      const link = el('a', '', 'Shop this item ');
      link.href = p.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const arrow = el('span', '', '↗');
      arrow.setAttribute('aria-hidden', 'true');
      link.append(el('span', 'sr-only', p.name + ' (opens in a new tab) '), arrow);
      body.append(
        el('h3', '', p.name + ' · Qty ' + p.qty),
        el('p', 'desc', p.description),
        el('p', 'pick', p.variantToSelect),
        el('p', 'note', p.note),
        link
      );
      li.append(el('span', 'index', two(i + 1)), body, el('span', 'amount', price(p.pricing)));
      return li;
    }));

    document.querySelectorAll('[data-compare]').forEach(card => {
      const i = Number(card.dataset.compare);
      const isFavorite = state.favorite === i;
      const b = card.querySelector('button');
      card.classList.toggle('favorite', isFavorite);
      b.textContent = isFavorite ? '✓ Our favorite' : 'Choose as our favorite';
      b.setAttribute('aria-pressed', String(isFavorite));
    });
    $('favoriteStatement').textContent = state.favorite === null ? 'Choose your favorite direction.' : 'Our favorite: ' + concepts[state.favorite].name + '.';
    $('copyButton').textContent = state.favorite === null ? 'Copy selected look shopping list' : 'Copy favorite shopping list';
  }

  async function copyList() {
    const c = concepts[state.favorite === null ? state.concept : state.favorite];
    const message = 'THE BED EDIT — ' + c.name
      + '\nComplete all-season Queen collection · planning estimate ' + price(total(c)) + ' (USD, before tax/shipping)\n\n'
      + c.products.map((p, i) => (i + 1) + '. ' + p.name + ' — quantity ' + p.qty + ' — ' + price(p.pricing) + '\n' + p.url + '\nSelection: ' + p.variantToSelect + '\n' + p.note).join('\n\n')
      + '\n\nVerify Queen sizes, stock and current prices before buying.';
    const status = $('copyStatus');
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Shopping list copied.';
    } catch (err) {
      const area = el('textarea');
      area.value = message;
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.append(area);
      area.select();
      const success = document.execCommand('copy');
      area.remove();
      status.textContent = success ? 'Shopping list copied.' : 'Unable to copy automatically; use your browser copy controls.';
    }
  }

  buildLookStrip();
  buildComparison();
  $('copyButton').addEventListener('click', copyList);
  render();
})();

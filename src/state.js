import { DEFAULTS, LIMITS } from './calc.js';

const STORE_KEY = 'asbf-calc-v1';
const LANG_KEY = 'asbf-calc-lang';

// Short URL parameter names for the share link.
const PARAMS = {
  f: 'financing',
  t: 'tenure',
  r: 'rate',
  k: 'takaful',
  d: 'dividend',
  b: 'balance',
  s: 'salary',
  c: 'commitments',
  y: 'year',
  x: 'exitFee',
  a: 'installment',
};

const MONEY_MAX = 100000000;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const round = (n, dp) => +n.toFixed(dp);

/** Coerce anything (URL, storage) into a valid inputs object. */
export function sanitize(raw) {
  const out = { ...DEFAULTS };
  if (!raw || typeof raw !== 'object') return out;
  for (const key of Object.keys(LIMITS)) {
    const n = Number(raw[key]);
    const { min, max, dp } = LIMITS[key];
    if (raw[key] !== null && raw[key] !== '' && Number.isFinite(n)) out[key] = round(clamp(n, min, max), dp);
  }
  for (const key of ['takaful', 'balance', 'salary', 'commitments', 'exitFee', 'installment']) {
    if (!(key in raw)) continue;
    if (raw[key] === null || raw[key] === '') {
      out[key] = null;
      continue;
    }
    const n = Number(raw[key]);
    if (Number.isFinite(n)) out[key] = round(clamp(n, 0, MONEY_MAX), 2);
  }
  const y = Number(raw.year);
  out.year = clamp(Number.isFinite(y) && raw.year !== null ? Math.round(y) : DEFAULTS.year, 1, out.tenure);
  return out;
}

export function fromUrl(search) {
  const q = new URLSearchParams(search);
  const raw = {};
  let found = false;
  for (const [short, key] of Object.entries(PARAMS)) {
    if (q.has(short)) {
      raw[key] = q.get(short);
      found = true;
    }
  }
  const lang = q.get('lang');
  return { inputs: found ? sanitize(raw) : null, lang: lang === 'en' || lang === 'bm' ? lang : null };
}

export function toUrl(inputs, lang) {
  const q = new URLSearchParams();
  for (const [short, key] of Object.entries(PARAMS)) q.set(short, inputs[key] ?? '');
  q.set('lang', lang);
  return `${location.origin}${location.pathname}?${q}`;
}

export function loadInitial() {
  let stored = null;
  let lang = null;
  try {
    stored = JSON.parse(localStorage.getItem(STORE_KEY));
    lang = localStorage.getItem(LANG_KEY);
  } catch {
    /* storage unavailable or corrupt: fall back to defaults */
  }
  const url = fromUrl(location.search);
  if (url.inputs || url.lang) {
    try {
      history.replaceState(null, '', location.pathname);
    } catch {
      /* ignore */
    }
  }
  return {
    inputs: url.inputs || sanitize(stored),
    lang: url.lang || (lang === 'en' ? 'en' : 'bm'),
  };
}

export function save(inputs, lang) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(inputs));
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

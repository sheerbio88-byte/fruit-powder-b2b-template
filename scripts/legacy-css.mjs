/**
 * Post-build CSS compatibility pass for old Chromium (Edge/Chrome 92, Win7/8).
 *
 * Tailwind v4 output puts every rule inside cascade layers (@layer = Chromium 99+)
 * and uses oklch()/color-mix()/nesting/media ranges/individual transform
 * properties. Chromium < 99 drops whole @layer blocks, so pages render unstyled.
 *
 * This script rewrites dist/**\/*.css and inline <style> blocks in dist HTML:
 *   1. Flattens @layer: layer blocks are re-emitted in declared layer order and
 *      every UNLAYERED rule gets +1 id specificity (`:not(#\#)`), so unlayered
 *      CSS keeps beating layered CSS exactly as with native cascade layers.
 *   2. Lightning CSS with chrome/edge 92 targets: oklch/oklab/lab -> rgb fallbacks
 *      (custom properties via @supports), static color-mix() resolved, nesting
 *      and media range syntax lowered, vendor prefixes added.
 *   3. color-mix() with var() (cannot be resolved statically) gets a preceding
 *      plain-color fallback declaration; `translate`/`rotate`/`scale` get a
 *      `transform` fallback inside `@supports not (translate:0)`.
 * Modern browsers keep the original modern values (fallbacks come first or are
 * gated by @supports). Hashed /_astro CSS files are renamed (new content hash)
 * and references in HTML/JS updated, so immutable caches never serve old CSS.
 *
 * Runs as the last step of `npm run build`.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const DIST = resolve(process.argv[2] || fileURLToPath(new URL('../dist/', import.meta.url)));
const v = (major) => major << 16;
const targets = { chrome: v(92), edge: v(92), firefox: v(90), safari: v(14) };

async function* walk(dir, exts) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p, exts);
    else if (exts.some((e) => entry.name.endsWith(e))) yield p;
  }
}

const inKeyframes = (node) => {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'atrule' && /keyframes$/i.test(p.name)) return true;
  }
  return false;
};
const hasRuleAncestor = (node) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === 'rule') return true;
  return false;
};

const LEGACY_PSEUDO_ELEMENTS = new Set([':before', ':after', ':first-line', ':first-letter']);
const bumpSelector = selectorParser((selectors) => {
  selectors.each((sel) => {
    const bump = selectorParser.pseudo({ value: ':not' });
    const inner = selectorParser.selector();
    inner.append(selectorParser.id({ value: '\\#' }));
    bump.append(inner);
    let pe = null;
    sel.each((n) => {
      if (pe) return;
      if (n.type === 'pseudo' && (n.value.startsWith('::') || LEGACY_PSEUDO_ELEMENTS.has(n.value.toLowerCase()))) pe = n;
    });
    if (pe) sel.insertBefore(pe, bump);
    else sel.append(bump);
  });
});

/** Step 1: remove @layer, preserving the layered cascade. */
function flattenLayers(css) {
  const root = postcss.parse(css);
  const order = [];
  const buckets = new Map();
  const preamble = [];
  const unlayered = [];
  let anon = 0;
  const addName = (n) => {
    if (!buckets.has(n)) {
      buckets.set(n, []);
      order.push(n);
    }
  };
  const unwrapNested = (node) => {
    node.walkAtRules('layer', (at) => {
      if (at.nodes) at.replaceWith(at.nodes);
      else at.remove();
    });
  };
  for (const node of [...root.nodes]) {
    if (node.type === 'atrule' && node.name.toLowerCase() === 'layer') {
      if (!node.nodes) {
        node.params.split(',').map((s) => s.trim()).filter(Boolean).forEach(addName);
      } else {
        const name = node.params.trim() || `__anon${anon++}`;
        addName(name);
        unwrapNested(node);
        buckets.get(name).push(...node.nodes);
      }
      continue;
    }
    if (node.type === 'atrule' && /^(charset|import|namespace)$/i.test(node.name)) {
      preamble.push(node);
      continue;
    }
    if (node.type === 'comment') continue;
    // Layered blocks nested in conditional rules (rare): unwrap in place, no bump.
    let layeredInside = false;
    if (node.type === 'atrule') node.walkAtRules('layer', () => (layeredInside = true));
    if (layeredInside) {
      unwrapNested(node);
      unlayered.push(node);
      continue;
    }
    const bumpRule = (rule) => {
      if (inKeyframes(rule) || hasRuleAncestor(rule)) return;
      rule.selector = bumpSelector.processSync(rule.selector);
    };
    if (node.type === 'rule') bumpRule(node);
    else if (node.type === 'atrule') node.walkRules(bumpRule);
    unlayered.push(node);
  }
  const out = postcss.root();
  for (const n of preamble) out.append(n.clone());
  for (const name of order) for (const n of buckets.get(name)) out.append(n.clone());
  for (const n of unlayered) out.append(n.clone());
  return out.toString();
}

/** Step 2: Lightning CSS lowering. */
function lower(code, filename) {
  try {
    return transform({ filename, code: Buffer.from(code), minify: true, targets }).code.toString();
  } catch (e) {
    console.warn(`legacy-css: ${filename}: ${e.message} -> retrying with errorRecovery`);
    const r = transform({ filename, code: Buffer.from(code), minify: true, targets, errorRecovery: true });
    for (const w of r.warnings) console.warn(`  warning: ${w.message}`);
    return r.code.toString();
  }
}

/** Split a value on top-level occurrences of `sep` (space or comma). */
function splitTop(value, sep) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0 && (sep === ' ' ? /\s/.test(ch) : ch === sep)) {
      if (cur.trim()) parts.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/** Replace every color-mix(...) with its first color argument (approximate fallback). */
function stripColorMix(value) {
  let out = '';
  let i = 0;
  while (i < value.length) {
    const j = value.indexOf('color-mix(', i);
    if (j === -1) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, j);
    let depth = 0;
    let k = j + 'color-mix'.length;
    for (; k < value.length; k++) {
      if (value[k] === '(') depth++;
      else if (value[k] === ')' && --depth === 0) break;
    }
    const args = splitTop(value.slice(j + 'color-mix('.length, k), ',');
    const first = splitTop(args[1] || '', ' ').filter((t) => !/%$/.test(t))[0];
    out += stripColorMix(first || 'transparent');
    i = k + 1;
  }
  return out;
}

const TRANSFORM_PROPS = new Set(['translate', 'rotate', 'scale']);
const LEGACY_PROPERTY_DEFS =
  '@property --tw-legacy-translate{syntax:"*";inherits:false;initial-value:translate(0)}' +
  '@property --tw-legacy-rotate{syntax:"*";inherits:false;initial-value:rotate(0)}' +
  '@property --tw-legacy-scale{syntax:"*";inherits:false;initial-value:scale(1)}';

function legacyTransformValue(prop, value) {
  const v = value.trim();
  if (/^none$/i.test(v)) return { translate: 'translate(0)', rotate: 'rotate(0)', scale: 'scale(1)' }[prop];
  const t = splitTop(v, ' ');
  if (prop === 'translate') {
    if (t.length === 1) return `translate(${t[0]})`;
    if (t.length === 2) return `translate(${t[0]},${t[1]})`;
    if (t.length === 3) return `translate3d(${t[0]},${t[1]},${t[2]})`;
  }
  if (prop === 'rotate' && t.length === 1) return `rotate(${t[0]})`;
  if (prop === 'scale') {
    if (t.length === 1) return `scale(${t[0]})`;
    if (t.length === 2) return `scale(${t[0]},${t[1]})`;
    if (t.length === 3) return `scale3d(${t[0]},${t[1]},${t[2]})`;
  }
  return null;
}

/** Step 3: fallbacks Lightning CSS cannot produce. */
function addFallbacks(css) {
  const root = postcss.parse(css);
  let usedTransform = false;
  root.walkRules((rule) => {
    if (inKeyframes(rule)) return;
    // color-mix() with var(): plain-color fallback before it.
    let inMixSupports = false;
    for (let p = rule.parent; p; p = p.parent) {
      if (p.type === 'atrule' && p.name === 'supports' && /color-mix/.test(p.params)) inMixSupports = true;
    }
    if (!inMixSupports) {
      rule.walkDecls((decl) => {
        if (decl.prop.startsWith('--') || !decl.value.includes('color-mix(')) return;
        const prev = decl.prev();
        if (prev && prev.type === 'decl' && prev.prop === decl.prop && !prev.value.includes('color-mix(')) return;
        decl.cloneBefore({ value: stripColorMix(decl.value) });
      });
    }
    // translate/rotate/scale -> transform fallback for browsers without them.
    const legacy = [];
    rule.each((decl) => {
      if (decl.type !== 'decl' || !TRANSFORM_PROPS.has(decl.prop)) return;
      const fn = legacyTransformValue(decl.prop, decl.value);
      if (fn) legacy.push(`--tw-legacy-${decl.prop}:${fn}`);
    });
    if (legacy.length) {
      usedTransform = true;
      const block = postcss.parse(
        `@supports not (translate:0){${rule.selector}{${legacy.join(';')};transform:var(--tw-legacy-translate) var(--tw-legacy-rotate) var(--tw-legacy-scale)}}`
      );
      rule.after(block.nodes);
    }
  });
  let out = root.toString();
  if (usedTransform) out = out + LEGACY_PROPERTY_DEFS;
  return out;
}

function processCss(css, filename) {
  return addFallbacks(lower(flattenLayers(css), filename));
}

function check(css, where) {
  if (/@layer\b/.test(css)) throw new Error(`legacy-css: @layer still present in ${where}`);
}

if (!existsSync(DIST)) throw new Error(`legacy-css: ${DIST} not found (run astro build first)`);

const renames = new Map();
let files = 0;
for await (const file of walk(DIST, ['.css'])) {
  const src = await readFile(file, 'utf8');
  const out = processCss(src, file);
  check(out, file);
  let target = file;
  const m = basename(file).match(/^(.*)\.([A-Za-z0-9_-]{8})\.css$/);
  if (m) {
    const hash = createHash('sha256').update(out).digest('base64url').slice(0, 8);
    target = join(dirname(file), `${m[1]}.${hash}.css`);
    renames.set(basename(file), basename(target));
  }
  await writeFile(file, out);
  if (target !== file) await rename(file, target);
  files++;
  console.log(`legacy-css: ${file.slice(DIST.length + 1)} -> ${basename(target)} (${src.length} -> ${out.length} bytes)`);
}

const styleCache = new Map();
let htmlChanged = 0;
for await (const file of walk(DIST, ['.html', '.htm', '.js', '.mjs'])) {
  const text = await readFile(file, 'utf8');
  let next = text;
  for (const [from, to] of renames) next = next.split(from).join(to);
  if (/\.html?$/.test(file)) {
    next = next.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (all, open, css, close) => {
      if (/type=["']?(?!text\/css)[a-z]/i.test(open) || !css.trim()) return all;
      if (!styleCache.has(css)) {
        const out = processCss(css, `${file} <style>`);
        check(out, `${file} <style>`);
        styleCache.set(css, out);
      }
      return open + styleCache.get(css) + close;
    });
  }
  if (next !== text) {
    await writeFile(file, next);
    htmlChanged++;
  }
}
console.log(`legacy-css: ${files} CSS file(s), ${styleCache.size} distinct inline <style> block(s), ${htmlChanged} HTML/JS file(s) updated`);

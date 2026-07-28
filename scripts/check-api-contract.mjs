#!/usr/bin/env node
/**
 * Checks that every endpoint the frontend calls actually exists in the backend.
 *
 * Existing api/*.test.js files mock axios and assert the URL the code itself
 * defines, so they pass even when the route was never implemented. This script
 * compares the two repositories instead.
 *
 * Usage:  node scripts/check-api-contract.mjs [--json]
 *         BACKEND_PATH=/path/to/tfg-backend node scripts/check-api-contract.mjs
 *
 * Exits 1 if a frontend call has no matching backend route.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BACKEND_ROOT = resolve(
  process.env.BACKEND_PATH || join(FRONTEND_ROOT, '..', '..', 'BACKEND', 'tfg-backend')
);

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

/** Collects `app.use('<prefix>', <routerVar>)` plus the require() each var came from. */
function readMountPoints(appSource) {
  const varToFile = new Map();
  const requireRe = /const\s+(\w+)\s*=\s*require\(['"]\.\/routes\/([\w.]+)['"]\)/g;
  for (const m of appSource.matchAll(requireRe)) varToFile.set(m[1], `${m[2]}.js`);

  const mounts = new Map(); // file -> [prefix, ...]
  const useRe = /app\.use\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)\s*\)/g;
  for (const m of appSource.matchAll(useRe)) {
    const file = varToFile.get(m[2]);
    if (!file) continue;
    if (!mounts.has(file)) mounts.set(file, []);
    mounts.get(file).push(m[1] === '/' ? '' : m[1]);
  }
  return mounts;
}

/** Extracts router.<method>('<path>') declarations, including multi-line calls. */
function readRoutes(source) {
  const found = [];
  const re = new RegExp(`router\\.(${METHODS.join('|')})\\(\\s*['"\`]([^'"\`]+)['"\`]`, 'g');
  for (const m of source.matchAll(re)) found.push({ method: m[1].toUpperCase(), path: m[2] });
  return found;
}

/** Extracts api.<method>('<url>') / api.<method>(`<url>`) calls from the frontend. */
function readCalls(source, file) {
  const found = [];
  const re = new RegExp(`api\\.(${METHODS.join('|')})\\(\\s*['"\`]([^'"\`]+)['"\`]`, 'g');
  for (const m of source.matchAll(re)) {
    const line = source.slice(0, m.index).split('\n').length;
    found.push({ method: m[1].toUpperCase(), url: m[2], file, line });
  }
  return found;
}

/** `/api/projects/${id}/risks?lang=es` -> `/api/projects/:p/risks` */
function normalize(url) {
  return (
    url
      .split('?')[0]
      .replace(/\$\{[^}]*\}/g, ':p')
      .replace(/\/+$/, '') || '/'
  );
}

function toRegex(routePath) {
  const body = routePath
    .replace(/\/+$/, '')
    .split('/')
    .map((seg) => (seg.startsWith(':') ? ':p' : seg))
    .join('/');
  return (body || '/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collect() {
  const appFile = join(BACKEND_ROOT, 'src', 'app.js');
  if (!existsSync(appFile)) {
    console.error(`Backend not found at ${BACKEND_ROOT}`);
    console.error('Set its location with BACKEND_PATH=/path/to/tfg-backend');
    process.exit(2);
  }

  const mounts = readMountPoints(readFileSync(appFile, 'utf8'));
  const backend = []; // { method, path, key, file }
  const routesDir = join(BACKEND_ROOT, 'src', 'routes');
  for (const file of readdirSync(routesDir).filter((f) => f.endsWith('.js'))) {
    const prefixes = mounts.get(file);
    if (!prefixes) continue;
    const routes = readRoutes(readFileSync(join(routesDir, file), 'utf8'));
    for (const prefix of prefixes) {
      for (const r of routes) {
        const full = `${prefix}${r.path === '/' ? '' : r.path}` || '/';
        backend.push({ method: r.method, path: full, key: `${r.method} ${toRegex(full)}`, file });
      }
    }
  }

  const calls = [];
  const apiDir = join(FRONTEND_ROOT, 'src', 'api');
  for (const file of readdirSync(apiDir)) {
    if (!file.endsWith('.js') || file.endsWith('.test.js')) continue;
    calls.push(...readCalls(readFileSync(join(apiDir, file), 'utf8'), `src/api/${file}`));
  }

  return { backend, calls };
}

const { backend, calls } = collect();
const backendKeys = new Set(backend.map((r) => r.key));
const orphans = calls.filter((c) => !backendKeys.has(`${c.method} ${toRegex(normalize(c.url))}`));

// Backend routes no frontend api/*.js call reaches. Debug-only routes are
// expected to be unused by the app, so flag them separately, not as findings.
const calledKeys = new Set(calls.map((c) => `${c.method} ${toRegex(normalize(c.url))}`));
const unused = backend
  .filter((r) => !calledKeys.has(r.key))
  .map((r) => ({ ...r, debug: /\/debug(\/|$)/.test(r.path) }));

if (process.argv.includes('--unused')) {
  const real = unused.filter((r) => !r.debug);
  const debug = unused.filter((r) => r.debug);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ total: backend.length, unused: real, debugOnly: debug }, null, 2));
  } else {
    console.log(`\n${real.length} of ${backend.length} backend routes have no frontend api/ call:\n`);
    for (const r of real) console.log(`  ${r.method.padEnd(6)} ${r.path}\n         (${r.file})`);
    if (debug.length) {
      console.log(`\n${debug.length} debug-only routes (expected unused):`);
      for (const r of debug) console.log(`  ${r.method.padEnd(6)} ${r.path}`);
    }
    console.log('');
  }
  process.exit(0);
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ checked: calls.length, orphans }, null, 2));
} else if (orphans.length === 0) {
  console.log(`OK  ${calls.length} frontend calls, all matched to a backend route.`);
} else {
  console.error(`\n${orphans.length} of ${calls.length} frontend calls have no backend route:\n`);
  for (const o of orphans)
    console.error(`  ${o.method.padEnd(6)} ${o.url}\n         ${o.file}:${o.line}`);
  console.error('');
}

process.exit(orphans.length === 0 ? 0 : 1);

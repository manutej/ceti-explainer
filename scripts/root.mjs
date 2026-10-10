// root.mjs: find the plugin root (the directory that holds .claude-plugin/plugin.json).
//   import { cetiRoot, rootPath } from '<rel>/scripts/root.mjs';
//   const ROOT = cetiRoot(import.meta.url);   // null when not inside the plugin (callers keep their old fallback)
// Order: $CETI_ROOT, then $CLAUDE_PLUGIN_ROOT, then walk up from `start` (a file URL, file or directory).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKER = path.join('.claude-plugin', 'plugin.json');
const isRoot = d => !!d && fs.existsSync(path.join(d, MARKER));

export function cetiRoot(start) {
  for (const env of ['CETI_ROOT', 'CLAUDE_PLUGIN_ROOT']) {
    const d = process.env[env];
    if (d && isRoot(path.resolve(d))) return path.resolve(d);
  }
  let d = start ? (String(start).startsWith('file:') ? fileURLToPath(start) : path.resolve(String(start))) : process.cwd();
  if (fs.existsSync(d) && fs.statSync(d).isFile()) d = path.dirname(d);
  for (;;) {
    if (isRoot(d)) return d;
    const up = path.dirname(d);
    if (up === d) return null;
    d = up;
  }
}

export function rootPath(start, ...parts) {
  const r = cetiRoot(start);
  if (!r) throw new Error(`plugin root not found (no ${MARKER} above ${start}; set CETI_ROOT)`);
  return path.join(r, ...parts);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const r = cetiRoot(process.argv[2]);
  console.log(r || ''); process.exit(r ? 0 : 1);
}

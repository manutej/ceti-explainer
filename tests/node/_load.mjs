// Load the browser runtime (and optionally library files) into a Node vm, the way library/operad/check.mjs does.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { cetiRoot } from '../../scripts/root.mjs';

export const ROOT = cetiRoot(import.meta.url);
export function load(...files) {
  const sandbox = { console, structuredClone, Math, JSON };
  sandbox.globalThis = sandbox; vm.createContext(sandbox);
  for (const f of ['runtime/dist/atelier.js', ...files])
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
  return sandbox;
}

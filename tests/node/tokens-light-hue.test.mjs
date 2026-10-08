// C2 (e)6: tokensLight moves hue (it is a curated set, not a pure L/C retune). Pin the bound the comment should state:
// every light token stays within 20 degrees of its dark twin, and copper and peach stay distinct.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.mjs';

const { Atelier } = load();
const C = Atelier.U.color;
const dark = Atelier.tokens, light = Atelier.U.color.tokensFor('#F2EDE3');
const dh = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const deg = h => (h * 180 / Math.PI);

test('light tokens keep hue within 20 degrees', () => {
  for (const k of ['copper', 'sage', 'peach', 'slate']) {
    const a = deg(C.toOklch(dark[k]).h), b = deg(C.toOklch(light[k]).h);
    assert.ok(dh(a, b) <= 20, `${k}: ${a.toFixed(1)} -> ${b.toFixed(1)}`);
  }
});

test('copper and peach stay distinct on light grounds', () => {
  const a = deg(C.toOklch(light.copper).h), b = deg(C.toOklch(light.peach).h);
  assert.ok(dh(a, b) >= 20, `copper ${a.toFixed(1)} vs peach ${b.toFixed(1)}`);
});

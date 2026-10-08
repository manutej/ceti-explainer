// C2 (e)3: AM.cam.mix with equal zoom must pan (the centre used to stay at `a`).
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.mjs';

const { AM } = load('library/operad/am.js');

test('equal-zoom mix pans linearly', () => {
  const m = AM.cam.mix({ x: 0, y: 0, z: 2 }, { x: 100, y: 0, z: 2 }, 0.5);
  assert.equal(m.x, 50); assert.equal(m.y, 0); assert.equal(m.z, 2);
  assert.equal(AM.cam.mix({ x: 0, y: 10, z: 1 }, { x: 0, y: 30, z: 1 }, 0.25).y, 15);
});

test('zooming mix keeps its end points', () => {
  const a = { x: 0, y: 0, z: 1 }, b = { x: 200, y: 100, z: 4 };
  const m0 = AM.cam.mix(a, b, 0), m1 = AM.cam.mix(a, b, 1);
  assert.deepEqual([m0.x, m0.y], [0, 0]);
  assert.ok(Math.abs(m1.x - 200) < 1e-9 && Math.abs(m1.y - 100) < 1e-9 && Math.abs(m1.z - 4) < 1e-9);
});

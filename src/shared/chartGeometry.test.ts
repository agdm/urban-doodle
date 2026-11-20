import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  placeMarkers,
  plotArea,
  polylinePoints,
  rangeOf,
  xForTime,
  yForPct,
} from './chartGeometry.ts';

const area = plotArea({
  width: 342,
  height: 200,
  padding: { top: 10, right: 4, bottom: 30, left: 32 },
});
const range = { start: '2026-11-13T14:00:00Z', end: '2026-11-13T23:00:00Z' };

test('plotArea subtracts padding', () => {
  assert.deepEqual(area, { left: 32, right: 338, top: 10, bottom: 170 });
});

test('yForPct maps 0/50/100 to bottom/middle/top and clamps', () => {
  assert.equal(yForPct(area, 0), 170);
  assert.equal(yForPct(area, 50), 90);
  assert.equal(yForPct(area, 100), 10);
  assert.equal(yForPct(area, 140), 10);
});

test('xForTime spans the range and pins outside times to the edges', () => {
  assert.equal(xForTime(area, range, range.start), 32);
  assert.equal(xForTime(area, range, range.end), 338);
  assert.equal(xForTime(area, range, '2026-11-14T05:00:00Z'), 338);
  assert.equal(xForTime(area, { start: range.end, end: range.end }, range.end), 338);
});

test('polylinePoints joins x,y pairs', () => {
  const pts = polylinePoints(area, range, [
    { at: range.start, yesPct: 50 },
    { at: range.end, yesPct: 62 },
  ]);
  assert.equal(pts, '32,90 338,70.8');
});

test('placeMarkers keeps marker data and adds coordinates', () => {
  const [m] = placeMarkers(area, range, [{ at: range.end, side: 'no', yesPct: 62 }]);
  assert.deepEqual(m, { at: range.end, side: 'no', yesPct: 62, x: 338, y: 70.8 });
});

test('rangeOf spans first to last point and is null for no points', () => {
  assert.equal(rangeOf([]), null);
  assert.deepEqual(rangeOf([{ at: 'a', yesPct: 1 }, { at: 'b', yesPct: 2 }]), {
    start: 'a',
    end: 'b',
  });
});

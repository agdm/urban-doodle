import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, localDate, zonedTime } from './time.ts';

test('localDate names the calendar day in the given zone', () => {
  const at = new Date('2026-11-14T03:00:00Z');
  assert.equal(localDate(at, 'America/New_York'), '2026-11-13');
  assert.equal(localDate(at, 'UTC'), '2026-11-14');
});

test('addDays rolls over months and years', () => {
  assert.equal(addDays('2026-11-30', 1), '2026-12-01');
  assert.equal(addDays('2027-01-01', -1), '2026-12-31');
});

test('zonedTime finds the UTC instant for a local wall-clock hour, across DST', () => {
  assert.equal(
    zonedTime('2026-11-14', 0, 'America/Denver'),
    '2026-11-14T07:00:00.000Z'
  );
  assert.equal(
    zonedTime('2026-11-15', 7, 'America/New_York'),
    '2026-11-15T12:00:00.000Z'
  );
  assert.equal(
    zonedTime('2026-07-01', 0, 'America/New_York'),
    '2026-07-01T04:00:00.000Z'
  );
  // The day DST ends in the US: midnight is still on daylight time.
  assert.equal(
    zonedTime('2026-11-01', 0, 'America/New_York'),
    '2026-11-01T04:00:00.000Z'
  );
});

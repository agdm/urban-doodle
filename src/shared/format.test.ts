import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  durationUntil,
  formatCount,
  formatDuration,
  formatMeasurement,
  formatScope,
  formatForecast,
  formatLine,
  formatSignedPoints,
  formatShortDate,
  formatWeatherDate,
  formatWeekday,
} from './format.ts';

test('formatSignedPoints adds a + to positive numbers', () => {
  assert.equal(formatSignedPoints(62), '+62');
  assert.equal(formatSignedPoints(-38), '-38');
  assert.equal(formatSignedPoints(0), '0');
});

test('formatCount adds thousands separators', () => {
  assert.equal(formatCount(2184), '2,184');
});

test('formatMeasurement appends the unit suffix', () => {
  assert.equal(formatMeasurement({ value: 48.5, unit: 'F' }), '48.5°F');
  assert.equal(formatMeasurement({ value: 0.31, unit: 'in' }), '0.31 in');
  assert.equal(formatMeasurement({ value: 70, unit: '%' }), '70%');
});

test('formatScope prefixes subreddits with r/ and names the all scope', () => {
  assert.equal(formatScope({ kind: 'subreddit', name: 'Denver' }), 'r/Denver');
  assert.equal(formatScope({ kind: 'all' }), 'All Reddit');
});

test('durationUntil floors to whole minutes and never goes negative; formatDuration drops zero hours', () => {
  const d = durationUntil('2026-11-14T07:00:00Z', '2026-11-13T21:48:00Z');
  assert.deepEqual(d, { hours: 9, minutes: 12 });
  assert.equal(formatDuration(d), '9h 12m');
  assert.equal(formatDuration({ hours: 0, minutes: 45 }), '45m');
  assert.deepEqual(durationUntil('2026-11-13T00:00:00Z', '2026-11-14T00:00:00Z'), {
    hours: 0,
    minutes: 0,
  });
});

test('formatLine, formatForecast and formatWeatherDate produce display strings', () => {
  assert.equal(formatLine({ metric: 'highTemp', comparison: 'gt', value: 48.5, unit: 'F' }), '48.5°F');
  assert.equal(formatForecast({ value: 49, unit: 'F' }), 'forecast 49°F');
  assert.equal(formatForecast({ value: 70, unit: '%' }), '70% chance');
  assert.equal(formatWeatherDate('2026-11-14'), 'Saturday, Nov 14');
});

test('formatShortDate and formatWeekday name the calendar day in any time zone', () => {
  assert.equal(formatShortDate('2026-11-13'), 'Fri, Nov 13');
  assert.equal(formatWeekday('2026-11-14'), 'Saturday');
});

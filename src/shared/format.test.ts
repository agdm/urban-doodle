import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  durationUntil,
  formatCount,
  formatDuration,
  formatMeasurement,
  formatScope,
  formatForecast,
  formatChoice,
  formatClockTime,
  formatHourShort,
  formatQuestionShort,
  formatSettles,
  formatLine,
  formatSignedPoints,
  formatShortDate,
  formatWeatherDate,
  formatWeekday,
} from './format.ts';
import type { Question } from './types.ts';

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

test('formatHourShort gives a compact local hour like 7a or 4p', () => {
  assert.equal(formatHourShort('2026-11-13T14:00:00Z', 'America/Denver'), '7a');
  assert.equal(formatHourShort('2026-11-13T23:00:00Z', 'America/Denver'), '4p');
  assert.equal(formatHourShort('2026-11-13T19:00:00Z', 'America/Denver'), '12p');
});

const question: Question = {
  id: 'q',
  weatherDate: '2026-11-14',
  city: { id: 'den', name: 'Denver', timeZone: 'America/Denver' },
  kind: 'overUnder',
  category: 'hometown',
  rule: { metric: 'highTemp', comparison: 'gt', value: 48.5, unit: 'F' },
  forecast: { value: 49, unit: 'F' },
  prompt: 'High over 48.5°F?',
  headline: "Will Denver's high be over 48.5°F?",
  opensAt: '2026-11-13T14:00:00Z',
  closesAt: '2026-11-14T07:00:00Z',
  settlesAt: '2026-11-15T12:00:00Z',
};

test('formatChoice adds the line to Over/Under calls only', () => {
  assert.equal(formatChoice(question, 'no'), 'Under 48.5°F');
  assert.equal(formatChoice({ ...question, kind: 'yesNo' }, 'yes'), 'Yes');
});

test('formatQuestionShort names the city and what is measured', () => {
  assert.equal(formatQuestionShort(question), 'Denver high');
  const rain: Question = {
    ...question,
    rule: { ...question.rule, metric: 'precipitation' },
  };
  assert.equal(formatQuestionShort(rain), 'Denver rain');
});

test('formatSettles gives the Eastern weekday and hour', () => {
  assert.equal(formatSettles('2026-11-15T12:00:00Z'), 'Sunday around 7am ET');
});

test('formatClockTime shows the lock in the reader\'s zone', () => {
  const lock = '2026-11-23T05:00:00Z'; // midnight Eastern
  assert.equal(formatClockTime(lock, 'America/New_York'), 'midnight');
  assert.equal(formatClockTime(lock, 'America/Denver'), '10pm');
  assert.equal(formatClockTime(lock, 'America/Los_Angeles'), '9pm');
  assert.equal(formatClockTime(lock, 'Asia/Kolkata'), '10:30am');
  assert.equal(formatClockTime('2026-11-23T17:00:00Z', 'America/New_York'), 'noon');
});

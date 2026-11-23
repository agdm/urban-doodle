import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sampleDay } from './sampleDay.ts';

// 4:48pm Eastern on Friday, Nov 13.
const now = new Date('2026-11-13T21:48:00Z');

test('sampleDay dates today around the Eastern calendar day', () => {
  const { today } = sampleDay(now);
  assert.equal(today.date, '2026-11-13');
  assert.equal(today.weatherDate, '2026-11-14');
  assert.equal(today.closesAt, '2026-11-14T05:00:00.000Z');
  const q = today.questions[0]?.question;
  assert.equal(q?.settlesAt, '2026-11-15T12:00:00.000Z');
});

test('sampleDay crowd history runs from the start of the day to now', () => {
  const { today, questions } = sampleDay(now);
  const trend = today.questions[0]?.trend ?? [];
  assert.equal(trend[0]?.at, '2026-11-13T05:00:00.000Z');
  assert.equal(trend[trend.length - 1]?.at, now.toISOString());
  const points = questions[0]?.subreddit.points ?? [];
  assert.equal(points[points.length - 1]?.at, now.toISOString());
});

test('sampleDay results cover yesterday, with calls inside the window they were open', () => {
  const { results, today } = sampleDay(now);
  assert.equal(results.weatherDate, '2026-11-12');
  assert.deepEqual(today.yesterday, results.scored);
  const call = results.scored[0]?.call.at ?? '';
  assert.ok(
    call >= '2026-11-11T05:00:00.000Z' && call <= '2026-11-12T05:00:00.000Z'
  );
});

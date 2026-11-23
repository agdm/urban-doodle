import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { TodayResponse } from '../../shared/api.ts';
import { api } from './api.ts';

test('GET /today returns the day in the TodayResponse shape', async () => {
  const res = await api.request('/today');
  assert.equal(res.status, 200);
  const body: TodayResponse = await res.json();
  assert.equal(body.type, 'today');
  assert.equal(body.questions.length, 3);
  assert.deepEqual(body.calls, []);
});

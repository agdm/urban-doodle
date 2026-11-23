import { test } from 'node:test';
import assert from 'node:assert/strict';
import type {
  ErrorResponse,
  QuestionResponse,
  ResultsResponse,
  TodayResponse,
} from '../../shared/api.ts';
import { api } from './api.ts';

test('GET /today returns the day in the TodayResponse shape', async () => {
  const res = await api.request('/today');
  assert.equal(res.status, 200);
  const body: TodayResponse = await res.json();
  assert.equal(body.type, 'today');
  assert.equal(body.questions.length, 3);
  assert.deepEqual(body.calls, []);
});

test('GET /question/:id returns that question with both crowds', async () => {
  const res = await api.request('/question/q-sea');
  assert.equal(res.status, 200);
  const body: QuestionResponse = await res.json();
  assert.equal(body.type, 'question');
  assert.equal(body.question.id, 'q-sea');
  assert.equal(body.all.scope.kind, 'all');
});

test('GET /question/:id answers 404 for an unknown question', async () => {
  const res = await api.request('/question/nope');
  assert.equal(res.status, 404);
  const body: ErrorResponse = await res.json();
  assert.equal(body.type, 'error');
});

test('GET /results returns the settled calls', async () => {
  const res = await api.request('/results');
  assert.equal(res.status, 200);
  const body: ResultsResponse = await res.json();
  assert.equal(body.type, 'results');
  assert.equal(body.scored.length, 3);
});

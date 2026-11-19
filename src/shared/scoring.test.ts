import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  crowdStance,
  payoutFor,
  priceFor,
  resolveRule,
  scoreCall,
  sideLabel,
  tallyDay,
} from './scoring.ts';
import type { Call, SettlementRule } from './types.ts';

test('priceFor uses the crowd % on the chosen side, clamped to 1-99', () => {
  assert.equal(priceFor(62, 'yes'), 62);
  assert.equal(priceFor(62, 'no'), 38);
  assert.equal(priceFor(61.6, 'yes'), 62);
  assert.equal(priceFor(100, 'yes'), 99);
  assert.equal(priceFor(100, 'no'), 1);
});

test('payoutFor wins 100 minus the price and risks the price', () => {
  assert.deepEqual(payoutFor(38), { win: 62, risk: 38 });
});

test('crowdStance is with the crowd above 50, against below 50, even at 50', () => {
  assert.equal(crowdStance(62), 'with');
  assert.equal(crowdStance(38), 'against');
  assert.equal(crowdStance(50), 'even');
});

test('sideLabel names sides Over/Under or Yes/No by question kind', () => {
  assert.equal(sideLabel('overUnder', 'yes'), 'Over');
  assert.equal(sideLabel('overUnder', 'no'), 'Under');
  assert.equal(sideLabel('yesNo', 'yes'), 'Yes');
  assert.equal(sideLabel('yesNo', 'no'), 'No');
});

test('resolveRule handles each comparison', () => {
  const over: SettlementRule = { metric: 'highTemp', comparison: 'gt', value: 48.5, unit: 'F' };
  assert.equal(resolveRule(over, 46), 'no');
  assert.equal(resolveRule(over, 49), 'yes');

  const rain: SettlementRule = { metric: 'precipitation', comparison: 'gte', value: 0.01, unit: 'in' };
  assert.equal(resolveRule(rain, 0.01), 'yes');
  assert.equal(resolveRule(rain, 0), 'no');

  const freeze: SettlementRule = { metric: 'lowTemp', comparison: 'lt', value: 32, unit: 'F' };
  assert.equal(resolveRule(freeze, 32), 'no');
  assert.equal(resolveRule(freeze, 31), 'yes');
});

test('scoreCall pays 100 - price when right, loses price when wrong', () => {
  const call: Call = { questionId: 'q', side: 'no', price: 38, at: '2026-11-13T21:00:00Z' };
  assert.equal(scoreCall(call, 'no'), 62);
  assert.equal(scoreCall(call, 'yes'), -38);
});

test('tallyDay sums points and counts calls that scored above zero', () => {
  assert.deepEqual(tallyDay([{ points: 62 }, { points: 29 }, { points: -47 }]), {
    points: 44,
    correct: 2,
    total: 3,
  });
});

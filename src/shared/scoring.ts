import type {
  Call,
  QuestionKind,
  SettlementRule,
  Side,
} from './types.ts';

export const MIN_PRICE = 1;
export const MAX_PRICE = 99;

export const otherSide = (side: Side): Side => (side === 'yes' ? 'no' : 'yes');

export const sideLabel = (kind: QuestionKind, side: Side): string => {
  if (kind === 'overUnder') return side === 'yes' ? 'Over' : 'Under';
  return side === 'yes' ? 'Yes' : 'No';
};

export const sidePct = (yesPct: number, side: Side): number =>
  side === 'yes' ? yesPct : 100 - yesPct;

// Clamped to 1-99 so every call can both win and lose points.
export const priceFor = (yesPct: number, side: Side): number => {
  const pct = Math.round(sidePct(yesPct, side));
  return Math.min(MAX_PRICE, Math.max(MIN_PRICE, pct));
};

export const leaningSide = (yesPct: number): Side | null => {
  if (yesPct > 50) return 'yes';
  if (yesPct < 50) return 'no';
  return null;
};

export type Payout = {
  win: number;
  risk: number;
};

export const payoutFor = (price: number): Payout => ({
  win: 100 - price,
  risk: price,
});

export type CrowdStance = 'with' | 'against' | 'even';

export const crowdStance = (price: number): CrowdStance => {
  if (price > 50) return 'with';
  if (price < 50) return 'against';
  return 'even';
};

export const resolveRule = (rule: SettlementRule, actual: number): Side => {
  switch (rule.comparison) {
    case 'gt':
      return actual > rule.value ? 'yes' : 'no';
    case 'gte':
      return actual >= rule.value ? 'yes' : 'no';
    case 'lt':
      return actual < rule.value ? 'yes' : 'no';
    case 'lte':
      return actual <= rule.value ? 'yes' : 'no';
  }
};

export const scoreCall = (call: Call, winningSide: Side): number => {
  const { win, risk } = payoutFor(call.price);
  return call.side === winningSide ? win : -risk;
};

export type DayTally = {
  points: number;
  correct: number;
  total: number;
};

export const tallyDay = (
  results: ReadonlyArray<{ points: number }>
): DayTally => ({
  points: results.reduce((sum, r) => sum + r.points, 0),
  correct: results.filter((r) => r.points > 0).length,
  total: results.length,
});

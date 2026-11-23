// Sample data from the design canvas. The server serves it until questions,
// crowds and results come from Redis; the component preview uses it too.
import type { QuestionResponse, ResultsResponse, TodayResponse } from './api.ts';
import type {
  AccuracyEntry,
  Call,
  CallMarker,
  City,
  CrowdPoint,
  PlayerStats,
  Question,
  ScoredCall,
} from './types.ts';

const series = (start: string, stepMinutes: number, values: number[]): CrowdPoint[] =>
  values.map((yesPct, i) => ({
    at: new Date(Date.parse(start) + i * stepMinutes * 60_000).toISOString(),
    yesPct,
  }));

// 4:48pm in Denver (UTC-7).
export const NOW = '2026-11-13T23:48:00Z';
export const CHART_RANGE = { start: '2026-11-13T14:00:00Z', end: '2026-11-13T23:48:00Z' };

const denver: City = { id: 'den', name: 'Denver', timeZone: 'America/Denver' };
const seattle: City = { id: 'sea', name: 'Seattle', timeZone: 'America/Los_Angeles' };
const sanDiego: City = { id: 'san', name: 'San Diego', timeZone: 'America/Los_Angeles' };

const times = {
  opensAt: '2026-11-13T14:00:00Z',
  closesAt: '2026-11-14T07:00:00Z',
  settlesAt: '2026-11-15T12:00:00Z',
};

export const denverQuestion: Question = {
  id: 'q-den',
  weatherDate: '2026-11-14',
  city: denver,
  kind: 'overUnder',
  category: 'hometown',
  rule: { metric: 'highTemp', comparison: 'gt', value: 48.5, unit: 'F' },
  forecast: { value: 49, unit: 'F' },
  prompt: 'High over 48.5°F?',
  headline: "Will Denver's high be over 48.5°F?",
  note: 'a cold front arrives late afternoon',
  ...times,
};

export const seattleQuestion: Question = {
  id: 'q-sea',
  weatherDate: '2026-11-14',
  city: seattle,
  kind: 'yesNo',
  category: 'rain',
  rule: { metric: 'precipitation', comparison: 'gte', value: 0.01, unit: 'in' },
  forecast: { value: 70, unit: '%' },
  prompt: 'Measurable rain tomorrow?',
  headline: 'Will Seattle get measurable rain on Saturday?',
  ...times,
};

export const sanDiegoQuestion: Question = {
  id: 'q-san',
  weatherDate: '2026-11-14',
  city: sanDiego,
  kind: 'overUnder',
  category: 'steady',
  rule: { metric: 'highTemp', comparison: 'gt', value: 67.5, unit: 'F' },
  forecast: { value: 68, unit: 'F' },
  prompt: 'High over 67.5°F?',
  headline: "Will San Diego's high be over 67.5°F?",
  ...times,
};

export const questions = [denverQuestion, seattleQuestion, sanDiegoQuestion];

const step = 73;

export const crowdByQuestion: Record<string, { yesPct: number; trend: CrowdPoint[] }> = {
  'q-den': { yesPct: 62, trend: series(CHART_RANGE.start, step, [50, 52, 55, 51, 58, 60, 57, 61, 62]) },
  'q-sea': { yesPct: 71, trend: series(CHART_RANGE.start, step, [50, 58, 63, 65, 69, 67, 71, 70, 71]) },
  'q-san': { yesPct: 47, trend: series(CHART_RANGE.start, step, [50, 48, 44, 50, 46, 48, 42, 46, 47]) },
};

export const denverSubSeries = crowdByQuestion['q-den']?.trend ?? [];
export const allRedditSeries = series(CHART_RANGE.start, step, [50, 51, 53, 52, 53, 55, 54, 54, 54]);

export const denverMarkers: CallMarker[] = [
  { at: '2026-11-13T15:00:00Z', side: 'yes', yesPct: 51 },
  { at: '2026-11-13T16:00:00Z', side: 'no', yesPct: 54 },
  { at: '2026-11-13T17:00:00Z', side: 'yes', yesPct: 54 },
  { at: '2026-11-13T18:10:00Z', side: 'no', yesPct: 55 },
  { at: '2026-11-13T19:10:00Z', side: 'yes', yesPct: 58 },
  { at: '2026-11-13T20:30:00Z', side: 'yes', yesPct: 58 },
  { at: '2026-11-13T21:30:00Z', side: 'no', yesPct: 58 },
  { at: '2026-11-13T22:50:00Z', side: 'yes', yesPct: 61 },
];

export const timeTicks = [
  { at: '2026-11-13T14:00:00Z', label: '7a' },
  { at: '2026-11-13T17:00:00Z', label: '10a' },
  { at: '2026-11-13T20:00:00Z', label: '1p' },
  { at: '2026-11-13T23:00:00Z', label: '4p' },
];

export const playerStats: PlayerStats = {
  seasonPoints: 1240,
  streakDays: 5,
  rank: { position: 14, scope: { kind: 'subreddit', name: 'Denver' } },
};

export const denverCall: Call = { questionId: 'q-den', side: 'no', price: 38, at: NOW };

export const yesterdayResults: ScoredCall[] = [
  {
    question: denverQuestion,
    call: { questionId: 'q-den', side: 'no', price: 38, at: '2026-11-12T20:00:00Z' },
    settlement: { questionId: 'q-den', actual: { value: 46, unit: 'F' }, winningSide: 'no', settledAt: '2026-11-13T12:00:00Z' },
    points: 62,
  },
  {
    question: seattleQuestion,
    call: { questionId: 'q-sea', side: 'yes', price: 71, at: '2026-11-12T20:00:00Z' },
    settlement: { questionId: 'q-sea', actual: { value: 0.31, unit: 'in' }, winningSide: 'yes', settledAt: '2026-11-13T12:00:00Z' },
    points: 29,
  },
  {
    question: sanDiegoQuestion,
    call: { questionId: 'q-san', side: 'yes', price: 47, at: '2026-11-12T20:00:00Z' },
    settlement: { questionId: 'q-san', actual: { value: 66, unit: 'F' }, winningSide: 'no', settledAt: '2026-11-13T12:00:00Z' },
    points: -47,
  },
];

export const accuracy: AccuracyEntry[] = [
  { label: 'You', correct: 2, total: 3 },
  { label: 'r/Denver', correct: 1, total: 3 },
  { label: 'All Reddit', correct: 2, total: 3 },
];

export const todaySample: TodayResponse = {
  type: 'today',
  date: '2026-11-13',
  weatherDate: '2026-11-14',
  closesAt: denverQuestion.closesAt,
  questions: questions.map((question) => ({
    question,
    yesPct: crowdByQuestion[question.id]?.yesPct ?? 50,
    trend: crowdByQuestion[question.id]?.trend ?? [],
  })),
  calls: [],
  stats: playerStats,
  yesterday: yesterdayResults,
  playersToday: 2184,
  subRank: { position: 3, of: 41, scope: { kind: 'subreddit', name: 'Denver' } },
};

const callCounts: Record<string, number> = { 'q-den': 418, 'q-sea': 296, 'q-san': 133 };

export const questionSamples: QuestionResponse[] = questions.map((question) => {
  const crowd = crowdByQuestion[question.id];
  return {
    type: 'question',
    question,
    yesPct: crowd?.yesPct ?? 50,
    subreddit: {
      scope: { kind: 'subreddit', name: question.city.name.replace(/\s/g, '') },
      points: crowd?.trend ?? [],
      callCount: callCounts[question.id] ?? 0,
    },
    all: { scope: { kind: 'all' }, points: allRedditSeries, callCount: 2184 },
    markers: question.id === 'q-den' ? denverMarkers : [],
  };
});

export const resultsSample: ResultsResponse = {
  type: 'results',
  weatherDate: '2026-11-12',
  scored: yesterdayResults,
  featuredCrowd: {
    scope: { kind: 'subreddit', name: 'Denver' },
    points: series('2026-11-12T14:00:00Z', step, [50, 54, 56, 54, 59, 60, 58, 62, 64]),
    callCount: 402,
  },
  stats: { ...playerStats, streakDays: 6 },
  accuracy,
  sharpest: { scope: { kind: 'subreddit', name: 'Seattle' }, correct: 3, total: 3 },
};

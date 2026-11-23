import { sideLabel } from './scoring.ts';
import { GAME_TIME_ZONE } from './time.ts';
import type {
  CrowdScope,
  Measurement,
  Question,
  SettlementRule,
  Side,
  Unit,
  WeatherMetric,
} from './types.ts';

export const formatSignedPoints = (points: number): string =>
  points > 0 ? `+${points}` : `${points}`;

export type Sign = 'positive' | 'negative' | 'zero';

export const signOf = (n: number): Sign => {
  if (n > 0) return 'positive';
  if (n < 0) return 'negative';
  return 'zero';
};

export const formatCount = (n: number): string => n.toLocaleString('en-US');

const UNIT_SUFFIX: Record<Unit, string> = {
  F: '°F',
  in: ' in',
  '%': '%',
};

export const formatMeasurement = ({ value, unit }: Measurement): string =>
  `${value}${UNIT_SUFFIX[unit]}`;

export const formatScope = (scope: CrowdScope): string =>
  scope.kind === 'subreddit' ? `r/${scope.name}` : 'All Reddit';

export type Duration = {
  hours: number;
  minutes: number;
};

export const durationUntil = (until: string, now: string): Duration => {
  const ms = Math.max(0, Date.parse(until) - Date.parse(now));
  const totalMinutes = Math.floor(ms / 60_000);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
};

export const formatDuration = ({ hours, minutes }: Duration): string =>
  hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

export const formatFraction = (correct: number, total: number): string =>
  `${correct}/${total}`;

export const formatLine = (rule: SettlementRule): string =>
  formatMeasurement({ value: rule.value, unit: rule.unit });

export const formatForecast = (forecast: Measurement): string =>
  forecast.unit === '%'
    ? `${forecast.value}% chance`
    : `forecast ${formatMeasurement(forecast)}`;

export const formatQuestionContext = (question: Question): string =>
  `${question.city.name} - ${formatForecast(question.forecast)}`;

// Parsed at noon UTC so the date can't shift across time zones.
export const formatWeatherDate = (date: string): string =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

export const formatShortDate = (date: string): string =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

export const formatWeekday = (date: string): string =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(
    new Date(`${date}T12:00:00Z`)
  );

export const formatHourShort = (at: string, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone,
  }).formatToParts(new Date(at));
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '';
  const period = parts.find((p) => p.type === 'dayPeriod')?.value ?? '';
  return `${hour}${period.charAt(0).toLowerCase()}`;
};

// What a call on `side` means, e.g. "Under 48.5°F" or "Yes".
export const formatChoice = (question: Question, side: Side): string =>
  question.kind === 'overUnder'
    ? `${sideLabel(question.kind, side)} ${formatLine(question.rule)}`
    : sideLabel(question.kind, side);

const METRIC_WORD: Record<WeatherMetric, string> = {
  highTemp: 'high',
  lowTemp: 'low',
  precipitation: 'rain',
};

// A short name for a question, e.g. "Seattle rain".
export const formatQuestionShort = (question: Question): string =>
  `${question.city.name} ${METRIC_WORD[question.rule.metric]}`;

// When settlement runs, in US Eastern time, e.g. "Sunday around 7am ET".
export const formatSettles = (at: string): string => {
  const timeZone = GAME_TIME_ZONE;
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone,
  }).format(new Date(at));
  return `${weekday} around ${formatHourShort(at, timeZone)}m ET`;
};

// A clock time in a zone, e.g. "9pm", "10:30am", "midnight" or "noon".
export const formatClockTime = (at: string, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h12',
    timeZone,
  }).formatToParts(new Date(at));
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';
  const hour = get('hour');
  const minute = get('minute');
  const period = get('dayPeriod').toLowerCase();
  if (hour === '12' && minute === '00') return period === 'am' ? 'midnight' : 'noon';
  return `${hour}${minute === '00' ? '' : `:${minute}`}${period}`;
};

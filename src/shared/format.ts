import type {
  CrowdScope,
  Measurement,
  Question,
  SettlementRule,
  Unit,
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

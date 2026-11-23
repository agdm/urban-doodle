// The game runs on one clock: calls lock at midnight and settle at 7am, US Eastern.
export const GAME_TIME_ZONE = 'America/New_York';

const HOUR_MS = 3_600_000;

// The calendar date (YYYY-MM-DD) of an instant in a time zone.
export const localDate = (at: Date, timeZone: string): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at);

// Calendar arithmetic on YYYY-MM-DD strings, done at noon UTC so it never slips a day.
export const addDays = (date: string, days: number): string => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

// How far a zone's wall clock is ahead of UTC at an instant, in ms.
const zoneOffset = (at: number, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(at));
  const get = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  const wallAsUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second')
  );
  return wallAsUtc - Math.floor(at / 1000) * 1000;
};

// The instant (ISO, UTC) when a zone's clock reads `hour`:00 on `date`.
export const zonedTime = (
  date: string,
  hour: number,
  timeZone: string
): string => {
  const wall = Date.parse(`${date}T00:00:00Z`) + hour * HOUR_MS;
  // Two passes: the second uses the offset at the first guess, which settles DST changes.
  const first = wall - zoneOffset(wall, timeZone);
  const second = wall - zoneOffset(first, timeZone);
  return new Date(second).toISOString();
};

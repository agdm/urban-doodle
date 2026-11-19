// The domain must stay in permissions.http.domains in devvit.json.
const NWS_BASE = 'https://api.weather.gov';

const NWS_HEADERS = {
  // NWS rejects requests without a User-Agent.
  'User-Agent': 'highball-daily (Devvit app)',
  Accept: 'application/geo+json',
};

export type ForecastPeriod = {
  name: string;
  startTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  precipitationChance: number | null;
  shortForecast: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const nwsGet = async (url: string): Promise<unknown> => {
  const res = await fetch(url, { headers: NWS_HEADERS });
  if (!res.ok) {
    throw new Error(`NWS ${res.status} for ${url}`);
  }
  const body: unknown = await res.json();
  return body;
};

const parsePeriod = (raw: unknown): ForecastPeriod | null => {
  if (!isRecord(raw)) return null;
  const { name, startTime, isDaytime, temperature, temperatureUnit } = raw;
  if (
    typeof name !== 'string' ||
    typeof startTime !== 'string' ||
    typeof isDaytime !== 'boolean' ||
    typeof temperature !== 'number' ||
    typeof temperatureUnit !== 'string'
  ) {
    return null;
  }
  const pop = raw.probabilityOfPrecipitation;
  const precipitationChance =
    isRecord(pop) && typeof pop.value === 'number' ? pop.value : null;
  return {
    name,
    startTime,
    isDaytime,
    temperature,
    temperatureUnit,
    precipitationChance,
    shortForecast:
      typeof raw.shortForecast === 'string' ? raw.shortForecast : '',
  };
};

const getForecastUrl = async (lat: number, lon: number): Promise<string> => {
  const body = await nwsGet(
    `${NWS_BASE}/points/${lat.toFixed(4)},${lon.toFixed(4)}`
  );
  if (
    isRecord(body) &&
    isRecord(body.properties) &&
    typeof body.properties.forecast === 'string'
  ) {
    return body.properties.forecast;
  }
  throw new Error(`NWS points response for ${lat},${lon} had no forecast URL`);
};

export const getForecast = async (
  lat: number,
  lon: number
): Promise<ForecastPeriod[]> => {
  const body = await nwsGet(await getForecastUrl(lat, lon));
  if (!isRecord(body) || !isRecord(body.properties)) {
    throw new Error('NWS forecast response was malformed');
  }
  const { periods } = body.properties;
  if (!Array.isArray(periods)) {
    throw new Error('NWS forecast response had no periods');
  }
  return periods
    .map(parsePeriod)
    .filter((p): p is ForecastPeriod => p !== null);
};

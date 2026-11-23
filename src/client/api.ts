import type { TodayResponse } from '../shared/api';

const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  const body: T = await res.json();
  return body;
};

export const fetchToday = (): Promise<TodayResponse> =>
  getJson<TodayResponse>('/api/today');

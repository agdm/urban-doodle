import type {
  QuestionResponse,
  ResultsResponse,
  TodayResponse,
} from '../shared/api';

const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  const body: T = await res.json();
  return body;
};

export const fetchToday = (): Promise<TodayResponse> =>
  getJson<TodayResponse>('/api/today');

export const fetchQuestion = (id: string): Promise<QuestionResponse> =>
  getJson<QuestionResponse>(`/api/question/${encodeURIComponent(id)}`);

export const fetchResults = (): Promise<ResultsResponse> =>
  getJson<ResultsResponse>('/api/results');

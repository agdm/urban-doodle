import { useEffect, useState } from 'react';

export type Remote<T> =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: T };

type Settled<T> = { key: string; attempt: number; remote: Remote<T> };

/**
 * Loads `fetcher(key)` and reloads when `key` changes or `retry` is called.
 * `fetcher` must be a stable function, such as one defined at module level.
 * State is only set when a request settles, and stale responses are dropped.
 */
export const useRemote = <T>(
  key: string,
  fetcher: (key: string) => Promise<T>
): { remote: Remote<T>; retry: () => void } => {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let live = true;
    fetcher(key)
      .then((data) => {
        if (live)
          setSettled({ key, attempt, remote: { status: 'ready', data } });
      })
      .catch((error: unknown) => {
        console.error(`Loading ${key} failed:`, error);
        if (live) setSettled({ key, attempt, remote: { status: 'error' } });
      });
    return () => {
      live = false;
    };
  }, [key, attempt, fetcher]);

  const loading: Remote<T> = { status: 'loading' };
  const current =
    settled && settled.key === key && settled.attempt === attempt
      ? settled.remote
      : loading;
  return { remote: current, retry: () => setAttempt((n) => n + 1) };
};

import { useEffect, useState } from 'react';

// The current time as an ISO string, refreshed every `everyMs`.
export const useNow = (everyMs = 30_000): string => {
  const [now, setNow] = useState(() => new Date().toISOString());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
};

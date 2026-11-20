import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { showToast } from '@devvit/web/client';
import { priceFor } from '../shared/scoring';
import type { Call, Side } from '../shared/types';
import { NOW, todaySample } from './preview/fixtures';
import { TodayScreen } from './screens/TodayScreen';

export const App = () => {
  const [calls, setCalls] = useState<Call[]>(todaySample.calls);
  const today = { ...todaySample, calls };

  const makeCall = (questionId: string, side: Side) => {
    const entry = today.questions.find((q) => q.question.id === questionId);
    if (!entry || calls.some((c) => c.questionId === questionId)) return;
    const call: Call = {
      questionId,
      side,
      price: priceFor(entry.yesPct, side),
      at: new Date().toISOString(),
    };
    setCalls((prev) => [...prev, call]);
  };

  const comingSoon = () => showToast('Coming soon');

  return (
    <TodayScreen
      today={today}
      now={NOW}
      onOpenQuestion={comingSoon}
      onCall={makeCall}
      onOpenResults={comingSoon}
      onLeaderboard={comingSoon}
    />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

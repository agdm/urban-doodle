import './index.css';

import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { showToast } from '@devvit/web/client';
import { formatQuestionShort } from '../shared/format';
import { priceFor } from '../shared/scoring';
import type { TodayResponse } from '../shared/api';
import { NOW, questionSamples, resultsSample } from '../shared/sampleData';
import type { Call, Side } from '../shared/types';
import { fetchToday } from './api';
import { LockedScreen } from './screens/LockedScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { TodayScreen } from './screens/TodayScreen';

type Load =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; today: TodayResponse };

const StatusScreen = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <main
    data-screen="status"
    className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-sm text-muted"
  >
    <p>{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 rounded-control px-4 font-semibold text-under"
      >
        Try again
      </button>
    ) : null}
  </main>
);

type View =
  | { screen: 'today' }
  | { screen: 'question'; questionId: string }
  | { screen: 'results' };

export const App = () => {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [calls, setCalls] = useState<Call[]>([]);
  const [view, setView] = useState<View>({ screen: 'today' });

  // State only changes once the request settles, never synchronously in the effect.
  const loadToday = useCallback(() => {
    fetchToday()
      .then((today) => {
        setCalls(today.calls);
        setLoad({ status: 'ready', today });
      })
      .catch((error: unknown) => {
        console.error('Loading today failed:', error);
        setLoad({ status: 'error' });
      });
  }, []);

  useEffect(loadToday, [loadToday]);

  if (load.status === 'loading') {
    return <StatusScreen message="Loading today's calls..." />;
  }
  if (load.status === 'error') {
    return (
      <StatusScreen
        message="Couldn't load today's calls."
        onRetry={() => {
          setLoad({ status: 'loading' });
          loadToday();
        }}
      />
    );
  }

  // Calls stay local until POST /api/call exists.
  const today = { ...load.today, calls };

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

  const goToday = () => setView({ screen: 'today' });
  const comingSoon = () => showToast('Coming soon');

  if (view.screen === 'results') {
    const settlesAt = today.questions[0]?.question.settlesAt;
    return (
      <ResultsScreen
        results={resultsSample}
        {...(settlesAt ? { todaySettlesAt: settlesAt } : {})}
        onToday={goToday}
      />
    );
  }

  if (view.screen === 'question') {
    const index = questionSamples.findIndex(
      (d) => d.question.id === view.questionId
    );
    const detail = questionSamples[index];
    if (detail) {
      const call = calls.find((c) => c.questionId === detail.question.id);
      const position = { index, total: questionSamples.length };
      if (call) {
        // The next question, in order and wrapping around, that has no call yet.
        const next = questionSamples
          .slice(index + 1)
          .concat(questionSamples.slice(0, index))
          .find((d) => !calls.some((c) => c.questionId === d.question.id));
        return (
          <LockedScreen
            key={detail.question.id}
            detail={detail}
            call={call}
            position={position}
            nextLabel={
              next ? `Next: ${formatQuestionShort(next.question)}` : 'Back to Today'
            }
            onBack={goToday}
            onNext={() =>
              next
                ? setView({ screen: 'question', questionId: next.question.id })
                : goToday()
            }
            onShare={() => showToast('Posting comments is coming soon')}
          />
        );
      }
      return (
        <QuestionScreen
          key={detail.question.id}
          detail={detail}
          position={position}
          onBack={goToday}
          onCall={(side) => makeCall(detail.question.id, side)}
        />
      );
    }
  }

  return (
    <TodayScreen
      today={today}
      now={NOW}
      onOpenQuestion={(questionId) =>
        setView({ screen: 'question', questionId })
      }
      onCall={makeCall}
      onOpenResults={() => setView({ screen: 'results' })}
      onLeaderboard={comingSoon}
    />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { showToast } from '@devvit/web/client';
import type { TodayResponse } from '../shared/api';
import { formatQuestionShort } from '../shared/format';
import { priceFor } from '../shared/scoring';
import type { Call, Side } from '../shared/types';
import { fetchQuestion, fetchResults, fetchToday } from './api';
import { useNow } from './hooks/useNow';
import { useRemote, type Remote } from './hooks/useRemote';
import { LockedScreen } from './screens/LockedScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { TodayScreen } from './screens/TodayScreen';

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

// The loading or error screen for a request that isn't ready yet.
const pending = <T,>(remote: Remote<T>, what: string, retry: () => void) =>
  remote.status === 'loading' ? (
    <StatusScreen message={`Loading ${what}...`} />
  ) : (
    <StatusScreen message={`Couldn't load ${what}.`} onRetry={retry} />
  );

type QuestionViewProps = {
  questionId: string;
  today: TodayResponse;
  onBack: () => void;
  onOpen: (questionId: string) => void;
  onCall: (questionId: string, side: Side, yesPct: number) => void;
};

const QuestionView = ({
  questionId,
  today,
  onBack,
  onOpen,
  onCall,
}: QuestionViewProps) => {
  const { remote, retry } = useRemote(questionId, fetchQuestion);
  if (remote.status !== 'ready') return pending(remote, 'this question', retry);

  const detail = remote.data;
  const order = today.questions;
  const index = order.findIndex((q) => q.question.id === questionId);
  const position = { index, total: order.length };
  const call = today.calls.find((c) => c.questionId === questionId);

  if (!call) {
    return (
      <QuestionScreen
        key={questionId}
        detail={detail}
        position={position}
        onBack={onBack}
        onCall={(side) => onCall(questionId, side, detail.yesPct)}
      />
    );
  }

  // The next question, in order and wrapping around, that has no call yet.
  const next = order
    .slice(index + 1)
    .concat(order.slice(0, index))
    .find((q) => !today.calls.some((c) => c.questionId === q.question.id));
  return (
    <LockedScreen
      key={questionId}
      detail={detail}
      call={call}
      position={position}
      nextLabel={
        next ? `Next: ${formatQuestionShort(next.question)}` : 'Back to Today'
      }
      onBack={onBack}
      onNext={() => (next ? onOpen(next.question.id) : onBack())}
      onShare={() => showToast('Posting comments is coming soon')}
    />
  );
};

const ResultsView = ({
  today,
  onToday,
}: {
  today: TodayResponse;
  onToday: () => void;
}) => {
  const { remote, retry } = useRemote('results', fetchResults);
  if (remote.status !== 'ready') return pending(remote, 'your results', retry);
  const settlesAt = today.questions[0]?.question.settlesAt;
  return (
    <ResultsScreen
      results={remote.data}
      {...(settlesAt ? { todaySettlesAt: settlesAt } : {})}
      onToday={onToday}
    />
  );
};

type View =
  | { screen: 'today' }
  | { screen: 'question'; questionId: string }
  | { screen: 'results' };

export const App = () => {
  const { remote, retry } = useRemote('today', fetchToday);
  // Calls made on this device; they stay local until POST /api/call exists.
  const [localCalls, setLocalCalls] = useState<Call[]>([]);
  const [view, setView] = useState<View>({ screen: 'today' });
  const now = useNow();

  if (remote.status !== 'ready') return pending(remote, "today's calls", retry);

  const today = {
    ...remote.data,
    calls: [...remote.data.calls, ...localCalls],
  };

  const makeCall = (questionId: string, side: Side, yesPct: number) => {
    if (today.calls.some((c) => c.questionId === questionId)) return;
    const call: Call = {
      questionId,
      side,
      price: priceFor(yesPct, side),
      at: new Date().toISOString(),
    };
    setLocalCalls((prev) => [...prev, call]);
  };

  const goToday = () => setView({ screen: 'today' });
  const openQuestion = (questionId: string) =>
    setView({ screen: 'question', questionId });

  if (view.screen === 'results') {
    return <ResultsView today={today} onToday={goToday} />;
  }

  if (view.screen === 'question') {
    return (
      <QuestionView
        questionId={view.questionId}
        today={today}
        onBack={goToday}
        onOpen={openQuestion}
        onCall={makeCall}
      />
    );
  }

  return (
    <TodayScreen
      today={today}
      now={now}
      timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      onOpenQuestion={openQuestion}
      onCall={(questionId, side) => {
        const entry = today.questions.find((q) => q.question.id === questionId);
        if (entry) makeCall(questionId, side, entry.yesPct);
      }}
      onOpenResults={() => setView({ screen: 'results' })}
      onLeaderboard={() => showToast('Coming soon')}
    />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

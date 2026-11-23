import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { showToast } from '@devvit/web/client';
import { formatQuestionShort } from '../shared/format';
import { priceFor } from '../shared/scoring';
import type { Call, Side } from '../shared/types';
import { NOW, questionSamples, todaySample } from './preview/fixtures';
import { LockedScreen } from './screens/LockedScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { TodayScreen } from './screens/TodayScreen';

type View = { screen: 'today' } | { screen: 'question'; questionId: string };

export const App = () => {
  const [calls, setCalls] = useState<Call[]>(todaySample.calls);
  const [view, setView] = useState<View>({ screen: 'today' });
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

  const goToday = () => setView({ screen: 'today' });
  const comingSoon = () => showToast('Coming soon');

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

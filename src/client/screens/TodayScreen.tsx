import type { TodayResponse } from '../../shared/api';
import { formatShortDate, formatWeekday } from '../../shared/format';
import { tallyDay } from '../../shared/scoring';
import type { Side } from '../../shared/types';
import {
  Countdown,
  GameHeader,
  QuestionCard,
  ResultsTeaser,
  SectionHeader,
  StatsFooter,
} from '../components';

export type TodayScreenProps = {
  today: TodayResponse;
  now: string;
  onOpenQuestion: (questionId: string) => void;
  onCall: (questionId: string, side: Side) => void;
  onOpenResults: () => void;
  onLeaderboard: () => void;
};

export const TodayScreen = ({
  today,
  now,
  onOpenQuestion,
  onCall,
  onOpenResults,
  onLeaderboard,
}: TodayScreenProps) => {
  const calledSide = new Map(today.calls.map((c) => [c.questionId, c.side]));

  return (
    <main data-screen="today">
      <GameHeader
        title="Highball"
        subtitle={`${formatShortDate(today.date)} - calls on ${formatWeekday(today.weatherDate)}'s weather`}
        stats={today.stats}
      />
      {today.yesterday.length > 0 ? (
        <ResultsTeaser tally={tallyDay(today.yesterday)} onOpen={onOpenResults} />
      ) : null}
      <section data-part="calls">
        <SectionHeader
          title="Today's calls"
          aside={<Countdown label="Lock at midnight" until={today.closesAt} now={now} />}
        />
        {today.questions.map(({ question, yesPct, trend }) => {
          const lockedSide = calledSide.get(question.id);
          return (
            <QuestionCard
              key={question.id}
              question={question}
              yesPct={yesPct}
              trend={trend}
              onOpen={onOpenQuestion}
              onSelectSide={onCall}
              {...(lockedSide ? { lockedSide } : {})}
            />
          );
        })}
      </section>
      <StatsFooter
        playersToday={today.playersToday}
        {...(today.subRank ? { subRank: today.subRank } : {})}
        onLeaderboard={onLeaderboard}
      />
    </main>
  );
};

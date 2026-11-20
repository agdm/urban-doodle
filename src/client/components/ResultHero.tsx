import { formatScope } from '../../shared/format';
import type { DayTally } from '../../shared/scoring';
import type { PlayerStats } from '../../shared/types';
import { SignedPoints } from './SignedPoints';
import { StreakBadge } from './StreakBadge';

export type ResultHeroProps = {
  eyebrow: string;
  tally: DayTally;
  stats: PlayerStats;
  summary: string;
};

export const ResultHero = ({ eyebrow, tally, stats, summary }: ResultHeroProps) => (
  <header data-component="result-hero">
    <p data-part="eyebrow">{eyebrow}</p>
    <div data-part="score">
      <span data-part="points">
        <SignedPoints points={tally.points} /> <span data-part="unit">pts</span>
      </span>
      <div data-part="standing">
        <StreakBadge days={stats.streakDays} />
        {stats.rank ? (
          <span data-part="rank">
            #{stats.rank.position} in {formatScope(stats.rank.scope)}
          </span>
        ) : null}
      </div>
    </div>
    <p data-part="summary">{summary}</p>
  </header>
);

import './StatsFooter.css';
import { formatCount, formatScope } from '../../shared/format';
import type { Rank } from '../../shared/types';

export type StatsFooterProps = {
  playersToday: number;
  subRank?: Rank;
  onLeaderboard: () => void;
};

export const StatsFooter = ({ playersToday, subRank, onLeaderboard }: StatsFooterProps) => (
  <footer data-component="stats-footer">
    <p>
      {formatCount(playersToday)} players today
      {subRank
        ? ` - ${formatScope(subRank.scope)} #${subRank.position}${subRank.of ? ` of ${subRank.of} subs` : ''}`
        : ''}
    </p>
    <button type="button" onClick={onLeaderboard}>
      Leaderboard
    </button>
  </footer>
);

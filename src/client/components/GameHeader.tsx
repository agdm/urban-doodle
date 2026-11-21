import './GameHeader.css';
import type { PlayerStats } from '../../shared/types';
import { PointsTotal } from './PointsTotal';
import { StreakBadge } from './StreakBadge';

export type GameHeaderProps = {
  title: string;
  subtitle: string;
  stats: PlayerStats;
};

export const GameHeader = ({ title, subtitle, stats }: GameHeaderProps) => (
  <header data-component="game-header">
    <div data-part="titles">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
    <div data-part="stats">
      <PointsTotal points={stats.seasonPoints} />
      <StreakBadge days={stats.streakDays} />
    </div>
  </header>
);

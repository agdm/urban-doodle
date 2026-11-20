export type StreakBadgeProps = {
  days: number;
};

export const StreakBadge = ({ days }: StreakBadgeProps) =>
  days > 0 ? (
    <span data-component="streak-badge">{days}-day streak</span>
  ) : null;

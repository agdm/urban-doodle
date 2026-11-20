import type { ReactNode } from 'react';

export type StatTileProps = {
  label: string;
  value: ReactNode;
};

export const StatTile = ({ label, value }: StatTileProps) => (
  <div data-component="stat-tile">
    <span data-part="label">{label}</span>
    <span data-part="value">{value}</span>
  </div>
);

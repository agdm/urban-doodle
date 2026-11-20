import type { ReactNode } from 'react';

export type LegendItem = {
  id: string;
  label: string;
  kind: 'primary' | 'secondary' | 'marker';
};

export type ChartLegendProps = {
  items: ReadonlyArray<LegendItem>;
  trailing?: ReactNode;
};

export const ChartLegend = ({ items, trailing }: ChartLegendProps) => (
  <div data-component="chart-legend">
    <ul>
      {items.map((item) => (
        <li key={item.id} data-kind={item.kind}>
          <span data-part="swatch" aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
    {trailing ? <span data-part="trailing">{trailing}</span> : null}
  </div>
);

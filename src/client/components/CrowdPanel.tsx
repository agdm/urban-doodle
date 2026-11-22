import './CrowdPanel.css';
import type { ReactNode } from 'react';
import type { Side } from '../../shared/types';

export type CrowdPanelProps = {
  eyebrow: string;
  value: string;
  valueLabel: string;
  /** The side the crowd leans to; colors the value and the chart's primary line. */
  side?: Side;
  controls?: ReactNode;
  children: ReactNode;
};

export const CrowdPanel = ({
  eyebrow,
  value,
  valueLabel,
  side,
  controls,
  children,
}: CrowdPanelProps) => (
  <section data-component="crowd-panel" data-side={side}>
    <header data-part="header">
      <div data-part="headline">
        <span data-part="eyebrow">{eyebrow}</span>
        <span data-part="value">
          {value} <span data-part="value-label">{valueLabel}</span>
        </span>
      </div>
      {controls ? <div data-part="controls">{controls}</div> : null}
    </header>
    {children}
  </section>
);

import type { ReactNode } from 'react';

export type CrowdPanelProps = {
  eyebrow: string;
  value: string;
  valueLabel: string;
  controls?: ReactNode;
  children: ReactNode;
};

export const CrowdPanel = ({
  eyebrow,
  value,
  valueLabel,
  controls,
  children,
}: CrowdPanelProps) => (
  <section data-component="crowd-panel">
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

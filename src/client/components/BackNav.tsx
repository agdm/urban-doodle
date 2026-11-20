import type { ReactNode } from 'react';

export type BackNavProps = {
  label: string;
  onBack: () => void;
  trailing?: ReactNode;
};

export const BackNav = ({ label, onBack, trailing }: BackNavProps) => (
  <nav data-component="back-nav">
    <button type="button" onClick={onBack}>
      <span aria-hidden="true">{'< '}</span>
      {label}
    </button>
    {trailing ? <span data-part="trailing">{trailing}</span> : null}
  </nav>
);

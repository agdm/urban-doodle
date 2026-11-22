import './BackNav.css';
import type { ReactNode } from 'react';

export type BackNavProps = {
  label: string;
  onBack: () => void;
  trailing?: ReactNode;
};

export const BackNav = ({ label, onBack, trailing }: BackNavProps) => (
  <nav data-component="back-nav">
    <button type="button" onClick={onBack}>
      <svg data-part="chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
    {trailing ? <span data-part="trailing">{trailing}</span> : null}
  </nav>
);

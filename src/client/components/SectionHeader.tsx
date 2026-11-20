import type { ReactNode } from 'react';

export type SectionHeaderProps = {
  title: string;
  aside?: ReactNode;
};

export const SectionHeader = ({ title, aside }: SectionHeaderProps) => (
  <header data-component="section-header">
    <h2>{title}</h2>
    {aside ? <div data-part="aside">{aside}</div> : null}
  </header>
);

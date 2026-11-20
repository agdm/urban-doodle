import { formatFraction } from '../../shared/format';
import type { AccuracyEntry } from '../../shared/types';
import { StatTile } from './StatTile';

export type CrowdComparisonProps = {
  title: string;
  entries: ReadonlyArray<AccuracyEntry>;
  footnote?: string;
};

export const CrowdComparison = ({ title, entries, footnote }: CrowdComparisonProps) => (
  <section data-component="crowd-comparison">
    <h2>{title}</h2>
    <div data-part="tiles">
      {entries.map((e) => (
        <StatTile key={e.label} label={e.label} value={formatFraction(e.correct, e.total)} />
      ))}
    </div>
    {footnote ? <p data-part="footnote">{footnote}</p> : null}
  </section>
);

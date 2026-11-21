import './ResultsTeaser.css';
import type { DayTally } from '../../shared/scoring';
import { SignedPoints } from './SignedPoints';

export type ResultsTeaserProps = {
  tally: DayTally;
  onOpen: () => void;
};

export const ResultsTeaser = ({ tally, onOpen }: ResultsTeaserProps) => (
  <button type="button" data-component="results-teaser" onClick={onOpen}>
    <span data-part="eyebrow">Yesterday's results are in</span>
    <span data-part="summary">
      <SignedPoints points={tally.points} /> pts - {tally.correct} of {tally.total} right
    </span>
    <span data-part="cta">See card</span>
  </button>
);

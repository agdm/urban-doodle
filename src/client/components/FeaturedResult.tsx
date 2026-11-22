import './FeaturedResult.css';
import type { ReactNode } from 'react';
import { formatForecast, formatLine, formatMeasurement } from '../../shared/format';
import { sideLabel } from '../../shared/scoring';
import type { ScoredCall } from '../../shared/types';
import { SignedPoints } from './SignedPoints';

export type FeaturedResultProps = {
  scored: ScoredCall;
  children?: ReactNode;
};

export const FeaturedResult = ({ scored, children }: FeaturedResultProps) => {
  const { question, call, settlement, points } = scored;
  const won = call.side === settlement.winningSide;
  return (
    <section data-component="featured-result" data-result={won ? 'won' : 'lost'}>
      <header data-part="header">
        <div data-part="text">
          <p data-part="context">
            {question.city.name} - line {formatLine(question.rule)} -{' '}
            {formatForecast(question.forecast)}
          </p>
          <h2>
            Hit {formatMeasurement(settlement.actual)} -{' '}
            <span data-side={settlement.winningSide}>
              {sideLabel(question.kind, settlement.winningSide)} wins
            </span>
          </h2>
        </div>
        <SignedPoints points={points} />
      </header>
      {children}
    </section>
  );
};

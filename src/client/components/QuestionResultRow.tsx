import './QuestionResultRow.css';
import { formatMeasurement } from '../../shared/format';
import { sideLabel } from '../../shared/scoring';
import type { ScoredCall } from '../../shared/types';
import { SignedPoints } from './SignedPoints';

export type QuestionResultRowProps = {
  scored: ScoredCall;
};

export const QuestionResultRow = ({ scored }: QuestionResultRowProps) => {
  const { question, call, settlement, points } = scored;
  const won = call.side === settlement.winningSide;
  return (
    <li data-component="question-result-row" data-result={won ? 'won' : 'lost'}>
      <div data-part="text">
        <span data-part="title">
          {question.city.name} - {formatMeasurement(settlement.actual)},{' '}
          {sideLabel(question.kind, settlement.winningSide)}
        </span>
        <span data-part="detail">
          You said {sideLabel(question.kind, call.side)} at {call.price}
        </span>
      </div>
      <SignedPoints points={points} />
    </li>
  );
};

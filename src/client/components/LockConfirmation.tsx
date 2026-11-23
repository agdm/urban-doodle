import './LockConfirmation.css';
import { formatChoice } from '../../shared/format';
import type { Call, Question } from '../../shared/types';

export type LockConfirmationProps = {
  question: Question;
  call: Call;
  settlesLabel: string;
};

export const LockConfirmation = ({
  question,
  call,
  settlesLabel,
}: LockConfirmationProps) => {
  const choice = formatChoice(question, call.side);
  return (
    <header data-component="lock-confirmation" data-side={call.side}>
      <span data-part="icon" aria-hidden="true">✓</span>
      <p data-part="eyebrow">Call locked</p>
      <h1>
        You took <span data-part="choice">{choice}</span> at {call.price}
      </h1>
      <p data-part="detail">
        {question.city.name} - {settlesLabel}
      </p>
    </header>
  );
};

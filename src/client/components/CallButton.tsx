import { sideLabel, type CrowdStance, type Payout } from '../../shared/scoring';
import type { QuestionKind, Side } from '../../shared/types';

const STANCE_TEXT: Record<CrowdStance, string> = {
  with: 'Going with the crowd',
  against: 'Against the crowd',
  even: 'Even split',
};

export type CallButtonProps = {
  kind: QuestionKind;
  side: Side;
  price: number;
  stance: CrowdStance;
  payout: Payout;
  onSelect: (side: Side) => void;
  disabled?: boolean;
};

export const CallButton = ({
  kind,
  side,
  price,
  stance,
  payout,
  onSelect,
  disabled = false,
}: CallButtonProps) => (
  <button
    type="button"
    data-component="call-button"
    data-side={side}
    data-stance={stance}
    disabled={disabled}
    onClick={() => onSelect(side)}
  >
    <span data-part="main">
      <span data-part="title">
        {sideLabel(kind, side)} at {price}
      </span>
      <span data-part="stance">{STANCE_TEXT[stance]}</span>
    </span>
    <span data-part="payout">
      <span data-part="win">Win {payout.win}</span>
      <span data-part="risk">Risk {payout.risk}</span>
    </span>
  </button>
);

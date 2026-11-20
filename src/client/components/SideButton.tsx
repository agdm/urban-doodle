import { sideLabel, sidePct } from '../../shared/scoring';
import type { QuestionKind, Side } from '../../shared/types';

export type SideButtonProps = {
  kind: QuestionKind;
  side: Side;
  // The crowd's yes %; each button shows its own side's share.
  yesPct: number;
  onSelect?: (side: Side) => void;
  selected?: boolean;
  disabled?: boolean;
};

export const SideButton = ({
  kind,
  side,
  yesPct,
  onSelect,
  selected = false,
  disabled = false,
}: SideButtonProps) => (
  <button
    type="button"
    data-component="side-button"
    data-side={side}
    aria-pressed={selected}
    disabled={disabled || !onSelect}
    onClick={onSelect ? () => onSelect(side) : undefined}
  >
    <span data-part="label">{sideLabel(kind, side)}</span>{' '}
    <span data-part="pct">{Math.round(sidePct(yesPct, side))}%</span>
  </button>
);

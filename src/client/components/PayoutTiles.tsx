import { otherSide, sideLabel, type Payout } from '../../shared/scoring';
import type { QuestionKind, Side } from '../../shared/types';
import { SignedPoints } from './SignedPoints';
import { StatTile } from './StatTile';

export type PayoutTilesProps = {
  kind: QuestionKind;
  side: Side;
  payout: Payout;
};

export const PayoutTiles = ({ kind, side, payout }: PayoutTilesProps) => (
  <div data-component="payout-tiles">
    <StatTile
      label={`If ${sideLabel(kind, side)} wins`}
      value={<SignedPoints points={payout.win} />}
    />
    <StatTile
      label={`If ${sideLabel(kind, otherSide(side))} wins`}
      value={<SignedPoints points={-payout.risk} />}
    />
  </div>
);

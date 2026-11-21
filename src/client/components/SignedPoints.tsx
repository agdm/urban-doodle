import './SignedPoints.css';
import { formatSignedPoints, signOf } from '../../shared/format';

export type SignedPointsProps = {
  points: number;
};

export const SignedPoints = ({ points }: SignedPointsProps) => (
  <span data-component="signed-points" data-sign={signOf(points)}>
    {formatSignedPoints(points)}
  </span>
);

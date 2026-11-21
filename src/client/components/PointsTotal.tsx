import './PointsTotal.css';
import { formatCount } from '../../shared/format';

export type PointsTotalProps = {
  points: number;
};

export const PointsTotal = ({ points }: PointsTotalProps) => (
  <span data-component="points-total">
    <span data-part="value">{formatCount(points)}</span>{' '}
    <span data-part="unit">pts</span>
  </span>
);

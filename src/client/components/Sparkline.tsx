import './Sparkline.css';
import {
  plotArea,
  polylinePoints,
  rangeOf,
  yForPct,
  type TimeRange,
} from '../../shared/chartGeometry';
import { leaningSide } from '../../shared/scoring';
import type { CrowdPoint } from '../../shared/types';

export type SparklineProps = {
  points: ReadonlyArray<CrowdPoint>;
  range?: TimeRange;
  width?: number;
  height?: number;
};

export const Sparkline = ({
  points,
  range,
  width = 96,
  height = 40,
}: SparklineProps) => {
  const timeRange = range ?? rangeOf(points);
  const last = points[points.length - 1];
  const area = plotArea({
    width,
    height,
    padding: { top: 2, right: 2, bottom: 2, left: 2 },
  });
  const mid = yForPct(area, 50);

  return (
    <svg
      data-component="sparkline"
      data-leaning={last ? (leaningSide(last.yesPct) ?? 'even') : 'even'}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <line data-part="baseline" x1={area.left} y1={mid} x2={area.right} y2={mid} />
      {timeRange ? (
        <polyline
          data-part="line"
          fill="none"
          points={polylinePoints(area, timeRange, points)}
        />
      ) : null}
    </svg>
  );
};

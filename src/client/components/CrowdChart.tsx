import './CrowdChart.css';
import {
  placeMarkers,
  plotArea,
  pointXY,
  polylinePoints,
  yForPct,
  type ChartBox,
  type TimeRange,
} from '../../shared/chartGeometry';
import type { CallMarker, CrowdPoint, Side } from '../../shared/types';

export type ChartSeries = {
  id: string;
  label: string;
  points: ReadonlyArray<CrowdPoint>;
  emphasis: 'primary' | 'secondary';
};

export type ChartTick = {
  at: string;
  label: string;
};

export type CrowdChartProps = {
  ariaLabel: string;
  range: TimeRange;
  series: ReadonlyArray<ChartSeries>;
  markers?: ReadonlyArray<CallMarker>;
  you?: { marker: CallMarker; label: string };
  outcome?: { winningSide: Side; label: string };
  showLatest?: boolean;
  timeTicks?: ReadonlyArray<ChartTick>;
  pctTicks?: ReadonlyArray<number>;
  box?: ChartBox;
};

const DEFAULT_BOX: ChartBox = {
  width: 342,
  height: 200,
  padding: { top: 10, right: 4, bottom: 30, left: 32 },
};

export const CrowdChart = ({
  ariaLabel,
  range,
  series,
  markers = [],
  you,
  outcome,
  showLatest = false,
  timeTicks = [],
  pctTicks = [0, 50, 100],
  box = DEFAULT_BOX,
}: CrowdChartProps) => {
  const area = plotArea(box);
  const mid = yForPct(area, 50);
  const primary = series.find((s) => s.emphasis === 'primary');
  const latest = showLatest ? primary?.points[primary.points.length - 1] : undefined;
  const latestXY = latest ? pointXY(area, range, latest) : null;
  const youXY = you ? pointXY(area, range, you.marker) : null;

  return (
    <svg
      data-component="crowd-chart"
      viewBox={`0 0 ${box.width} ${box.height}`}
      role="img"
      aria-label={ariaLabel}
    >
      {outcome ? (
        <g data-part="outcome" data-side={outcome.winningSide}>
          <rect
            x={area.left}
            y={outcome.winningSide === 'yes' ? area.top : mid}
            width={area.right - area.left}
            height={outcome.winningSide === 'yes' ? mid - area.top : area.bottom - mid}
          />
          <text
            x={area.left + 8}
            y={outcome.winningSide === 'yes' ? area.top + 14 : area.bottom - 8}
          >
            {outcome.label}
          </text>
        </g>
      ) : null}

      <g data-part="pct-grid">
        {pctTicks.map((pct) => {
          const y = yForPct(area, pct);
          return (
            <g key={pct} data-pct={pct}>
              <line x1={area.left} y1={y} x2={area.right} y2={y} />
              <text x={area.left - 4} y={y + 4} textAnchor="end">
                {pct}%
              </text>
            </g>
          );
        })}
      </g>

      {series.map((s) => (
        <polyline
          key={s.id}
          data-part="series"
          data-emphasis={s.emphasis}
          fill="none"
          points={polylinePoints(area, range, s.points)}
        />
      ))}

      <g data-part="markers">
        {placeMarkers(area, range, markers).map((m) => (
          <circle key={`${m.at}-${m.side}-${m.x}`} data-side={m.side} cx={m.x} cy={m.y} r={3.5} />
        ))}
      </g>

      {latestXY ? (
        <circle data-part="latest" cx={latestXY.x} cy={latestXY.y} r={6} />
      ) : null}

      {you && youXY ? (
        <g data-part="you" data-side={you.marker.side}>
          <circle cx={youXY.x} cy={youXY.y} r={8} />
          <text
            x={youXY.x}
            y={Math.max(area.top + 12, youXY.y - 16)}
            textAnchor={youXY.x > (area.left + area.right) / 2 ? 'end' : 'start'}
          >
            {you.label}
          </text>
        </g>
      ) : null}

      <g data-part="time-axis">
        {timeTicks.map((tick) => {
          const { x } = pointXY(area, range, { at: tick.at, yesPct: 0 });
          return (
            <text key={tick.at} x={x} y={box.height - 8} textAnchor="middle">
              {tick.label}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

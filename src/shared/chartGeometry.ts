import type { CallMarker, CrowdPoint } from './types.ts';

export type ChartBox = {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
};

export type TimeRange = {
  start: string;
  end: string;
};

export type XY = { x: number; y: number };

export type PlotArea = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export const plotArea = ({ width, height, padding }: ChartBox): PlotArea => ({
  left: padding.left,
  right: width - padding.right,
  top: padding.top,
  bottom: height - padding.bottom,
});

const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n));

export const yForPct = (area: PlotArea, pct: number): number =>
  area.bottom - (clamp(pct, 0, 100) / 100) * (area.bottom - area.top);

export const xForTime = (area: PlotArea, range: TimeRange, at: string): number => {
  const start = Date.parse(range.start);
  const span = Date.parse(range.end) - start;
  if (span <= 0) return area.right;
  const t = clamp((Date.parse(at) - start) / span, 0, 1);
  return area.left + t * (area.right - area.left);
};

const round = (n: number): number => Math.round(n * 10) / 10;

export const pointXY = (
  area: PlotArea,
  range: TimeRange,
  point: { at: string; yesPct: number }
): XY => ({
  x: round(xForTime(area, range, point.at)),
  y: round(yForPct(area, point.yesPct)),
});

export const polylinePoints = (
  area: PlotArea,
  range: TimeRange,
  points: ReadonlyArray<CrowdPoint>
): string =>
  points
    .map((p) => {
      const { x, y } = pointXY(area, range, p);
      return `${x},${y}`;
    })
    .join(' ');

export type PlacedMarker = CallMarker & XY;

export const placeMarkers = (
  area: PlotArea,
  range: TimeRange,
  markers: ReadonlyArray<CallMarker>
): PlacedMarker[] =>
  markers.map((m) => ({ ...m, ...pointXY(area, range, m) }));

export const rangeOf = (points: ReadonlyArray<CrowdPoint>): TimeRange | null => {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return null;
  return { start: first.at, end: last.at };
};

const HOUR_MS = 3_600_000;

export const hourlyTicks = (range: TimeRange, stepHours: number): string[] => {
  const end = Date.parse(range.end);
  const step = stepHours * HOUR_MS;
  const ticks: string[] = [];
  let t = Math.ceil(Date.parse(range.start) / HOUR_MS) * HOUR_MS;
  for (; t <= end; t += step) {
    ticks.push(new Date(t).toISOString());
  }
  return ticks;
};

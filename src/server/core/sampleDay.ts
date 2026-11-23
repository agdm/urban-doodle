// Re-dates the design-canvas sample data around the current game day, so
// countdowns, charts and settle times run on the real clock. Goes away once
// each day's questions and crowds are stored in Redis.
import type {
  QuestionResponse,
  ResultsResponse,
  TodayResponse,
} from '../../shared/api.ts';
import { rangeOf, type TimeRange } from '../../shared/chartGeometry.ts';
import {
  CHART_RANGE,
  questionSamples,
  resultsSample,
  todaySample,
} from '../../shared/sampleData.ts';
import {
  addDays,
  GAME_TIME_ZONE,
  localDate,
  zonedTime,
} from '../../shared/time.ts';
import type { CrowdPoint, Question, ScoredCall } from '../../shared/types.ts';

export type SampleDay = {
  today: TodayResponse;
  questions: QuestionResponse[];
  results: ResultsResponse;
};

// Maps instants in one window proportionally onto another.
const rescale =
  (from: TimeRange, to: TimeRange) =>
  (at: string): string => {
    const fromStart = Date.parse(from.start);
    const fromSpan = Date.parse(from.end) - fromStart;
    const toStart = Date.parse(to.start);
    const toSpan = Date.parse(to.end) - toStart;
    const t = fromSpan > 0 ? (Date.parse(at) - fromStart) / fromSpan : 0;
    return new Date(Math.round(toStart + t * toSpan)).toISOString();
  };

const movePoints = (points: CrowdPoint[], move: (at: string) => string) =>
  points.map((p) => ({ ...p, at: move(p.at) }));

export const sampleDay = (now: Date): SampleDay => {
  const zone = GAME_TIME_ZONE;
  // Calls made today are about tomorrow's weather, lock at midnight and settle the morning after.
  const date = localDate(now, zone);
  const weatherDate = addDays(date, 1);
  const times = {
    weatherDate,
    opensAt: zonedTime(date, 0, zone),
    closesAt: zonedTime(weatherDate, 0, zone),
    settlesAt: zonedTime(addDays(weatherDate, 1), 7, zone),
  };
  const redate = (q: Question): Question => ({ ...q, ...times });
  // Today's crowd history runs from the start of the day up to now.
  const todayWindow =
    rangeOf(todaySample.questions[0]?.trend ?? []) ?? CHART_RANGE;
  const moveToday = rescale(todayWindow, {
    start: times.opensAt,
    end: now.toISOString(),
  });

  // Yesterday's results: calls made two days ago about yesterday's weather, settled this morning.
  const scoredDate = addDays(date, -1);
  const scoredTimes = {
    weatherDate: scoredDate,
    opensAt: zonedTime(addDays(date, -2), 0, zone),
    closesAt: zonedTime(scoredDate, 0, zone),
    settlesAt: zonedTime(date, 7, zone),
  };
  const sampleWindow = rangeOf(resultsSample.featuredCrowd?.points ?? []);
  const moveScored = sampleWindow
    ? rescale(sampleWindow, {
        start: scoredTimes.opensAt,
        end: scoredTimes.closesAt,
      })
    : (at: string) => at;
  const scored: ScoredCall[] = resultsSample.scored.map((s) => ({
    ...s,
    question: { ...s.question, ...scoredTimes },
    call: { ...s.call, at: moveScored(s.call.at) },
    settlement: { ...s.settlement, settledAt: scoredTimes.settlesAt },
  }));
  const featuredCrowd = resultsSample.featuredCrowd;

  return {
    today: {
      ...todaySample,
      date,
      weatherDate,
      closesAt: times.closesAt,
      questions: todaySample.questions.map((q) => ({
        ...q,
        question: redate(q.question),
        trend: movePoints(q.trend, moveToday),
      })),
      yesterday: scored,
    },
    questions: questionSamples.map((d) => ({
      ...d,
      question: redate(d.question),
      subreddit: {
        ...d.subreddit,
        points: movePoints(d.subreddit.points, moveToday),
      },
      all: { ...d.all, points: movePoints(d.all.points, moveToday) },
      markers: d.markers.map((m) => ({ ...m, at: moveToday(m.at) })),
    })),
    results: {
      ...resultsSample,
      weatherDate: scoredDate,
      scored,
      ...(featuredCrowd
        ? {
            featuredCrowd: {
              ...featuredCrowd,
              points: movePoints(featuredCrowd.points, moveScored),
            },
          }
        : {}),
    },
  };
};

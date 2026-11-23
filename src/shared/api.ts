import type {
  AccuracyEntry,
  Call,
  CallMarker,
  CrowdPoint,
  CrowdScope,
  CrowdSeries,
  PlayerStats,
  Question,
  Rank,
  ScoredCall,
} from './types.ts';

export type ErrorResponse = {
  type: 'error';
  message: string;
};

export type TodayQuestion = {
  question: Question;
  yesPct: number;
  trend: CrowdPoint[];
};

export type TodayResponse = {
  type: 'today';
  // Game day and the day the calls are about, both YYYY-MM-DD.
  date: string;
  weatherDate: string;
  closesAt: string;
  questions: TodayQuestion[];
  calls: Call[];
  stats: PlayerStats;
  yesterday: ScoredCall[];
  playersToday: number;
  subRank?: Rank;
};

export type QuestionResponse = {
  type: 'question';
  question: Question;
  // The subreddit crowd's current yes %, which sets the call prices.
  yesPct: number;
  subreddit: CrowdSeries;
  all: CrowdSeries;
  markers: CallMarker[];
};

export type ResultsResponse = {
  type: 'results';
  // The day the settled calls were about, YYYY-MM-DD.
  weatherDate: string;
  // The first entry is the featured call (your hometown question when you made one).
  scored: ScoredCall[];
  // The subreddit crowd for the featured call's question, while it was open.
  featuredCrowd?: CrowdSeries;
  stats: PlayerStats;
  // You, your subreddit's crowd and all of Reddit, scored against the outcomes.
  accuracy: AccuracyEntry[];
  // The subreddit crowd that got the most questions right.
  sharpest?: { scope: CrowdScope; correct: number; total: number };
};

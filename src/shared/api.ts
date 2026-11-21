import type {
  Call,
  CallMarker,
  CrowdPoint,
  CrowdSeries,
  PlayerStats,
  Question,
  Rank,
  ScoredCall,
} from './types.ts';

export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
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

// For Over/Under questions, 'yes' is Over and 'no' is Under.
export type Side = 'yes' | 'no';

export type QuestionKind = 'overUnder' | 'yesNo';

export type QuestionCategory = 'hometown' | 'wild' | 'medium' | 'steady' | 'rain';

export type WeatherMetric = 'highTemp' | 'lowTemp' | 'precipitation';

export type Unit = 'F' | 'in' | '%';

export type Measurement = {
  value: number;
  unit: Unit;
};

// 'yes' wins when `actual <comparison> value`; measurable rain is { comparison: 'gte', value: 0.01 }.
export type SettlementRule = {
  metric: WeatherMetric;
  comparison: 'gt' | 'gte' | 'lt' | 'lte';
  value: number;
  unit: Unit;
};

export type City = {
  id: string;
  name: string;
  timeZone: string;
};

export type Question = {
  id: string;
  // YYYY-MM-DD in the city's local time zone.
  weatherDate: string;
  city: City;
  kind: QuestionKind;
  category: QuestionCategory;
  rule: SettlementRule;
  forecast: Measurement;
  prompt: string;
  headline: string;
  note?: string;
  opensAt: string;
  closesAt: string;
  settlesAt: string;
};

export type CrowdScope =
  | { kind: 'subreddit'; name: string }
  | { kind: 'all' };

export type CrowdPoint = {
  at: string;
  yesPct: number;
};

export type CrowdSeries = {
  scope: CrowdScope;
  points: CrowdPoint[];
  callCount: number;
};

export type CallMarker = {
  at: string;
  side: Side;
  yesPct: number;
};

export type Call = {
  questionId: string;
  side: Side;
  // The crowd's % on the chosen side when the call was locked.
  price: number;
  at: string;
};

export type Settlement = {
  questionId: string;
  actual: Measurement;
  winningSide: Side;
  settledAt: string;
};

export type ScoredCall = {
  question: Question;
  call: Call;
  settlement: Settlement;
  points: number;
};

export type Rank = {
  position: number;
  of?: number;
  scope: CrowdScope;
};

export type PlayerStats = {
  seasonPoints: number;
  streakDays: number;
  rank?: Rank;
};

export type AccuracyEntry = {
  label: string;
  correct: number;
  total: number;
};

import './ResultsScreen.css';
import type { ResultsResponse } from '../../shared/api';
import { rangeOf } from '../../shared/chartGeometry';
import { formatScope, formatSettles, formatWeekday } from '../../shared/format';
import { leaningSide, sideLabel, tallyDay } from '../../shared/scoring';
import type { CrowdSeries, ScoredCall } from '../../shared/types';
import {
  CrowdChart,
  CrowdComparison,
  FeaturedResult,
  PrimaryAction,
  QuestionResultRow,
  ResultHero,
} from '../components';

export type ResultsScreenProps = {
  results: ResultsResponse;
  // When today's calls settle, for the note under the button.
  todaySettlesAt?: string;
  onToday: () => void;
};

// True when you won and the crowd had leaned the other way at the close.
const beatCrowd = (scored: ScoredCall, crowd: CrowdSeries): boolean => {
  const last = crowd.points[crowd.points.length - 1];
  const crowdSide = last ? leaningSide(last.yesPct) : null;
  return (
    scored.points > 0 &&
    crowdSide !== null &&
    crowdSide !== scored.settlement.winningSide
  );
};

const FeaturedChart = ({
  scored,
  crowd,
}: {
  scored: ScoredCall;
  crowd: CrowdSeries;
}) => {
  const range = rangeOf(crowd.points);
  if (!range) return null;
  const { question, call, settlement } = scored;
  const callLabel = sideLabel(question.kind, call.side);
  const winnerLabel = sideLabel(question.kind, settlement.winningSide);
  const finalPct = crowd.points[crowd.points.length - 1]?.yesPct ?? 50;
  return (
    <CrowdChart
      ariaLabel={`Crowd ended at ${finalPct} percent ${sideLabel(question.kind, 'yes')}; ${winnerLabel} won; you called ${callLabel} at ${call.price}`}
      range={range}
      series={[
        {
          id: 'sub',
          label: formatScope(crowd.scope),
          points: crowd.points,
          emphasis: 'primary',
        },
      ]}
      you={{
        // The yes % at the moment of the call follows from its price.
        marker: {
          at: call.at,
          side: call.side,
          yesPct: call.side === 'yes' ? call.price : 100 - call.price,
        },
        label: `You: ${callLabel} at ${call.price}`,
      }}
      outcome={{
        winningSide: settlement.winningSide,
        label: `${winnerLabel.toUpperCase()} WON`,
      }}
      pctTicks={[50]}
    />
  );
};

export const ResultsScreen = ({
  results,
  todaySettlesAt,
  onToday,
}: ResultsScreenProps) => {
  const tally = tallyDay(results.scored);
  const [featured, ...rest] = results.scored;
  const crowd = results.featuredCrowd;
  const beat =
    featured && crowd && beatCrowd(featured, crowd)
      ? ` You beat the ${formatScope(crowd.scope)} crowd on your ${
          featured.question.category === 'hometown'
            ? 'hometown'
            : featured.question.city.name
        } question.`
      : '';
  const { sharpest } = results;

  return (
    <main data-screen="results">
      <ResultHero
        eyebrow={`${formatWeekday(results.weatherDate)}'s weather - results`}
        tally={tally}
        stats={results.stats}
        summary={`${tally.correct} of ${tally.total} right.${beat}`}
      />
      {featured ? (
        <FeaturedResult scored={featured}>
          {crowd ? <FeaturedChart scored={featured} crowd={crowd} /> : null}
        </FeaturedResult>
      ) : null}
      {rest.length > 0 ? (
        <ul data-part="rows">
          {rest.map((scored) => (
            <QuestionResultRow key={scored.question.id} scored={scored} />
          ))}
        </ul>
      ) : null}
      <CrowdComparison
        title="Crowds vs. the forecast"
        entries={results.accuracy}
        {...(sharpest
          ? {
              footnote: `${formatScope(sharpest.scope)} had the sharpest crowd: ${sharpest.correct} of ${sharpest.total}.`,
            }
          : {})}
      />
      <PrimaryAction
        label="Make today's calls"
        {...(todaySettlesAt
          ? { note: `Today's calls settle ${formatSettles(todaySettlesAt)}` }
          : {})}
        onClick={onToday}
      />
    </main>
  );
};

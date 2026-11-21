import { useState } from 'react';
import type { QuestionResponse } from '../../shared/api';
import { hourlyTicks, rangeOf } from '../../shared/chartGeometry';
import { formatCount, formatHourShort, formatScope } from '../../shared/format';
import {
  crowdStance,
  leaningSide,
  payoutFor,
  priceFor,
  sideLabel,
  sidePct,
} from '../../shared/scoring';
import type { Call, CrowdSeries, Side } from '../../shared/types';
import {
  BackNav,
  CallButton,
  ChartLegend,
  CrowdChart,
  CrowdPanel,
  QuestionHeader,
  SegmentedControl,
  type LegendItem,
} from '../components';

type Scope = 'subreddit' | 'all';

export type QuestionScreenProps = {
  detail: QuestionResponse;
  position: { index: number; total: number };
  call?: Call;
  onBack: () => void;
  onCall: (side: Side) => void;
};

const latestPct = (series: CrowdSeries): number =>
  series.points[series.points.length - 1]?.yesPct ?? 50;

export const QuestionScreen = ({
  detail,
  position,
  call,
  onBack,
  onCall,
}: QuestionScreenProps) => {
  const [scope, setScope] = useState<Scope>('subreddit');
  const { question } = detail;
  const shown = scope === 'subreddit' ? detail.subreddit : detail.all;
  const other = scope === 'subreddit' ? detail.all : detail.subreddit;
  const shownPct = latestPct(shown);
  const shownSide = leaningSide(shownPct) ?? 'yes';
  const range = rangeOf(detail.subreddit.points);
  const sides: Side[] = ['yes', 'no'];
  const yesLabel = sideLabel(question.kind, 'yes');
  const legend: LegendItem[] = [
    { id: 'shown', label: formatScope(shown.scope), kind: 'primary' },
    {
      id: 'other',
      label: `${formatScope(other.scope)} ${latestPct(other)}%`,
      kind: 'secondary',
    },
  ];
  if (scope === 'subreddit')
    legend.push({ id: 'calls', label: 'calls', kind: 'marker' });

  return (
    <main data-screen="question">
      <BackNav
        label="Today"
        onBack={onBack}
        trailing={`Question ${position.index + 1} of ${position.total}`}
      />
      <QuestionHeader question={question} />
      <CrowdPanel
        eyebrow={`${formatScope(shown.scope)} says`}
        value={`${sidePct(shownPct, shownSide)}%`}
        valueLabel={sideLabel(question.kind, shownSide)}
        controls={
          <SegmentedControl
            label="Crowd"
            value={scope}
            onChange={setScope}
            options={[
              {
                value: 'subreddit',
                label: formatScope(detail.subreddit.scope),
              },
              { value: 'all', label: formatScope(detail.all.scope) },
            ]}
          />
        }
      >
        {range ? (
          <CrowdChart
            ariaLabel={`Share calling ${yesLabel}: ${formatScope(shown.scope)} at ${shownPct} percent, ${formatScope(other.scope)} at ${latestPct(other)} percent`}
            range={range}
            series={[
              {
                id: 'other',
                label: formatScope(other.scope),
                points: other.points,
                emphasis: 'secondary',
              },
              {
                id: 'shown',
                label: formatScope(shown.scope),
                points: shown.points,
                emphasis: 'primary',
              },
            ]}
            {...(scope === 'subreddit' ? { markers: detail.markers } : {})}
            timeTicks={hourlyTicks(range, 3).map((at) => ({
              at,
              label: formatHourShort(at, question.city.timeZone),
            }))}
            showLatest
          />
        ) : null}
        <ChartLegend
          items={legend}
          trailing={`${formatCount(shown.callCount)} calls`}
        />
      </CrowdPanel>
      <section data-part="calls">
        {sides.map((side) => {
          const price = priceFor(detail.yesPct, side);
          return (
            <CallButton
              key={side}
              kind={question.kind}
              side={side}
              price={price}
              stance={crowdStance(price)}
              payout={payoutFor(price)}
              onSelect={onCall}
              disabled={call !== undefined}
            />
          );
        })}
      </section>
    </main>
  );
};

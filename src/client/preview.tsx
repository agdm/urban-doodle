// Temporary: remove with its devvit.json entrypoint and the splash button.
import { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { crowdStance, payoutFor, priceFor, tallyDay } from '../shared/scoring';
import type { Side } from '../shared/types';
import {
  BackNav,
  CallButton,
  CategoryBadge,
  ChartLegend,
  Countdown,
  CrowdChart,
  CrowdComparison,
  CrowdPanel,
  FeaturedResult,
  GameHeader,
  LockConfirmation,
  PayoutTiles,
  PointsTotal,
  PrimaryAction,
  QuestionCard,
  QuestionHeader,
  QuestionResultRow,
  ResultHero,
  ResultsTeaser,
  SectionHeader,
  SegmentedControl,
  ShareCallCard,
  SideButton,
  SignedPoints,
  Sparkline,
  StatTile,
  StatsFooter,
  StreakBadge,
} from './components';
import {
  accuracy,
  allRedditSeries,
  CHART_RANGE,
  crowdByQuestion,
  denverCall,
  denverMarkers,
  denverQuestion,
  denverSubSeries,
  NOW,
  playerStats,
  questions,
  timeTicks,
  yesterdayResults,
} from './preview/fixtures';

const log = (...args: unknown[]) => console.log('[preview]', ...args);

export const Section = ({ name, children }: { name: string; children: ReactNode }) => (
  <section>
    <hr />
    <h2>
      <code>{name}</code>
    </h2>
    {children}
  </section>
);

export const Preview = () => {
  const [scope, setScope] = useState<'sub' | 'all'>('sub');
  const [message, setMessage] = useState("I'm taking Under 48.5°F in Denver. That front is coming in early.");
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'shared'>('idle');

  const tally = tallyDay(yesterdayResults);
  const yesPct = 62;
  const sides: Side[] = ['yes', 'no'];
  const sanDiegoLocked: Side = 'no';
  const [featured, ...rest] = yesterdayResults;

  return (
    <main>
      {/* SVG strokes default to none; this only makes the charts visible here. */}
      <style>{`
        svg { max-width: 360px; display: block; overflow: visible; }
        svg text { font: 11px system-ui, sans-serif; }
        svg line, svg polyline { stroke: #999; stroke-width: 1; }
        svg [data-emphasis="primary"], [data-component="sparkline"] [data-part="line"] { stroke: #000; stroke-width: 2.5; }
        svg [data-emphasis="secondary"] { stroke-dasharray: 5 4; }
        svg [data-part="outcome"] rect { fill: #e5e5e5; }
        svg [data-part="markers"] circle { opacity: 0.5; }
      `}</style>
      <h1>Highball component preview</h1>
      <p>Unstyled. Sample data from the design canvas. Clicks log to the console.</p>

      <Section name="CategoryBadge">
        <CategoryBadge category="hometown" /> <CategoryBadge category="rain" />{' '}
        <CategoryBadge category="steady" /> <CategoryBadge category="wild" />
      </Section>
      <Section name="SignedPoints">
        <SignedPoints points={62} /> <SignedPoints points={-38} /> <SignedPoints points={0} />
      </Section>
      <Section name="PointsTotal / StreakBadge">
        <PointsTotal points={1240} /> <StreakBadge days={5} />
      </Section>
      <Section name="StatTile">
        <StatTile label="If Under wins" value={<SignedPoints points={62} />} />
      </Section>
      <Section name="Countdown">
        <Countdown label="Lock at midnight" until={denverQuestion.closesAt} now={NOW} />
      </Section>
      <Section name="SectionHeader">
        <SectionHeader
          title="Today's calls"
          aside={<Countdown label="Lock at midnight" until={denverQuestion.closesAt} now={NOW} />}
        />
      </Section>
      <Section name="SegmentedControl">
        <SegmentedControl
          label="Crowd"
          value={scope}
          onChange={setScope}
          options={[
            { value: 'sub', label: 'r/Denver' },
            { value: 'all', label: 'All Reddit' },
          ]}
        />
      </Section>
      <Section name="BackNav">
        <BackNav label="Today" onBack={() => log('back')} trailing="Question 1 of 3" />
      </Section>
      <Section name="Sparkline">
        <Sparkline points={denverSubSeries} />
      </Section>
      <Section name="SideButton">
        <SideButton kind="overUnder" side="yes" yesPct={62} onSelect={log} />
        <SideButton kind="overUnder" side="no" yesPct={62} onSelect={log} selected />
      </Section>
      <Section name="CallButton">
        {sides.map((side) => {
          const price = priceFor(yesPct, side);
          return (
            <CallButton
              key={side}
              kind="overUnder"
              side={side}
              price={price}
              stance={crowdStance(price)}
              payout={payoutFor(price)}
              onSelect={log}
            />
          );
        })}
      </Section>

      <Section name="GameHeader">
        <GameHeader title="Highball" subtitle="Fri, Nov 13 - calls on Saturday's weather" stats={playerStats} />
      </Section>
      <Section name="ResultsTeaser">
        <ResultsTeaser tally={tally} onOpen={() => log('open results')} />
      </Section>
      <Section name="QuestionCard">
        {questions.map((q) => {
          const crowd = crowdByQuestion[q.id];
          return crowd ? (
            <QuestionCard
              key={q.id}
              question={q}
              yesPct={crowd.yesPct}
              trend={crowd.trend}
              onOpen={(id) => log('open', id)}
              onSelectSide={(id, side) => log('call', id, side)}
              {...(q.id === 'q-san' ? { lockedSide: sanDiegoLocked } : {})}
            />
          ) : null;
        })}
      </Section>
      <Section name="StatsFooter">
        <StatsFooter
          playersToday={2184}
          subRank={{ position: 3, of: 41, scope: { kind: 'subreddit', name: 'Denver' } }}
          onLeaderboard={() => log('leaderboard')}
        />
      </Section>

      <Section name="QuestionHeader">
        <QuestionHeader question={denverQuestion} />
      </Section>
      <Section name="CrowdPanel + CrowdChart + ChartLegend (open question)">
        <CrowdPanel
          eyebrow={scope === 'sub' ? 'r/Denver says' : 'All Reddit says'}
          value={scope === 'sub' ? '62%' : '54%'}
          valueLabel="Over"
          controls={
            <SegmentedControl
              label="Crowd"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'sub', label: 'r/Denver' },
                { value: 'all', label: 'All Reddit' },
              ]}
            />
          }
        >
          <CrowdChart
            ariaLabel="Share calling Over since 7am: r/Denver rose from 50 to 62 percent, all of Reddit from 50 to 54 percent"
            range={CHART_RANGE}
            series={[
              { id: 'all', label: 'All Reddit', points: allRedditSeries, emphasis: 'secondary' },
              { id: 'sub', label: 'r/Denver', points: denverSubSeries, emphasis: 'primary' },
            ]}
            markers={denverMarkers}
            timeTicks={timeTicks}
            showLatest
          />
          <ChartLegend
            items={[
              { id: 'sub', label: 'r/Denver', kind: 'primary' },
              { id: 'all', label: 'All Reddit 54%', kind: 'secondary' },
              { id: 'calls', label: 'calls', kind: 'marker' },
            ]}
            trailing="418 calls"
          />
        </CrowdPanel>
      </Section>

      <Section name="LockConfirmation">
        <LockConfirmation question={denverQuestion} call={denverCall} settlesLabel="settles Sunday around 7am ET" />
      </Section>
      <Section name="PayoutTiles">
        <PayoutTiles kind="overUnder" side={denverCall.side} payout={payoutFor(denverCall.price)} />
      </Section>
      <Section name="CrowdChart (locked: your marker)">
        <CrowdChart
          ariaLabel="Crowd at 62 percent Over; your Under call is marked at the latest point"
          range={CHART_RANGE}
          series={[{ id: 'sub', label: 'r/Denver', points: denverSubSeries, emphasis: 'primary' }]}
          you={{ marker: { at: NOW, side: denverCall.side, yesPct: 62 }, label: 'You - Under at 38' }}
          pctTicks={[0, 50]}
        />
      </Section>
      <Section name="ShareCallCard">
        <ShareCallCard
          message={message}
          onMessageChange={setMessage}
          status={shareStatus}
          onShare={() => {
            setShareStatus('sharing');
            setTimeout(() => setShareStatus('shared'), 800);
          }}
        />
      </Section>
      <Section name="PrimaryAction">
        <PrimaryAction label="Next: Seattle rain" onClick={() => log('next')} />
      </Section>

      <Section name="ResultHero">
        <ResultHero
          eyebrow="Thursday's weather - results"
          tally={tally}
          stats={{ ...playerStats, streakDays: 6 }}
          summary="2 of 3 right. You beat the r/Denver crowd on your hometown question."
        />
      </Section>
      {featured ? (
        <Section name="FeaturedResult + CrowdChart (settled: outcome)">
          <FeaturedResult scored={featured}>
            <CrowdChart
              ariaLabel="Crowd ended at 64 percent Over; the outcome was Under; you called Under at 38 during the afternoon"
              range={CHART_RANGE}
              series={[{ id: 'sub', label: 'r/Denver', points: denverSubSeries, emphasis: 'primary' }]}
              you={{
                marker: { at: '2026-11-13T20:00:00Z', side: featured.call.side, yesPct: 57 },
                label: `You: Under at ${featured.call.price}`,
              }}
              outcome={{ winningSide: featured.settlement.winningSide, label: 'UNDER WON' }}
              pctTicks={[50]}
            />
          </FeaturedResult>
        </Section>
      ) : null}
      <Section name="QuestionResultRow">
        <ul>
          {rest.map((r) => (
            <QuestionResultRow key={r.question.id} scored={r} />
          ))}
        </ul>
      </Section>
      <Section name="CrowdComparison">
        <CrowdComparison
          title="Crowds vs. the forecast"
          entries={accuracy}
          footnote="r/Seattle had the sharpest crowd yesterday: 3 of 3."
        />
      </Section>
      <Section name="PrimaryAction (with note)">
        <PrimaryAction
          label="Make today's calls"
          note="Today's calls settle Sunday around 7am ET"
          onClick={() => log('today')}
        />
      </Section>
    </main>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>
);

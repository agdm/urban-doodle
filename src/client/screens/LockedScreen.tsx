import './LockedScreen.css';
import { useState } from 'react';
import type { QuestionResponse } from '../../shared/api';
import { rangeOf } from '../../shared/chartGeometry';
import {
  formatChoice,
  formatCount,
  formatScope,
  formatSettles,
} from '../../shared/format';
import { leaningSide, payoutFor, sideLabel } from '../../shared/scoring';
import type { Call } from '../../shared/types';
import {
  BackNav,
  CrowdChart,
  LockConfirmation,
  PayoutTiles,
  PrimaryAction,
  ShareCallCard,
} from '../components';

export type LockedScreenProps = {
  detail: QuestionResponse;
  call: Call;
  position: { index: number; total: number };
  // Label for the bottom button, e.g. "Next: Seattle rain".
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  onShare: (message: string) => void;
};

export const LockedScreen = ({
  detail,
  call,
  position,
  nextLabel,
  onBack,
  onNext,
  onShare,
}: LockedScreenProps) => {
  const { question, subreddit } = detail;
  const choice = formatChoice(question, call.side);
  const [message, setMessage] = useState(
    `I'm taking ${choice} in ${question.city.name}.`
  );
  const range = rangeOf(subreddit.points);
  const leaning = leaningSide(detail.yesPct);
  const yesLabel = sideLabel(question.kind, 'yes');
  // The yes % at the moment of the call follows from its price.
  const yesPctAtCall = call.side === 'yes' ? call.price : 100 - call.price;

  return (
    <main data-screen="locked">
      <BackNav
        label="Today"
        onBack={onBack}
        trailing={`Question ${position.index + 1} of ${position.total}`}
      />
      <LockConfirmation
        question={question}
        call={call}
        settlesLabel={formatSettles(question.settlesAt)}
      />
      <PayoutTiles
        kind={question.kind}
        side={call.side}
        payout={payoutFor(call.price)}
      />
      {range ? (
        <section data-part="crowd" data-side={leaning ?? undefined}>
          <header data-part="crowd-header">
            <span>
              {formatScope(subreddit.scope)} - % calling {yesLabel}
            </span>
            <span>{formatCount(subreddit.callCount)} calls</span>
          </header>
          <CrowdChart
            ariaLabel={`Crowd at ${detail.yesPct} percent ${yesLabel}; your ${sideLabel(question.kind, call.side)} call is marked`}
            range={range}
            series={[
              {
                id: 'sub',
                label: formatScope(subreddit.scope),
                points: subreddit.points,
                emphasis: 'primary',
              },
            ]}
            you={{
              marker: { at: call.at, side: call.side, yesPct: yesPctAtCall },
              label: `You - ${sideLabel(question.kind, call.side)} at ${call.price}`,
            }}
            pctTicks={[0, 50]}
          />
        </section>
      ) : null}
      <ShareCallCard
        message={message}
        onMessageChange={setMessage}
        onShare={() => onShare(message)}
      />
      <PrimaryAction label={nextLabel} onClick={onNext} />
    </main>
  );
};

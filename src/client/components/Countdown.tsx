import { durationUntil, formatDuration } from '../../shared/format';

export type CountdownProps = {
  until: string;
  // Passed in so the parent controls when it ticks.
  now: string;
  label?: string;
};

export const Countdown = ({ until, now, label }: CountdownProps) => (
  <span data-component="countdown">
    {label ? <span data-part="label">{label} - </span> : null}
    <time dateTime={until}>{formatDuration(durationUntil(until, now))}</time>
  </span>
);

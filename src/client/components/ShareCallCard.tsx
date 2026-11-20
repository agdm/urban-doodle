import { useId } from 'react';

export type ShareCallCardProps = {
  message: string;
  onMessageChange: (message: string) => void;
  onShare: () => void;
  status?: 'idle' | 'sharing' | 'shared';
};

export const ShareCallCard = ({
  message,
  onMessageChange,
  onShare,
  status = 'idle',
}: ShareCallCardProps) => {
  const id = useId();
  return (
    <section data-component="share-call-card" data-status={status}>
      <label htmlFor={id}>Post your call to the thread</label>
      <textarea
        id={id}
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        disabled={status !== 'idle'}
      />
      <button type="button" onClick={onShare} disabled={status !== 'idle' || !message.trim()}>
        {status === 'shared' ? 'Comment posted' : status === 'sharing' ? 'Posting...' : 'Comment my call'}
      </button>
    </section>
  );
};

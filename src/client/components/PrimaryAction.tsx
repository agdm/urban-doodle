import './PrimaryAction.css';
export type PrimaryActionProps = {
  label: string;
  onClick: () => void;
  note?: string;
  disabled?: boolean;
};

export const PrimaryAction = ({
  label,
  onClick,
  note,
  disabled = false,
}: PrimaryActionProps) => (
  <div data-component="primary-action">
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
    {note ? <p data-part="note">{note}</p> : null}
  </div>
);

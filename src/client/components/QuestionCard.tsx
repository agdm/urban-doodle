import './QuestionCard.css';
import { formatQuestionContext } from '../../shared/format';
import type { CrowdPoint, Question, Side } from '../../shared/types';
import { CategoryBadge } from './CategoryBadge';
import { SideButton } from './SideButton';
import { Sparkline } from './Sparkline';

export type QuestionCardProps = {
  question: Question;
  yesPct: number;
  trend: ReadonlyArray<CrowdPoint>;
  onOpen: (questionId: string) => void;
  // Omit to make the side buttons read-only.
  onSelectSide?: (questionId: string, side: Side) => void;
  lockedSide?: Side;
};

export const QuestionCard = ({
  question,
  yesPct,
  trend,
  onOpen,
  onSelectSide,
  lockedSide,
}: QuestionCardProps) => {
  const locked = lockedSide !== undefined;
  const select =
    onSelectSide && !locked
      ? (side: Side) => onSelectSide(question.id, side)
      : undefined;
  const sides: Side[] = ['yes', 'no'];

  return (
    <article
      data-component="question-card"
      data-category={question.category}
      data-locked={locked}
    >
      <header data-part="header">
        <div data-part="meta">
          <CategoryBadge category={question.category} />
          <span data-part="context">{formatQuestionContext(question)}</span>
        </div>
        <h3>
          <button type="button" onClick={() => onOpen(question.id)}>
            {question.prompt}
          </button>
        </h3>
        <Sparkline points={trend} />
      </header>
      <div data-part="sides">
        {sides.map((side) => (
          <SideButton
            key={side}
            kind={question.kind}
            side={side}
            yesPct={yesPct}
            selected={lockedSide === side}
            {...(select ? { onSelect: select } : {})}
          />
        ))}
      </div>
    </article>
  );
};

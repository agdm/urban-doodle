import './QuestionHeader.css';
import { formatForecast, formatWeatherDate } from '../../shared/format';
import type { Question } from '../../shared/types';
import { CategoryBadge } from './CategoryBadge';

export type QuestionHeaderProps = {
  question: Question;
};

export const QuestionHeader = ({ question }: QuestionHeaderProps) => (
  <header data-component="question-header" data-category={question.category}>
    <div data-part="meta">
      <CategoryBadge category={question.category} />
      <span data-part="context">
        {question.city.name} - {formatWeatherDate(question.weatherDate)}
      </span>
    </div>
    <h1>{question.headline}</h1>
    <p data-part="forecast">
      Official {formatForecast(question.forecast)}
      {question.note ? ` - ${question.note}` : ''}
    </p>
  </header>
);

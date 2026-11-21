import './CategoryBadge.css';
import type { QuestionCategory } from '../../shared/types';

const LABELS: Record<QuestionCategory, string> = {
  hometown: 'Hometown',
  wild: 'Wild card',
  medium: 'Medium',
  steady: 'Steady',
  rain: 'Rain',
};

export type CategoryBadgeProps = {
  category: QuestionCategory;
};

export const CategoryBadge = ({ category }: CategoryBadgeProps) => (
  <span data-component="category-badge" data-category={category}>
    {LABELS[category]}
  </span>
);

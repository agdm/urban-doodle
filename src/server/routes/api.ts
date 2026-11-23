import { Hono } from 'hono';
import type {
  ErrorResponse,
  QuestionResponse,
  ResultsResponse,
  TodayResponse,
} from '../../shared/api.ts';
import {
  questionSamples,
  resultsSample,
  todaySample,
} from '../../shared/sampleData.ts';

export const api = new Hono();

// Sample data until questions, crowds and results live in Redis.
api.get('/today', (c) => c.json<TodayResponse>(todaySample));

api.get('/question/:id', (c) => {
  const id = c.req.param('id');
  const detail = questionSamples.find((d) => d.question.id === id);
  if (!detail) {
    return c.json<ErrorResponse>(
      { type: 'error', message: `No question ${id}` },
      404
    );
  }
  return c.json<QuestionResponse>(detail);
});

api.get('/results', (c) => c.json<ResultsResponse>(resultsSample));

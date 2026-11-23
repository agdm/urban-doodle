import { Hono } from 'hono';
import type { TodayResponse } from '../../shared/api.ts';
import { todaySample } from '../../shared/sampleData.ts';

export const api = new Hono();

// Sample data until questions and crowds live in Redis.
api.get('/today', (c) => c.json<TodayResponse>(todaySample));

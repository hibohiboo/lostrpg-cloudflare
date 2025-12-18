import { Hono } from 'hono';
import { GAME_DATA } from '../data/game-data';

export const gameDataRouter = new Hono().get('/', (c) => c.json(GAME_DATA));

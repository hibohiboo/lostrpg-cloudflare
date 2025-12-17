import { Hono } from 'hono';
import { GAME_DATA } from '../data/game-data';

export const gameDataRouter = new Hono();

gameDataRouter.get('/', (c) => c.json(GAME_DATA));

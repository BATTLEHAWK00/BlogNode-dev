import { ServerMiddleware } from '../middleware';
import compress from './compress';
import logging from './logging';
import ssr from './ssr';

const middlewares:ServerMiddleware[] = [
  compress,
  logging,
  ssr,
];

export default middlewares;

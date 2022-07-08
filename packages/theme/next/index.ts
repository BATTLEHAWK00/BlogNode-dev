import { SsrMiddlewareInfo } from 'blognode';
import nextapp from './nextapp';

const { middleware } = nextapp;

const middlewareInfo: SsrMiddlewareInfo = {
  name: 'nextjs',
  prepare: middleware.prepare.bind(middleware),
  close: middleware.close.bind(middleware),
  render: middleware.render.bind(middleware),
  configure: nextapp.configure,
};

export default middlewareInfo;

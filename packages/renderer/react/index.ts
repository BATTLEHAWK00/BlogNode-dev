import { SsrMiddlewareInfo } from 'blognode';
import renderer from './renderer';

const middlewareInfo: SsrMiddlewareInfo = {
  name: 'react-renderer',
  prepare: () => {},
  close: () => {},
  render: renderer.render.bind(renderer),
  configure: renderer.configure.bind(renderer),
};

export default middlewareInfo;

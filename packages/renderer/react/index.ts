import renderer from './renderer';

registerRenderer({
  name: '@blognode/renderer-react',
  render: renderer.render.bind(renderer),
  prepare: renderer.prepare.bind(renderer),
});

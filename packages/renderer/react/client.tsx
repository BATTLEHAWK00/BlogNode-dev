/* eslint-disable no-console */
import reactDom from 'react-dom/client';
import React from 'react';
import blogNodeRoot from './root';

declare global{
  interface Window{
    __container: any
  }
}

function init(Component: React.FC<{ pageCtx: unknown }>): void {
  const startTime = new Date().getTime();
  const rootDom = document.getElementById('__blognode');
  const pageCtxJson = document.getElementById('__blognode-pagedata__');

  if (!rootDom) throw new Error('No mounting root found.');
  if (!pageCtxJson || !pageCtxJson.innerText) throw new Error('Page context not found.');

  const pageCtx = JSON.parse(pageCtxJson.innerText);

  const children = <Component pageCtx={pageCtx}/>;

  if (module.hot) {
    if (!window.__container) window.__container = reactDom.createRoot(rootDom);
    window.__container.render(children);
  } else reactDom.hydrateRoot(rootDom, children);

  const endTime = new Date().getTime();
  console.debug(`Page hydrated in ${endTime - startTime}ms.`);
}

export default {
  init,
};

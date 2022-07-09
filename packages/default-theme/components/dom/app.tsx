import React, { useContext } from 'react';
import Context from '../context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function App(props: any) {
  const { pageCtx, children: Children } = props;
  console.log(Children);

  let script = '';

  if (typeof process === 'object') {
    script = `window.__blogNodeCtx=${JSON.stringify(pageCtx)}`;
  }

  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>add</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="static/main.js" async defer />
      </head>
      <body>
        <div id="__blognode">
          <Context.PageContext.Provider value={pageCtx}>
            <Children />
          </Context.PageContext.Provider>
        </div>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </html>
  );
}

export default App;

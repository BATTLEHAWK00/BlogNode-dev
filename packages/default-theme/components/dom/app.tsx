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
    <>
      <div id="__blognode">
        <Context.PageContext.Provider value={pageCtx}>
          <Children />
        </Context.PageContext.Provider>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

export default App;

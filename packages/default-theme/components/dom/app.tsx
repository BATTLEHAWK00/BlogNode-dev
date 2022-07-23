import React, { useContext } from 'react';
import Context from '../context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function App(props: any) {
  const { pageCtx, children: Children } = props;
  console.log(Children);

  let pageData = '';

  if (typeof process !== 'object') {
    pageData = JSON.parse(document.getElementById('__blognode-pagedata__')?.innerText || '{}');
    console.log(pageData);
  }

  return (
    <>
      <div id="__blognode">
        <Context.PageContext.Provider value={pageCtx}>
          <Children />
        </Context.PageContext.Provider>
      </div>
    </>
  );
}

export default App;

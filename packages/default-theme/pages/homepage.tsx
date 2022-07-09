import React from 'react';
import App from '../components/dom/app';

function HomePage(pageCtx: any) {
  return (
    <>
      <App pageCtx={pageCtx}>
        {() => JSON.stringify(pageCtx)}
      </App>
    </>
  );
}

export default HomePage;

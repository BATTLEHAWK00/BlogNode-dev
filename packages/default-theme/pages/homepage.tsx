import React, { useContext } from 'react';
import context from '@components/context';
import { createPage } from '@util/page';

const HomePage = createPage(() => {
  const pageCtx = useContext(context.PageContext);
  return (
    <>
      <div>{JSON.stringify(pageCtx)}</div>
    </>
  );
});

export default HomePage;

import React, { FC } from 'react';
import NormalLayout from '@layout/normal';
import Context from '@components/context';

export function createPage(Content: FC, Layout: FC<{ children: unknown }> = NormalLayout) {
  return ({ pageCtx }: { pageCtx: unknown }) => (
    <Context.PageContext.Provider value={pageCtx}>
      <Layout>
        <Content />
      </Layout>
    </Context.PageContext.Provider>
  );
}

export default {};

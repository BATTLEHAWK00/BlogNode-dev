import { GetBlogNodeProps } from '@blognode/middleware-next';
import BasePage from 'components/BasePage';
import context from 'components/context';
import { GetServerSideProps } from 'next';
import React, { useContext, useEffect } from 'react';
import { makeServerSideProps } from 'util/pageprops';

class HomePage extends BasePage<JSX.Element> {
  protected setPageRenderer(): ()=> JSX.Element {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx: any = useContext(context.PageContext);
      console.log('test1');
      useEffect(() => {
        console.log('test2');
      });
      return (
        <>
          <h2>{ctx.pageTitle}</h2>
        </>
      );
    };
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { blogNodeCtx: { blogName, blogDesc } } = GetBlogNodeProps(ctx);
  return makeServerSideProps(ctx, {
    pageTitle: `${blogName} - ${blogDesc}`,
  });
};

export default new HomePage().getFinalPage();

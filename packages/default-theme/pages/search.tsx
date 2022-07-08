// import { GetBlogNodeProps } from '@blognode/middleware-next';
import BasePage from 'components/BasePage';
// import context from 'components/context';
// import PostsContent from 'components/post';
import { GetServerSideProps } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useContext } from 'react';

class HomePage extends BasePage<JSX.Element> {
  protected setPageTitle(): string | void {
    return '搜索结果';
  }
  // const { postContent }: any = useContext(context.PageContext);

  protected setPageRenderer(): (...args: any)=> JSX.Element {
    return () => (
      <>
        <h2>
          搜索结果：
          {/* {postContent} */}
        </h2>
        {/* <PostsContent postContent={postContent} /> */}
      </>
    );
  }
}

declare module 'http'{
  interface IncomingMessage{
    _ssrCtx: unknown
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test = '';
  return {
    props: {
      // blogName,
      title: `搜索结果：${ctx.query.s}`,
      postContent: ctx.query.s,
    },
  };
};

export default new HomePage().getFinalPage();

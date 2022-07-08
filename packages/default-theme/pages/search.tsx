import BasePage from 'components/BasePage';
import context from 'components/context';
import PostsContent from 'components/post';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';

class HomePage extends BasePage<JSX.Element> {
  protected setPageTitle(): string | void {
    return '搜索结果';
  }

  protected setPageRenderer(): (...args: any)=> JSX.Element {
    return () => {
      const { postContent }: any = useContext(context.PageContext);
      return (
        <>
          <h2>
            搜索结果：
            {postContent}
          </h2>
          <PostsContent postContent={postContent} />
        </>
      );
    };
  }
}

interface BlogNodeServerContext{
  blogName: string
}

declare module 'http'{
  interface IncomingMessage{
    blogNodeCtx: BlogNodeServerContext
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req: { blogNodeCtx: { blogName } } } = ctx;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test = '';
  return {
    props: {
      blogName,
      title: `搜索结果：${ctx.query.s}`,
      postContent: ctx.query.s,
    },
  };
};

export default new HomePage().getFinalPage();

import BasePage from '@src/components/BasePage';
import context from '@src/components/context';
import PostsContent from '@src/components/post';
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test = '';
  return {
    props: {
      title: `搜索结果：${ctx.query.s}`,
      postContent: ctx.query.s,
    },
  };
};

export default new HomePage().getFinalPage();

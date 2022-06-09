import BasePage from '@src/components/BasePage';
import context from '@src/components/context';
import PostsContent from '@src/components/post';
import { GetStaticProps } from 'next';
import React, { useContext } from 'react';

class HomePage extends BasePage<JSX.Element> {
  protected setPageTitle(): string | void {
    return '首页';
  }

  protected setPageRenderer(): (...args: any) => JSX.Element {
    // eslint-disable-next-line react/display-name
    return () => {
      const { postContent }:any = useContext(context.PageContext);
      return (
        <>
          <PostsContent postContent={postContent} />
        </>
      );
    };
  }
}

export const getStaticProps:GetStaticProps = () => ({
  props: {
    postContent: 'asdddddasd',
  },

});

export default new HomePage().getFinalPage();

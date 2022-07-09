/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetBlogNodeProps } from '@blognode/middleware-next';
import BasePage from 'components/BasePage';
import context from 'components/context';
import TextInput from 'components/textinput';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import { makeServerSideProps } from 'util/pageprops';

class LoginPage extends BasePage<JSX.Element> {
  protected setPageRenderer(): ()=> JSX.Element {
    return () => {
      const ctx: any = useContext(context.PageContext);
      return (
        <>
          <h2>登录</h2>
          <TextInput />
          <TextInput />
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

export default new LoginPage().getFinalPage();

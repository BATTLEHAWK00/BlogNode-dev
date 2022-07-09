import BasePage from 'components/BasePage';
import { GetServerSideProps } from 'next';
import React from 'react';
import { makeServerSideProps } from 'util/pageprops';

class SearchPage extends BasePage<JSX.Element> {
  protected setPageRenderer(): (...args: any)=> JSX.Element {
    return () => (
      <>
        <h2>
          搜索结果：
        </h2>
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log('asd');

  return makeServerSideProps(ctx, {
    pageTitle: 'asd',
  });
};

export default new SearchPage().getFinalPage();

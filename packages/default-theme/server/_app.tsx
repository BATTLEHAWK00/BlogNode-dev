import Context from 'components/context';
import NormalLayout from 'components/layout/normal';
import Head from 'next/head';
// import App from 'next/app';
import React from 'react';
// import SeoHeader, { ISeoProps } from 'components/seoheader';
import { BlogNodePageProps } from 'util/pageprops';

interface IAppProps<T extends React.Component>{
  Component: T,
  pageProps: BlogNodePageProps
}

function BlogNodeApp({ Component, pageProps }: IAppProps<any>) {
  const Layout = Component.Layout || NormalLayout;
  const pageTitle = pageProps.pageTitle || Component.pageTitle || 'BlogNode';
  // const { seo } = pageProps;
  return (
    <>
      <Context.PageContext.Provider value={pageProps}>
        <Head>
          <title>{pageTitle}</title>
          {/* <SeoHeader props={seo || {}} /> */}
          <meta name="robots" content="index,follow" />
          {/* <style>
            {pageProps.styles}
          </style> */}
        </Head>
        <Layout>
          <Component />
        </Layout>
      </Context.PageContext.Provider>
    </>
  );
}

export default BlogNodeApp;

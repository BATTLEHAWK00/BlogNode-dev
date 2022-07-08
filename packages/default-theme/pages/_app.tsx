import 'styles/main.css';
import 'remixicon/fonts/remixicon.css';

import Context from 'components/context';
import NormalLayout from 'components/layout/normal';
import Head from 'next/head';
// import App from 'next/app';
import React from 'react';
import SeoHeader, { ISeoProps } from 'components/seoheader';

interface IAppProps<T extends React.Component>{
  Component: T,
  // eslint-disable-next-line react/no-unused-prop-types
  pageProps: {
    title: string,
    styles: string,
    footerHtml: string,
    seo: ISeoProps
  }
}

function BlogNodeApp({ Component, pageProps }: IAppProps<any>) {
  const Layout = Component.Layout || NormalLayout;
  const pageTitle = pageProps.title || Component.pageTitle || 'BlogNode';
  const { seo } = pageProps;
  return (
    <>
      <Context.PageContext.Provider value={pageProps}>
        <Head>
          <title>{pageTitle}</title>
          <SeoHeader props={seo || {}} />
          <meta name="robots" content="index,follow" />
          <style>
            {pageProps.styles}
          </style>
        </Head>
        <Layout>
          <Component />
        </Layout>
      </Context.PageContext.Provider>
    </>
  );
}

// export function reportWebVitals(metric) {
//   // if (!window.metric) window.metric = {};
//   // window.metric[metric.name] = metric;
//   // if (metric.name === 'TTFB') {
//   //   // eslint-disable-next-line no-console
//   //   console.log(`Server TTFB: ${metric.value.toFixed(0)}ms`);
//   //   console.log(window.metric);
//   // }
// }

export default BlogNodeApp;

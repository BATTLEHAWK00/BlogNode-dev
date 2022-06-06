import '@src/styles/main.css';
import 'remixicon/fonts/remixicon.css';

import Context from '@src/components/context';
import NormalLayout from '@src/components/layout/normal';
import Head from 'next/head';
import React from 'react';
import SeoHeader, { ISeoProps } from '@src/components/seoheader';

interface IAppProps<T extends React.Component>{
  Component:T,
  pageProps:{
    title:string,
    styles:string,
    footerHtml:string,
    seo:ISeoProps
  }
}

function BlogNodeApp({ Component, pageProps }:IAppProps<any>) {
  const Layout = Component.Layout || NormalLayout;
  const pageTitle = Component.pageTitle || 'BlogNode';
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

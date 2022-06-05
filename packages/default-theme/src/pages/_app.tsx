import '@src/main.css';
import 'remixicon/fonts/remixicon.css';

import Context from '@src/components/context';
import NormalLayout from '@src/components/layout/normal';
import Head from 'next/head';
import React from 'react';

interface IAppProps<T extends React.Component>{
  Component:T,
  pageProps:{
    title:string,
    footerHtml:string
  }
}

function BlogNodeApp({ Component, pageProps }:IAppProps<any>) {
  const Layout = Component.Layout || NormalLayout;
  const pageTitle = Component.pageTitle || 'BlogNode';

  return (
    <>
      <Context.PageContext.Provider value={pageProps}>
        <Head>
          <title>{pageTitle}</title>
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

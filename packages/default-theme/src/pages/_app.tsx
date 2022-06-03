/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import React from 'react';

import '@public/main.css';
import { GetServerSideProps } from 'next';
import NormalLayout from '@src/components/layout/normal';

interface IAppProps<T extends React.Component>{
  Component:T,
  pageProps:{
    title:string,
    footerHtml:string
  }
}

function BlogNodeApp({ Component, pageProps }:IAppProps<any>) {
  const { title } = pageProps;
  return (
    <>
      <Head>
        <title>{title || 'BlogNode'}</title>
      </Head>
      <NormalLayout pageProps={pageProps}>
        <Component pageProps={pageProps} />
      </NormalLayout>
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

export const getServerSideProps:GetServerSideProps = async () => {
  const footerHtml = 'asdasdasd';
  console.log(footerHtml);

  return {
    props: {
      pageProps: {
        footerHtml,
      },
    },
  };
};

export default BlogNodeApp;

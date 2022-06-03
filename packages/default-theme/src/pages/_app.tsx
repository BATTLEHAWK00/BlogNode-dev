/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import React from 'react';

import '@public/main.css';

function BlogNodeApp(props:any) {
  const { Component, pageProps } = props;
  const { title } = pageProps;
  return (
    <>
      <Head>
        <title>{title || 'BlogNode'}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default BlogNodeApp;

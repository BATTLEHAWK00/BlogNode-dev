// import App from 'next/app';
import Head from 'next/head';
import React, { Component } from 'react';

import '../public/main.css';

interface IBlogNodeAppProps{
  pageProps: {
    title: string
  }
}

function BlogNodeApp(props:IBlogNodeAppProps) {
  const { pageProps } = props;
  const { title } = pageProps;
  return (
    <>
      <Head>
        <title>{title || 'BlogNode'}</title>
      </Head>
      <Component />
    </>
  );
}

export default BlogNodeApp;

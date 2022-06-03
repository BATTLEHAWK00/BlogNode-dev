import App from "next/app";
import Head from "next/head";
import React, { Component } from "react";

import "../public/main.css";

class BlogNodeApp extends App {
  render(): JSX.Element {
    const Component = this.props.Component;
    return (
      <>
        <Head>
          <title>{this.props.pageProps.title || "BlogNode"}</title>
        </Head>
        <Component {...this.props.pageProps} />
      </>
    );
  }
}

export default BlogNodeApp;

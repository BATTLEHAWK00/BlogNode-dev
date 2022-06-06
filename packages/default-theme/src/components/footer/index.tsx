/* eslint-disable react/no-danger */
import React from 'react';

import styles from './index.module.css';

interface IFooterProps{
  footerHtml:string
}

function Footer({ footerHtml }:IFooterProps) {
  return (
    <>
      <div className={[styles.footer, 'bn-content-block', 'bn-shadow'].join(' ')}>
        <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
        <p>Powered by BlogNode</p>
      </div>
    </>
  );
}

export default Footer;

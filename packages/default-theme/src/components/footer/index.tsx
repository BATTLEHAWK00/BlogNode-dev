import React from 'react';

import styles from './index.module.css';

interface IFooterProps{
  footerHtml:string
}

function Footer({ footerHtml }:IFooterProps) {
  return (
    <>
      <div className={styles.footer}>
        <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
        <p>Provided By BlogNode</p>
      </div>
    </>
  );
}

export default Footer;

import React from 'react';
import loadingSvg from './loading.svg';
import styles from './index.module.css';

function loadingBar() {
  return (
    <i className={styles.loadingSvg}>
      <img src={loadingSvg} alt="loading..." />
    </i>
  );
}
export default loadingBar;

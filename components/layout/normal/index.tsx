import React from 'react';
import NavBar from '../../navbar';
import styles from './index.module.css';

function NormalLayout(props:any) {
  const { children } = props;
  return (
    <>
      <NavBar />
      <main className={styles.main}>{children}</main>
    </>
  );
}

export default NormalLayout;

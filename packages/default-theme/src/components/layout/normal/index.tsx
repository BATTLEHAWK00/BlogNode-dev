import React from 'react';
import NavBar from '@components/navbar';
import styles from './index.module.css';

function NormalLayout(props:{ children:any }) {
  const { children } = props;
  return (
    <>
      <NavBar />
      <main className={styles.main}>{children}</main>
    </>
  );
}

export default NormalLayout;

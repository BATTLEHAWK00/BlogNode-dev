import { GetServerSideProps } from 'next';
import React from 'react';
import styles from './index.module.css';

function NavBar() {
  return (
    <nav className={styles.nav}>
      <h1>BlogNode</h1>
      <ul>
        <li>asd</li>
      </ul>
    </nav>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
  },
});

export default NavBar;

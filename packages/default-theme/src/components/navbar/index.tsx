import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

import styles from './index.module.css';
import NavItem, { INavItemProps } from './nav-item';

const SearchBar = dynamic(() => import('./searchbar'), { ssr: false });
/* eslint-disable react/no-array-index-key */
// import SearchBar from './searchbar';
const NavBar = ({ items = [] }:{ items:INavItemProps[] }) => {
  const navItems = items.map((props) => (
    <li key={props.name}>
      <NavItem props={props} />
    </li>
  ));
  return (
    <nav className={styles.nav}>
      <div className={styles['nav-container']}>
        <h1 className={styles['nav-logo']}>
          <Link href="/">BlogNode</Link>
        </h1>
        <ul className={styles['nav-item-list']}>
          {navItems}
        </ul>
      </div>
      <div className={styles['nav-container']}>
        <SearchBar />
      </div>
    </nav>
  );
};

export default NavBar;

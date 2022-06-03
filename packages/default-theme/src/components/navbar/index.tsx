/* eslint-disable react/no-array-index-key */
import Link from 'next/link';
import React from 'react';
import styles from './index.module.css';
// import SearchBar from './searchbar';

export interface INavBarItem{
  name:string,
  displayName?:string,
  linkTo:string,
}

function NavBar({ items }:{ items:INavBarItem[] }) {
  return (
    <nav className={styles.nav}>
      <h1 className={styles['navbar-logo']}>
        <Link href="/">BlogNode</Link>
      </h1>
      <div className={styles['navbar-container']}>
        <ul className={styles['navbar-item-list']}>
          {
          items && items.map(({ name, displayName, linkTo }) => (
            <li key={name}>
              <Link href={linkTo}>
                {displayName || name}
              </Link>
            </li>
          ))
        }
        </ul>
        {/* <SearchBar /> */}
      </div>
    </nav>
  );
}

export default NavBar;

import Link from 'next/link';
import React from 'react';

import RemixIcon from '../remixicon';
import styles from './index.module.css';

/* eslint-disable react/no-array-index-key */
// import SearchBar from './searchbar';

export interface INavBarItem{
  name:string,
  iconName?:string,
  displayName?:string,
  linkTo:string,
}

function NavBar({ items }:{ items:INavBarItem[] }) {
  return (
    <nav className={styles.nav}>
      <h1 className={styles['nav-logo']}>
        <Link href="/">BlogNode</Link>
      </h1>
      <div className={styles['nav-container']}>
        <ul className={styles['nav-item-list']}>
          {items && items.map(({
            name, displayName, iconName, linkTo,
          }) => (
            <li key={name}>
              <Link href={linkTo}>
                <span className={`${styles['nav-item']}`}>
                  {iconName && <RemixIcon iconName={iconName} />}
                  &nbsp;
                  {displayName || name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {/* <SearchBar /> */}
      </div>
    </nav>
  );
}

export default NavBar;

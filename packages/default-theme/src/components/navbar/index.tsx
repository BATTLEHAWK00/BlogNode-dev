import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useContext } from 'react';
import context from '../context';

import styles from './index.module.css';
import NavItem, { INavItemProps } from './nav-item';

const SearchBar = dynamic(() => import('./searchbar'), { ssr: false });
const NavBar = ({ items = [] }: { items: INavItemProps[] }) => {
  const { blogName }: any = useContext(context.PageContext);
  const navItems = items.map((props) => (
    <li key={props.name}>
      <NavItem props={props} />
    </li>
  ));
  return (
    <nav className={styles.nav}>
      <div className={styles['nav-container']}>
        <h1 className={styles['nav-logo']}>
          <Link href="/">{blogName || 'BlogNode'}</Link>
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

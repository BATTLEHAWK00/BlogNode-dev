import loadingBar from '@components/loading';
import React, { lazy, Suspense, useContext } from 'react';
import context from '../context';

import styles from './index.module.css';
import NavItem, { INavItemProps } from './nav-item';

const SearchBar = lazy(() => import('./searchbar'));
const NavBar = ({ items = [] }: { items: INavItemProps[] }) => {
  const { blogNodeCtx: { blogName } }: any = useContext(context.PageContext);
  const navItems = items.map((props) => (
    <li key={props.name}>
      <NavItem props={props} />
    </li>
  ));
  return (
    <nav className={styles.nav}>
      <div className={styles['nav-container']}>
        <h1 className={styles['nav-logo']}>
          <a href="/">{blogName || 'BlogNode'}</a>
        </h1>
        <ul className={styles['nav-item-list']}>
          {navItems}
        </ul>
      </div>
      <div className={styles['nav-container']}>
        <Suspense fallback={loadingBar()}>
          <SearchBar />
        </Suspense>
      </div>
    </nav>
  );
};

export default NavBar;

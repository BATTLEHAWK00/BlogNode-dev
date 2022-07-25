import loadingBar from '@components/loading';
import React, { lazy, Suspense, useContext } from 'react';
import { LoadStyleModule } from '@/util/style';
import context from '../context';

import styles from './index.module.css';
import NavItem, { INavItemProps } from './nav-item';

const SearchBar = lazy(() => import('./searchbar'));

const styleModule = LoadStyleModule(styles);

const NavBar = ({ items = [] }: { items: INavItemProps[] }) => {
  const { blogNodeCtx: { blogName } }: any = useContext(context.PageContext);
  const navItems = items.map((props) => (
    <li key={props.name}>
      <NavItem props={props} />
    </li>
  ));
  return (
    <nav className={styleModule('nav')}>
      <div className={styleModule('nav-container')}>
        <h1 className={styleModule('nav-logo')}>
          <a href="/">{blogName}</a>
        </h1>
        <ul className={styleModule('nav-item-list')}>
          {navItems}
        </ul>
      </div>
      <div className={styleModule('nav-container')}>
        <Suspense fallback={loadingBar()}>
          <SearchBar />
        </Suspense>
      </div>
    </nav>
  );
};

export default NavBar;

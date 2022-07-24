import RemixIcon from '@components/remixicon';
import React from 'react';

import styles from './index.module.css';

export interface INavItemProps{
  name: string,
  iconName?: string,
  displayName?: string,
  linkTo: string,
}

function NavItem({ props }: { props: INavItemProps }) {
  const {
    linkTo, iconName, displayName, name,
  } = props;
  return (
    <>
      <a href={linkTo} className={styles['nav-item-a']}>
        <span className={`${styles['nav-item']}`}>
          {iconName && <RemixIcon iconName={iconName} className={styles['item-icon']} />}
                  &nbsp;
          <span>{displayName || name}</span>
        </span>
      </a>
    </>
  );
}

export default NavItem;

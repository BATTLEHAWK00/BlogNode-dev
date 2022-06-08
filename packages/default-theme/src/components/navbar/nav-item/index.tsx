import RemixIcon from '@src/components/remixicon';
import Link from 'next/link';
import React from 'react';

import styles from './index.module.css';

export interface INavItemProps{
  name:string,
  iconName?:string,
  displayName?:string,
  linkTo:string,
}

function NavItem({ props }:{ props:INavItemProps }) {
  const {
    linkTo, iconName, displayName, name,
  } = props;
  return (
    <>
      <Link href={linkTo} replace>
        <span className={`${styles['nav-item']}`}>
          {iconName && <RemixIcon iconName={iconName} className={styles['item-icon']} />}
                  &nbsp;
          <span>{displayName || name}</span>
        </span>
      </Link>
    </>
  );
}

export default NavItem;

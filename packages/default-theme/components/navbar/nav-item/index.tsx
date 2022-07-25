import RemixIcon from '@components/remixicon';
import React from 'react';
import { LoadStyleModule } from '@/util/style';

import styles from './index.module.css';

export interface INavItemProps{
  name: string,
  iconName?: string,
  displayName?: string,
  linkTo: string,
}

const styleModule = LoadStyleModule(styles);

function NavItem({ props }: { props: INavItemProps }) {
  const {
    linkTo, iconName, displayName, name,
  } = props;
  return (
    <>
      <a href={linkTo} className={styleModule('nav-item-a')}>
        <span className={`${styleModule('nav-item')}`}>
          {iconName && <RemixIcon iconName={iconName} className={styleModule('item-icon')} />}
                  &nbsp;
          <span>{displayName || name}</span>
        </span>
      </a>
    </>
  );
}

export default NavItem;

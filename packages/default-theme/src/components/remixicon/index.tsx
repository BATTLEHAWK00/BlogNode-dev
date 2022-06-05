import React from 'react';

import styles from './index.module.css';

interface IRemixIconProps{
  iconName:string,
  // eslint-disable-next-line react/require-default-props
  prop?:'ri-fw' | 'ri-xxs' | 'ri-sm' | 'ri-1x' | 'ri-lg' | 'ri-xl' | 'ri-2x' | 'ri-3x' | undefined
}

function RemixIcon({ iconName, prop }:IRemixIconProps) {
  const classNames = [
    iconName,
    prop || '',
    styles.icon,
  ].join(' ');
  return (
    <>
      <i className={classNames} />
    </>
  );
}

export default RemixIcon;

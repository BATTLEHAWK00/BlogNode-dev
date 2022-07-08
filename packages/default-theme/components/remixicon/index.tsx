/* eslint-disable react/require-default-props */
import React from 'react';

import styles from './index.module.css';

interface IRemixIconProps{
  iconName: string,
  // eslint-disable-next-line react/require-default-props
  prop?: 'ri-fw' | 'ri-xxs' | 'ri-sm' | 'ri-1x' | 'ri-lg' | 'ri-xl' | 'ri-2x' | 'ri-3x' | undefined,
  className?: string
}

function RemixIcon({ iconName, prop, className }: IRemixIconProps) {
  const classNames = [
    iconName,
    prop || '',
    styles.icon,
    className,
  ].join(' ');
  return (
    <i className={classNames} />
  );
}

export default RemixIcon;

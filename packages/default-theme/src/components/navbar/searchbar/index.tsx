/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import RemixIcon from '@src/components/remixicon';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

type OnInputChange = React.ChangeEventHandler<HTMLInputElement>;

function SearchBar() {
  const router = useRouter();

  const handleSearch = _.throttle<OnInputChange>((evt) => {
    const { value } = evt.target;
    if (value) router.replace({ pathname: '/search', query: { s: value } });
  }, 500, { leading: false });

  return (
    <div className={styles['searchbar-container']}>
      <input
        type="text"
        placeholder="Search something..."
        className={styles.searchbar}
        onChange={handleSearch}
      />
      <span className={styles['searchbar-button']}>
        <RemixIcon iconName="ri-search-2-line" prop="ri-lg" />
      </span>
    </div>
  );
}

export default SearchBar;

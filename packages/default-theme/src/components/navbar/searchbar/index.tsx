/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import RemixIcon from '@src/components/remixicon';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearch = _.throttle(() => {
    if (searchText) router.replace({ pathname: '/search', query: { s: searchText } });
  }, 500, { leading: false });

  useEffect(handleSearch, [searchText]);

  return (
    <>
      <div className={styles['searchbar-container']}>
        <input
          type="text"
          placeholder="Search something..."
          className={styles.searchbar}
          value={searchText}
          onChange={(evt) => setSearchText(evt.target.value)}
        />
        <Link href={{ pathname: '/search', query: { s: searchText } }} replace>
          <span className={styles['searchbar-button']}>
            <RemixIcon iconName="ri-search-2-line" prop="ri-lg" />
          </span>
        </Link>
      </div>
    </>
  );
}

export default SearchBar;

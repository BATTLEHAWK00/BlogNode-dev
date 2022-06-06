/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import RemixIcon from '@src/components/remixicon';
import React, { useState } from 'react';
import styles from './index.module.css';

function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const handleSearch:React.MouseEventHandler<HTMLSpanElement> = () => {
  };
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
        <span onClick={handleSearch} className={styles['searchbar-button']}>
          <RemixIcon iconName="ri-search-2-line" prop="ri-lg" />
        </span>
      </div>
    </>
  );
}

export default SearchBar;

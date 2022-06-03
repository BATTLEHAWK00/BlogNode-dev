import React, { useEffect } from 'react';
import NavBar, { INavBarItem } from '@components/navbar';
import styles from './index.module.css';

const navbarItems:INavBarItem[] = [
  {
    name: 'posts',
    displayName: '文章',
    linkTo: '/posts',
  },
  {
    name: 'mood',
    displayName: '说说',
    linkTo: '/mood',
  },
  {
    name: 'category',
    displayName: '分类',
    linkTo: '/category',
  },
  {
    name: 'about',
    displayName: '关于',
    linkTo: '/about',
  },
];

interface IPageProps{
  footerHtml:string
}

function NormalLayout({ children, pageProps }:{ children:any | undefined, pageProps:IPageProps }) {
  const { footerHtml } = pageProps;
  useEffect(() => {
    // console.log(window.metrics);
  });

  return (
    <>
      <NavBar items={navbarItems} />
      <main className={styles.main}>{children}</main>
      <footer>
        {footerHtml || ''}
      </footer>
    </>
  );
}
export default NormalLayout;

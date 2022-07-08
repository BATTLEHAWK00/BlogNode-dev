import NavBar from 'components/navbar';
import context from 'components/context';
import Footer from 'components/footer';
import { INavItemProps } from 'components/navbar/nav-item';
import React, { useContext } from 'react';

import styles from './index.module.css';

const navbarItems: INavItemProps[] = [
  {
    name: 'posts',
    displayName: '文章',
    linkTo: '/posts',
    iconName: 'ri-article-line',
  },
  {
    name: 'mood',
    displayName: '说说',
    linkTo: '/mood',
    iconName: 'ri-emotion-line',
  },
  {
    name: 'category',
    displayName: '分类',
    linkTo: '/category',
    iconName: 'ri-file-text-line',
  },
  {
    name: 'about',
    displayName: '关于',
    linkTo: '/about',
    iconName: 'ri-user-line',
  },
];

function NormalLayout({ children }: { children: any | undefined }) {
  const { footerHtml }: any = useContext(context.PageContext);
  return (
    <>
      <NavBar items={navbarItems} />
      <main className={[styles.main, 'bn-content-block', 'bn-shadow'].join(' ')}>{children}</main>
      <footer>
        <Footer footerHtml={footerHtml} />
      </footer>
    </>
  );
}
export default NormalLayout;

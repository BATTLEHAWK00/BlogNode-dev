import React from 'react';
import { GetServerSideProps } from 'next';
import NormalLayout from '@layout/normal';

function HomePage() {
  return <NormalLayout>{JSON.stringify({})}</NormalLayout>;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    title: '首页',
    // users: JSON.stringify(await user.getAllUsers()),
  },
});

export default HomePage;

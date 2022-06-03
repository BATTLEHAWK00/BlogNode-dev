import React from 'react';
import { GetServerSideProps } from 'next';
import user from '../src/orm/model/userModel';
import NormalLayout from '../components/layout/normal';

function Hello(props: any) {
  const { users } = props;
  return <NormalLayout>{JSON.stringify(users)}</NormalLayout>;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    title: '首页',
    users: JSON.stringify(await user.getAllUsers()),
  },
});

export default Hello;

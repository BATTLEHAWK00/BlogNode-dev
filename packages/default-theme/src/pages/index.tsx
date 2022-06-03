import React from 'react';
import { GetServerSideProps } from 'next';
import PostsContent from '@src/components/post';

function HomePage({ pageProps }:any) {
  console.log(pageProps);
  const { postContent } = pageProps;
  return (
    <>
      <PostsContent postContent={postContent} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    title: '首页',
    postContent: 'asdasdsa',
    // users: JSON.stringify(await user.getAllUsers()),
  },
});

export default HomePage;

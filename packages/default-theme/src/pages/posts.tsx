import context from '@src/components/context';
import PostsContent from '@src/components/post';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';

function HomePage() {
  const { postContent }:any = useContext(context.PageContext);
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

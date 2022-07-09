/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import { GetServerSidePropsContext } from 'next';
import { BlogNodeServerContext } from 'blognode';

interface BlogNodeProps{
  blogNodeCtx: BlogNodeServerContext
  pageCtx: any
}

// eslint-disable-next-line import/prefer-default-export
export function GetBlogNodeProps(ctx: GetServerSidePropsContext): BlogNodeProps {
  return {
    blogNodeCtx: ctx.req._blogNodeCtx,
    pageCtx: ctx.req._ssrCtx,
  };
}

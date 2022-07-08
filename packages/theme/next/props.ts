/* eslint-disable no-underscore-dangle */
import { GetServerSidePropsContext } from 'next';

interface BlogNodeProps{
  blogNodeCtx: unknown
  pageCtx: unknown
}

// eslint-disable-next-line import/prefer-default-export
export function GetBlogNodeProps(ctx: GetServerSidePropsContext): BlogNodeProps {
  return {
    blogNodeCtx: ctx.req._blogNodeCtx,
    pageCtx: ctx.req._ssrCtx,
  };
}

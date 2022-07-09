import { GetBlogNodeProps } from '@blognode/middleware-next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export interface BlogNodePageProps extends Record<string, unknown>{
  pageTitle?: string
  pageCtx?: unknown
  blogNodeCtx: unknown
}
type ServerSideCtx = GetServerSidePropsContext;
type ServerSideResult<T> = GetServerSidePropsResult<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeServerSideProps(ctx: ServerSideCtx, additionalCtx: any): ServerSideResult<any> {
  const { pageCtx, blogNodeCtx } = GetBlogNodeProps(ctx);
  return {
    props: {
      pageCtx,
      blogNodeCtx,
      ...additionalCtx,
    },
  };
}

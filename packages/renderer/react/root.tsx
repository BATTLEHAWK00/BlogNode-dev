import React, { FC } from 'react';

export default function blogNodeRoot(pageCtx: unknown, PageComponent: FC<{ pageCtx: unknown }>) {
  return (
    <div id="__blognode">
      <PageComponent pageCtx={pageCtx} />
    </div>
  );
}

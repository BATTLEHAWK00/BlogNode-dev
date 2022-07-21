import React, { Component, FunctionComponent } from 'react';

interface GlobalProps<T extends FunctionComponent | Component>{
  pageCtx: unknown
  Com: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function blogNodeRoot({ pageCtx, Com }: GlobalProps<any>): JSX.Element {
  return (
        <div id="__blognode">
            <Com pageCtx={pageCtx}/>
        </div>
  );
}

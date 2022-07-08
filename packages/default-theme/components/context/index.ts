import React from 'react';

function createContext<T>(name: string, defaultValue: T) {
  const ctx = React.createContext(defaultValue);
  ctx.displayName = name;
  return ctx;
}

const PageContext = createContext('PageContext', {});

export default {
  PageContext,
};

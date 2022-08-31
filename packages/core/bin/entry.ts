#!/usr/bin/env node
import cli from '@src/cli';

const isDev = process.env.NODE_ENV === 'development';
const entryPath: string = isDev ? '../src/main.ts' : '../src/main.js';

cli.init({
  entryPath,
});
cli.start();

// todo: import resolver
// eslint-disable-next-line import/prefer-default-export
export const resolve = (specifier, ctx, defaultResolve) => {

};

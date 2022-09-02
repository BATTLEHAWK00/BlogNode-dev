#!/usr/bin/env node --no-warnings --experimental-import-meta-resolve --experimental-specifier-resolution=node
import cli from '@src/cli';

const isDev = process.env.NODE_ENV === 'development';

const entryPath: string = isDev ? '../src/main.ts' : '../src/main.js';

cli.init({
  entryPath,
});
cli.start();

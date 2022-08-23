#!/usr/bin/env node
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cac } from 'cac';
import dotenv from 'dotenv';
import fs from 'fs';

import type PackageInfo from '../package.json';

const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line import/no-dynamic-require,@typescript-eslint/no-var-requires
const packageInfo: typeof PackageInfo = require(isDev ? '../package.json' : '../../package.json');
const entryPath: string = isDev ? '../src/entry.ts' : '../src/entry.js';

declare global{
  // eslint-disable-next-line no-var,vars-on-top
  var parsedArgs: {
    options: Record<string, unknown>,
    args: readonly string[]
  };
}

const cli = cac(packageInfo.name);

cli.version(packageInfo.version);

cli.help((sections: { title?: string, body: string }[]) => {
  sections.splice(1, 0, {
    body: `Github repo: ${packageInfo.repository}`,
  });
  return sections;
});

cli.option('--env <option>', 'Set path of .env file to be loaded');

cli.command('start', 'Start BlogNode server')
  .option('--loglevel <trace|debug|info|warn|error>', 'Set log level')
  // eslint-disable-next-line global-require
  .action(() => import(entryPath));

cli.command('set <option> <value>', 'Set system option value');

cli.command('get <option> <value>', 'Get system option value');

cli.command('').action(() => {
  if (!cli.args.length) cli.outputHelp();
  else console.error('Invalid command: %s', cli.args.join(' '));
});

try {
  global.parsedArgs = cli.parse();
  const envPath = <string | undefined>global.parsedArgs.options.env;
  if (envPath) {
    if (!fs.existsSync(envPath)) throw new Error(".env file doesn't exists.");
    dotenv.config({ path: envPath });
  } else if (fs.existsSync('.env')) dotenv.config({ path: '.env' });
} catch (e) {
  if (e instanceof Error) console.error(e.message);
  process.exit(1);
}
